import React, { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import Webcam from "react-webcam";
import { drawHandMesh } from "./helperFiles/helperFunctions";
import { Box } from "@mui/material";
import { Alphabet } from "../gestures/alphabet";

const Camera = ({ setCurGesture }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {startHandPose()}, []);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const startHandPose = async () => {
    const neuralNet = await handpose.load();
    console.log("Hand Pose has been loaded");

    setInterval(() => {
      detectHands(neuralNet);
    }, 10);
  };

  const detectHands = async (neuralNet) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const ctx = canvasRef.current.getContext("2d");

      webcamRef.current.video.width = video.videoWidth;
      webcamRef.current.video.height = video.videoHeight;

      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      const hand = await neuralNet.estimateHands(video);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          Alphabet.aslLetterA,
          Alphabet.aslLetterB,
          Alphabet.aslLetterC,
          Alphabet.aslLetterD,
          Alphabet.aslLetterE,
          Alphabet.aslLetterF,
          Alphabet.aslLetterG,
          Alphabet.aslLetterH,
          Alphabet.aslLetterI,
          Alphabet.aslLetterJ,
          Alphabet.aslLetterK,
          Alphabet.aslLetterL,
          Alphabet.aslLetterM,
          Alphabet.aslLetterN,
          Alphabet.aslLetterO,
          Alphabet.aslLetterP,
          Alphabet.aslLetterQ,
          Alphabet.aslLetterR,
          Alphabet.aslLetterS,
          Alphabet.aslLetterT,
          Alphabet.aslLetterU,
          Alphabet.aslLetterV,
          Alphabet.aslLetterW,
          Alphabet.aslLetterX,
          Alphabet.aslLetterY,
          Alphabet.aslLetterZ,
        ]);

        const estimateGesture = await GE.estimate(hand[0].landmarks, 6.5);

        if (estimateGesture.gestures !== undefined && estimateGesture.gestures.length > 0) {
          setCurGesture(estimateGesture.gestures[0].name);
        }
      }

      drawHandMesh(hand, ctx);
    }
  };

  

  return (
    <div>
      <Box>
      <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            margin: "auto",
            width: 640,
            height: 480,
            zIndex: 1
          }}
        />
        <Webcam
          ref={webcamRef}
          style={{
            position:"absolute",
            margin: "auto",
            width: 640,
            height: 480,
          }}
          videoConstraints={videoConstraints}
        />
      </Box>
    </div>
  );
};

export default Camera;
