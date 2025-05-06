import { ArtifactSet, Artifact } from '../types/ArtifactTypes';
import gladiatorSet from './sets/gladiator-finale.json';
import wandererSet from './sets/wanderer-troupe.json';
import independenceSet from './sets/independence-legacy.json';
import goldenAgeSet from './sets/golden-age.json';
import fallOfLighthouseSet from './sets/fall-of-lighthouse.json';
// Add new sets here as they are created
const artifactSetFiles = [
  gladiatorSet,
  wandererSet,
  independenceSet,
  goldenAgeSet,
  fallOfLighthouseSet
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