import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { artifactSets, artifacts } from '../data/artifact-loader';

export const ArtifactSetDetail: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const set = artifactSets.find(s => s.id === setId);
  
  if (!set) {
    return <div>Artifact set not found</div>;
  }
  
  const setArtifacts = artifacts.filter(a => a.setId === setId);
  
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/artifact" style={{
          textDecoration: 'none',
          color: '#666',
          display: 'inline-flex',
          alignItems: 'center'
        }}>
          ← Back to All Sets
        </Link>
      </div>
      
      <h1>{set.name}</h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '20px' }}>{set.description}</p>
      
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0 }}>Set Bonuses</h3>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>2-Piece:</span> {set.bonuses.twoPiece}
        </div>
        <div>
          <span style={{ fontWeight: 'bold' }}>4-Piece:</span> {set.bonuses.fourPiece}
        </div>
      </div>
      
      <h2>Artifacts in this Set</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {setArtifacts.map(artifact => (
          <Link 
            key={artifact.id} 
            to={`/artifact/detail/${artifact.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              display: 'flex',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                marginRight: '15px',
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
                    borderRadius: '4px',
                    fontSize: '20px'
                  }}>{artifact.type.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{artifact.name}</div>
                <div style={{ color: '#666', marginBottom: '5px' }}>{artifact.type.charAt(0).toUpperCase() + artifact.type.slice(1)}</div>
                <div style={{ color: 'gold' }}>{"★".repeat(artifact.rarity)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}; 