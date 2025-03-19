import { ArtifactSet, Artifact } from '../types/ArtifactTypes';
import gladiatorSet from './sets/gladiator-finale.json';
import wandererSet from './sets/wanderer-troupe.json';

// Add new sets here as they are created
const artifactSetFiles = [
  gladiatorSet,
  wandererSet
];

// Type assertion for imported JSON
export const artifactSets: ArtifactSet[] = artifactSetFiles as unknown as ArtifactSet[];

// Extract all artifacts from all sets
export const artifacts: Artifact[] = artifactSets.flatMap(set => 
  set.pieces.map(piece => ({
    ...piece,
    setId: set.id
  }))
); 