import React from "react";
import { useNavigate } from "react-router-dom";
import experimentData from './experiments.json';

interface ExperimentSection {
  title: string;
  experiments: Array<{
    id: string;
    name: string;
    description: string;
    status: 'completed' | 'planned';
    url: string;
  }>;
}

const { experimentSections } = experimentData as { experimentSections: ExperimentSection[] };

const Lab: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'planned': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const handleExperimentClick = (url: string) => {
    navigate(url);
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        borderBottom: '2px solid #333',
        paddingBottom: '0.5rem',
        marginBottom: '2rem'
      }}>
        Laboratory
      </h1>

      {experimentSections.map((section, sectionIndex) => (
        <div key={sectionIndex} style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            color: '#444',
            marginBottom: '1rem'
          }}>
            {section.title}
          </h2>
          
          <div style={{ 
            display: 'grid',
            gap: '1rem'
          }}>
            {section.experiments.map((experiment) => (
              <div
                key={experiment.id}
                onClick={() => handleExperimentClick(experiment.url)}
                style={{
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(experiment.status),
                    display: 'inline-block'
                  }} />
                  <h3 style={{ margin: 0 }}>{experiment.name}</h3>
                </div>
                <p style={{ 
                  margin: '0',
                  color: '#666'
                }}>
                  {experiment.description}
                </p>
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#888',
                  textTransform: 'capitalize' as const
                }}>
                  Status: {experiment.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Lab;