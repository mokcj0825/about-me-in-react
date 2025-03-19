import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { artifactSets } from '../data/artifact-loader';

export const ArtifactsList: React.FC = () => {
  const [filter, setFilter] = useState<string>('');

  // Filter artifacts based on search term
  const filteredSets = artifactSets.filter(set => 
    set.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Artifact Collection</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search artifact sets..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {filteredSets.map(set => (
          <Link 
            key={set.id} 
            to={`/artifact/sets/${set.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <h2 style={{ marginTop: 0 }}>{set.name}</h2>
              <p style={{ color: '#666', flex: 1 }}>{set.description}</p>
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Set Bonuses:</div>
                <div style={{ color: '#444', marginBottom: '5px' }}>2-Piece: {set.bonuses.twoPiece}</div>
                <div style={{ color: '#444' }}>4-Piece: {set.bonuses.fourPiece}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}; 