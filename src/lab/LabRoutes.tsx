import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WebGLIntegration from './experiments/webgl/WebGLIntegration';


const LabRoutes = () => {
  return (
    <Routes>
        <Route path="/web-gl-integration" element={<WebGLIntegration />} />
    </Routes>
  );
};

export default LabRoutes;