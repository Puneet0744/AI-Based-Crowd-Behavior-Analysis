import cv2
import supervision as sv
from ultralytics import YOLO

# Load YOLOv8 model
model = YOLO("yolov8s.pt")

VIDEO_PATH = "videoplayback2.mp4"

cap = cv2.VideoCapture(VIDEO_PATH)

# Get FPS
fps = int(cap.get(cv2.CAP_PROP_FPS))
frame_interval = fps * 5   # 5 seconds

frame_count = 0
people_in_frame = 0

# Bounding box annotator
box_annotator = sv.BoxAnnotator(thickness=2)

while True:

    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1

    # Detect people every frame
    results = model(frame, classes=[0], imgsz=640)

    detections = sv.Detections.from_ultralytics(results[0])

    # Draw bounding boxes
    frame = box_annotator.annotate(scene=frame, detections=detections)

    # Update count every 5 seconds
    if frame_count % frame_interval == 0:
        people_in_frame = len(detections)
        print("People in frame:", people_in_frame)

    # Display count
    cv2.putText(frame, f"People Count (5s): {people_in_frame}",
                (30,50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0,255,255),
                2)

    cv2.imshow("People Counting", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()