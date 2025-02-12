import React from "react";
import { Route, Routes } from "react-router-dom";
import WebGLIntegration from "./experiments/webgl/WebGLIntegration";
import StereoLayer from "./experiments/webgl/StereoLayer";
import HexaGrid from "./experiments/game/HexaGrid";
import AddAUnitOnMap from "./experiments/game/AddAUnitOnMap";
import GameTheater from "./experiments/gamev2/GameTheater";

const LabRoutes = () => {
  return (
    <Routes>
      <Route path="/web-gl-integration" element={<WebGLIntegration />} />
      <Route path="/three-stereo" element={<StereoLayer />} />
      <Route path="/hexa-grid" element={<HexaGrid />} />
      <Route path="/add-a-unit" element={<AddAUnitOnMap />} />
      <Route path="/game-theater" element={<GameTheater />} />
    </Routes>
  );
};

export default LabRoutes;
