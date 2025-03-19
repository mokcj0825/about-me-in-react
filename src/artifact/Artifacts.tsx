import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArtifactsList } from './components/ArtifactsList';

/**
 * Main Artifacts component that serves as an entry point to the artifacts feature
 * This component can be used directly in places where you want to show the artifacts list
 * with navigation capabilities
 */
export const Artifacts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // If we're already on an artifacts page, render nothing (the routes will handle it)
  // Otherwise, render the ArtifactsList component
  if (location.pathname.startsWith('/artifact') && location.pathname !== '/artifact') {
    return null;
  }
  
  return <ArtifactsList />;
};

