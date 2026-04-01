from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Optional, Sequence

import numpy as np
import pandas as pd


class IouEvaluate:
	def __init__(self, model: str | Path, dataset_path: str | Path, conf_threshold: float = 0.25):
		self.model = model
		self.dataset_path = dataset_path
		self.conf_threshold = conf_threshold


	@staticmethod
	def get_attributes(model, source: str | Path, conf_threshold: float = 0.0) -> pd.DataFrame:
		"""
    	Run model inference and extract normalized detection attributes.

        Args:
            model: Ultralytics YOLO model instance (e.g., YOLO("best.pt")).
            source: Image path, directory, video path, or any supported YOLO source.
            conf_threshold: Minimum confidence to keep a detection.

        Returns:
            Pandas DataFrame with one row per detection.
            Bounding-box values are normalized percentages in [0, 1].
        """
		results = model(source=str(source))
		rows: List[Dict[str, object]] = []

		for r in results:
			boxes_xywhn = []
			classes = []
			confidences = []

			if hasattr(r, "boxes") and r.boxes is not None:
				boxes_xywhn = r.boxes.xywhn.tolist()
				if hasattr(r.boxes, "cls") and r.boxes.cls is not None:
					classes = r.boxes.cls.tolist()
				if hasattr(r.boxes, "conf") and r.boxes.conf is not None:
					confidences = r.boxes.conf.tolist()

			names = getattr(r, "names", {})
			image_path = getattr(r, "path", "")

			for idx, box in enumerate(boxes_xywhn):
				x_center, y_center, width, height = map(float, box)
				confidence = float(confidences[idx]) if idx < len(confidences) else 0.0
				if confidence < conf_threshold:
					continue

				cls = int(classes[idx]) if idx < len(classes) else -1
				name = names.get(cls, str(cls)) if isinstance(names, dict) else str(cls)
				width = max(0.0, min(1.0, width))
				height = max(0.0, min(1.0, height))
				x_center = max(0.0, min(1.0, x_center))
				y_center = max(0.0, min(1.0, y_center))

				rows.append(
					{
						"image_path": image_path,
						"bbox_xywhn": [x_center, y_center, width, height],
						"x_center": x_center,
						"y_center": y_center,
						"width": width,
						"height": height,
						"area": width * height,
						"class_id": cls,
						"name": name,
						"confidence": confidence,
					}
				)

		return pd.DataFrame(
			rows,
			columns=[
				"image_path",
				"bbox_xywhn",
				"x_center",
				"y_center",
				"width",
				"height",
				"area",
				"class_id",
				"name",
				"confidence",
			],
		)


	@staticmethod
	def _xywhn_to_xyxy(
		x_center: float, y_center: float, width: float, height: float
		) -> np.ndarray:
		x1 = x_center - width / 2.0
		y1 = y_center - height / 2.0
		x2 = x_center + width / 2.0
		y2 = y_center + height / 2.0
		return np.array([x1, y1, x2, y2], dtype=np.float32)


	@staticmethod
	def _box_iou_xyxy(box_a: np.ndarray, box_b: np.ndarray) -> float:
		x1 = max(box_a[0], box_b[0])
		y1 = max(box_a[1], box_b[1])
		x2 = min(box_a[2], box_b[2])
		y2 = min(box_a[3], box_b[3])

		inter_w = max(0.0, x2 - x1)
		inter_h = max(0.0, y2 - y1)
		inter = inter_w * inter_h

		area_a = max(0.0, box_a[2] - box_a[0]) * max(0.0, box_a[3] - box_a[1])
		area_b = max(0.0, box_b[2] - box_b[0]) * max(0.0, box_b[3] - box_b[1])
		union = area_a + area_b - inter

		if union <= 0.0:
			return 0.0
		return float(inter / union)


	@staticmethod
	def _greedy_match_ious(
		gt_boxes: Sequence[np.ndarray],
		gt_classes: Sequence[int],
		pred_boxes: Sequence[np.ndarray],
		pred_classes: Optional[Sequence[int]] = None,
		) -> List[float]:
		matched_pred = set()
		ious: List[float] = []

		for gt_idx, gt_box in enumerate(gt_boxes):
			gt_class = gt_classes[gt_idx]
			best_iou = 0.0
			best_pred_idx = None

			for pred_idx, pred_box in enumerate(pred_boxes):
				if pred_idx in matched_pred:
					continue
				if pred_classes is not None and int(pred_classes[pred_idx]) != int(gt_class):
					continue

				iou = IouEvaluate._box_iou_xyxy(gt_box, pred_box)
				if iou > best_iou:
					best_iou = iou
					best_pred_idx = pred_idx

			ious.append(best_iou)
			if best_pred_idx is not None:
				matched_pred.add(best_pred_idx)

		return ious


	@staticmethod
	def compute_iou(ground_truth_dir: str | Path, results) -> Dict[str, object]:
		"""
		Compute IoU between YOLO ground-truth labels and YOLO prediction results.

		Args:
			ground_truth_dir: Folder of YOLO label txt files.
				Each line: "class x_center y_center width height" (normalized),
				or "x_center y_center width height" for single-class labels.
				Label file name should match image stem (e.g. image_1.jpg -> image_1.txt).
			results: Output list from Ultralytics model inference:
				results = trained_model_best(source="dataset/data")

		Returns:
			Dict with:
				- "per_image_iou": {image_name: [iou_per_gt_box, ...]}
				- "mean_iou": mean IoU over all ground-truth boxes
				- "num_gt_boxes": total number of ground-truth boxes
		"""
		gt_dir = Path(ground_truth_dir)
		if not gt_dir.exists():
			raise FileNotFoundError(f"Ground-truth folder not found: {gt_dir}")

		per_image_iou: Dict[str, List[float]] = {}
		all_ious: List[float] = []

		for r in results:
			image_path = Path(getattr(r, "path", ""))
			image_stem = image_path.stem if image_path else ""
			label_path = gt_dir / f"{image_stem}.txt"

			if not label_path.exists():
				continue

			gt_boxes: List[np.ndarray] = []
			gt_classes: List[int] = []

			with label_path.open("r", encoding="utf-8") as f:
				for line in f:
					line = line.strip()
					if not line:
						continue

					parts = line.split()
					if len(parts) not in (4, 5):
						continue

					if len(parts) == 5:
						cls, x_c, y_c, w, h = parts
						cls_id = int(float(cls))
					else:
						x_c, y_c, w, h = parts
						cls_id = 0

					gt_classes.append(cls_id)
					gt_boxes.append(IouEvaluate._xywhn_to_xyxy(float(x_c), float(y_c), float(w), float(h)))

			if not gt_boxes:
				per_image_iou[image_stem] = []
				continue

			if not hasattr(r, "boxes") or r.boxes is None:
				pred_xyxy = np.empty((0, 4), dtype=np.float32)
			else:
				pred_xyxy = r.boxes.xyxyn.detach().cpu().numpy()
			pred_boxes = [pred_xyxy[i].astype(np.float32) for i in range(len(pred_xyxy))]

			pred_classes = None
			if hasattr(r, "boxes") and r.boxes is not None and hasattr(r.boxes, "cls") and r.boxes.cls is not None:
				pred_classes = r.boxes.cls.detach().cpu().numpy().astype(np.int32).tolist()

			image_ious = IouEvaluate._greedy_match_ious(
				gt_boxes=gt_boxes,
				gt_classes=gt_classes,
				pred_boxes=pred_boxes,
				pred_classes=pred_classes,
			)

			per_image_iou[image_stem] = image_ious
			all_ious.extend(image_ious)

		mean_iou = float(np.mean(all_ious)) if all_ious else 0.0
		return {
			"per_image_iou": per_image_iou,
			"mean_iou": mean_iou,
			"num_gt_boxes": len(all_ious),
		}

	@staticmethod
	def add_bounding_box(
		image_path: str | Path,
		model_path: str | Path = "content/runs/detect/train2/weights/best.pt",
		conf_threshold: float = 0.25,
		show_window: bool = True,
	) -> tuple[np.ndarray, pd.DataFrame]:
		"""
		Draw detected bounding boxes on an image using normalized YOLO coordinates.
		Returns the annotated image and the detection dataframe.
		"""
		import cv2
		from ultralytics import YOLO

		image_path = Path(image_path)
		model = YOLO(str(model_path))
		attributes = IouEvaluate.get_attributes(model=model, source=str(image_path), conf_threshold=conf_threshold)

		image = cv2.imread(str(image_path))
		if image is None:
			raise FileNotFoundError(f"Could not read image: {image_path}")

		img_h, img_w = image.shape[:2]

		for _, row in attributes.iterrows():
			x_center = float(row["x_center"]) * img_w
			y_center = float(row["y_center"]) * img_h
			box_w = float(row["width"]) * img_w
			box_h = float(row["height"]) * img_h

			x1 = int(max(0, x_center - box_w / 2.0))
			y1 = int(max(0, y_center - box_h / 2.0))
			x2 = int(min(img_w - 1, x_center + box_w / 2.0))
			y2 = int(min(img_h - 1, y_center + box_h / 2.0))

			cv2.rectangle(image, (x1, y1), (x2, y2), (255, 255, 255), -1)

		# remove top 10% of image, to hide qr code and url
		#cv2.rectangle(image, (0, 0), (img_w, int(img_h*0.116)), (255, 255, 255), -1)


		if show_window:
			cv2.imshow("Image", image)
			cv2.waitKey(0)
			cv2.destroyAllWindows()

		return [image, attributes]
