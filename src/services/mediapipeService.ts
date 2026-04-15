// @ts-ignore
import { 
  HandLandmarker, 
  FaceLandmarker, 
  FilesetResolver 
} from "@mediapipe/tasks-vision";

let handLandmarker: any = null;
let faceLandmarker: any = null;

export async function initMediaPipe() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numHands: 2
  });

  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    outputFaceBlendshapes: true
  });

  return { handLandmarker, faceLandmarker };
}

export function getLandmarkers() {
  return { handLandmarker, faceLandmarker };
}
