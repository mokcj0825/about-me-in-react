import React from "react";
import { Route, Routes } from "react-router-dom";
import WebGLIntegration from "./experiments/webgl/WebGLIntegration";
import StereoLayer from "./experiments/webgl/StereoLayer";
import GameTheaterv1 from "./experiments/gamev1/GameTheaterv1";
import GameTheaterv1_1 from "./experiments/gamev1_1/GameTheaterv1_1";
import GameTheaterv1_2 from "./experiments/gamev1_2/GameTheaterv1_2";
import GameTheaterv1_3 from "./experiments/gamev1_3/GameTheaterv1_3";
import GameTheaterv1_4 from "./experiments/gamev1_4/GameTheaterv1_4";
import DptTheater from "./experiments/dpt/DptTheater";

const LabRoutes = () => {
  return (
    <Routes>
      <Route path="/web-gl-integration" element={<WebGLIntegration />} />
      <Route path="/three-stereo" element={<StereoLayer />} />
      <Route path="/game-theater-v1" element={<GameTheaterv1 />} />
      <Route path="/game-theater-v1_1" element={<GameTheaterv1_1 />} />
      <Route path="/game-theater-v1_2" element={<GameTheaterv1_2 />} />
      <Route path="/game-theater-v1_3" element={<GameTheaterv1_3 />} />
      <Route path="/game-theater-v1_4" element={<GameTheaterv1_4 />} />
      <Route path="/dpt" element={<DptTheater />} />
    </Routes>
  );
};

export default LabRoutes;
