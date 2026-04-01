from ultralytics import YOLO
import pandas as pd
import cv2
import os

from .iou_eval import IouEvaluate

class HandwritingDetector:
    

    def __init__(self):
        self.model = YOLO("../best.pt")
    
    

if __name__ == "__main__" :
    image = "backend/image3.jpg"
    model_path = "backend/apps/services/handwriting_detector/best.pt"
   
    copy = IouEvaluate.add_bounding_box(image, model_path, show_window=False)[0]
    cv2.imshow("copy", copy)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    
    
	
