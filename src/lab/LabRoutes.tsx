import React from "react";
import { Route, Routes } from "react-router-dom";
import WebGLIntegration from "./experiments/webgl/WebGLIntegration";
import StereoLayer from "./experiments/webgl/StereoLayer";
import GameTheaterv1 from "./experiments/gamev1/GameTheaterv1";
import GameTheaterv1_1 from "./experiments/gamev1_1/GameTheaterv1_1";

const LabRoutes = () => {
  return (
    <Routes>
      <Route path="/web-gl-integration" element={<WebGLIntegration />} />
      <Route path="/three-stereo" element={<StereoLayer />} />
      <Route path="/game-theater-v1" element={<GameTheaterv1 />} />
      <Route path="/game-theater-v1_1" element={<GameTheaterv1_1 />} />
    </Routes>
  );
};

export default LabRoutes;
