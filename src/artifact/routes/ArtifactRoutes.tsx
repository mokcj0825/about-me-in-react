import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ArtifactsList } from '../components/ArtifactsList';
import { ArtifactSetDetail } from '../components/ArtifactSetDetail';
import { ArtifactDetail } from '../components/ArtifactDetail';

/**
 * Routes for the Artifacts feature
 * These routes should be included in your main application router
 */
export const ArtifactRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ArtifactsList />} />
      <Route path="/sets/:setId" element={<ArtifactSetDetail />} />
      <Route path="/detail/:artifactId" element={<ArtifactDetail />} />
    </Routes>
  );
}; 