import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Canvas from './canvas/Canvas';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Canvas />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/stash" element={<div>Still under construction</div>} />
        <Route path="/labs" element={<div>Still under construction</div>} />
      </Routes>
    </Router>
  );
};

export default App;