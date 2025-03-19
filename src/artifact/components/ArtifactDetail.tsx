import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { artifactSets, artifacts } from '../data/artifact-loader';

export const ArtifactDetail: React.FC = () => {
  const { artifactId } = useParams<{ artifactId: string }>();
  const artifact = artifacts.find(a => a.id === artifactId);
  
  if (!artifact) {
    return <div>Artifact not found</div>;
  }
  
  const set = artifactSets.find(s => s.id === artifact.setId);
  
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/artifact/sets/${artifact.setId}`} style={{
          textDecoration: 'none',
          color: '#666',
          display: 'inline-flex',
          alignItems: 'center'
        }}>
          ← Back to {set?.name}
        </Link>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          marginRight: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {artifact.image ? (
            <img 
              src={artifact.image} 
              alt={artifact.name} 
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              borderRadius: '8px',
              fontSize: '30px'
            }}>{artifact.type.charAt(0).toUpperCase()}</div>
          )}
        </div>
        <div>
          <h1 style={{ margin: 0, marginBottom: '5px' }}>{artifact.name}</h1>
          <div style={{ color: '#666', marginBottom: '5px' }}>
            {set?.name} • {artifact.type.charAt(0).toUpperCase() + artifact.type.slice(1)}
          </div>
          <div style={{ color: 'gold', fontSize: '20px' }}>{"★".repeat(artifact.rarity)}</div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '30px',
        lineHeight: '1.6',
        fontSize: '18px',
        borderLeft: '4px solid #666'
      }}>
        <h2 style={{ marginTop: 0 }}>Lore</h2>
        <p style={{ margin: 0 }}>{artifact.lore}</p>
      </div>
      
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ marginTop: 0 }}>Set Bonuses</h2>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>2-Piece:</span> {set?.bonuses.twoPiece}
        </div>
        <div>
          <span style={{ fontWeight: 'bold' }}>4-Piece:</span> {set?.bonuses.fourPiece}
        </div>
      </div>
    </div>
  );
}; 