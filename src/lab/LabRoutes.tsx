import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WebGLIntegration from './experiments/webgl/WebGLIntegration';
import StereoLayer from "./experiments/webgl/StereoLayer";


const LabRoutes = () => {
  return (
    <Routes>
        <Route path="/web-gl-integration" element={<WebGLIntegration />} />
        <Route path="/three-stereo" element={<StereoLayer />} />
    </Routes>
  );
};

export default LabRoutes;