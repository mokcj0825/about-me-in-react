import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Canvas from './canvas/Canvas';
import Lab from "./lab/Lab";
import Stash from "./stash/Stash";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Canvas />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/stash" element={<Stash />} />
        <Route path="/labs" element={<Lab />} />
      </Routes>
    </Router>
  );
};

export default App;