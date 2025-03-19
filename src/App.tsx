import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Canvas from './canvas/Canvas';
import Lab from "./lab/Lab";
import Stash from "./stash/Stash";
import LabRoutes from './lab/LabRoutes';
import {Artifacts} from "./artifact/Artifacts";
import { ArtifactRoutes } from './artifact';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Canvas />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/stash" element={<Stash />} />
        <Route path="/labs" element={<Lab />} />
        <Route path="/labs/*" element={<LabRoutes />} />
        <Route path="/artifact" element={<Artifacts />} />
        <Route path="/artifact/*" element={<ArtifactRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;