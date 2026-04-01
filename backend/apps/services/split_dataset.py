from pathlib import Path
import random
import shutil

def split_dataset(dataset_root="new-dataset", output_root="split-dataset", seed=42):
    """
    Input:
      dataset_root/
        images/
        labels/

    Output:
      output_root/
        images/train, images/val, images/test
        labels/train, labels/val, labels/test
    """
    dataset_root = Path(dataset_root)
    output_root = Path(output_root)

    images_src = dataset_root / "images"
    labels_src = dataset_root / "labels"

    if not images_src.is_dir() or not labels_src.is_dir():
        raise FileNotFoundError("Expected dataset_root/images and dataset_root/labels")

    image_map = {p.stem: p for p in images_src.iterdir() if p.is_file()}
    label_map = {p.stem: p for p in labels_src.iterdir() if p.is_file()}

    # use only matched pairs
    stems = list(set(image_map) & set(label_map))
    if not stems:
        raise ValueError("No matched image/label pairs found.")

    random.Random(seed).shuffle(stems)

    n = len(stems)
    n_train = int(n * 0.8)
    n_val = int(n * 0.1)

    splits = {
        "train": stems[:n_train],
        "val": stems[n_train:n_train + n_val],
        "test": stems[n_train + n_val:],
    }

    # create output folders
    for kind in ["images", "labels"]:
        for split in ["train", "val", "test"]:
            (output_root / kind / split).mkdir(parents=True, exist_ok=True)

    # copy files
    for split, split_stems in splits.items():
        for stem in split_stems:
            shutil.copy2(image_map[stem], output_root / "images" / split / image_map[stem].name)
            shutil.copy2(label_map[stem], output_root / "labels" / split / label_map[stem].name)

    return {
        "total_pairs": n,
        "train": len(splits["train"]),
        "val": len(splits["val"]),
        "test": len(splits["test"]),
    }
