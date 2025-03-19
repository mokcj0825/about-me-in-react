export interface Artifact {
  id: string;
  name: string;
  type: 'flower' | 'feather' | 'sands' | 'goblet' | 'circlet';
  rarity: number;
  setId: string;
  lore: string;
  image?: string;
}

export interface ArtifactSet {
  id: string;
  name: string;
  description: string;
  bonuses: {
    twoPiece: string;
    fourPiece: string;
  };
  pieces: Omit<Artifact, 'setId'>[];
} 