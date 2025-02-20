import React from "react";
import { Route, Routes } from "react-router-dom";
import WebGLIntegration from "./experiments/webgl/WebGLIntegration";
import StereoLayer from "./experiments/webgl/StereoLayer";
import GameTheaterv1 from "./experiments/gamev1/GameTheaterv1";
import GameTheaterv1_1 from "./experiments/gamev1_1/GameTheaterv1_1";
import GameTheaterv1_2 from "./experiments/gamev1_2/GameTheaterv1_2";

const LabRoutes = () => {
  return (
    <Routes>
      <Route path="/web-gl-integration" element={<WebGLIntegration />} />
      <Route path="/three-stereo" element={<StereoLayer />} />
      <Route path="/game-theater-v1" element={<GameTheaterv1 />} />
      <Route path="/game-theater-v1_1" element={<GameTheaterv1_1 />} />
      <Route path="/game-theater-v1_2" element={<GameTheaterv1_2 />} />
    </Routes>
  );
};

export default LabRoutes;
