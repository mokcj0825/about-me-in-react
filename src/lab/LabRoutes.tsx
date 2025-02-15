import React from "react";
import { Route, Routes } from "react-router-dom";
import WebGLIntegration from "./experiments/webgl/WebGLIntegration";
import StereoLayer from "./experiments/webgl/StereoLayer";
import HexaGrid from "./experiments/game/HexaGrid";
import AddAUnitOnMap from "./experiments/game/AddAUnitOnMap";
import GameTheater from "./experiments/gamev2/GameTheater";
import GameTheaterv3 from "./experiments/gamev3/GameTheaterv3";
import GameTheaterv4 from "./experiments/gamev4/GameTheaterv4";

const LabRoutes = () => {
  return (
    <Routes>
      <Route path="/web-gl-integration" element={<WebGLIntegration />} />
      <Route path="/three-stereo" element={<StereoLayer />} />
      <Route path="/hexa-grid" element={<HexaGrid />} />
      <Route path="/add-a-unit" element={<AddAUnitOnMap />} />
      <Route path="/game-theater" element={<GameTheater />} />
      <Route path="/game-theater-v3" element={<GameTheaterv3 />} />
      <Route path="/game-theater-v4" element={<GameTheaterv4 />} />
    </Routes>
  );
};

export default LabRoutes;
