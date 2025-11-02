import React from "react";
import { useNavigate } from "react-router-dom";
import experimentData from './experiments.json';

interface ExperimentSection {
  title: string;
  experiments: Array<{
    id: string;
    name: string;
    description: string;
    status: 'completed' | 'planned' | 'in-progress';
    url: string;
  }>;
}

const { experimentSections } = experimentData as { experimentSections: ExperimentSection[] };

const Lab: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'planned': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const handleExperimentClick = (url: string) => {
    navigate(url);
  };

  return (
    <div style={{
      height: '100vh',
      overflow: 'auto',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          borderBottom: '2px solid #333',
          paddingBottom: '0.5rem',
          marginBottom: '2rem',
          position: 'sticky',
          top: 0,
          backgroundColor: '#f5f5f5',
          zIndex: 1,
          padding: '1rem 0'
        }}>
          Laboratory
        </h1>

        {experimentSections.map((section, sectionIndex) => (
          <div key={sectionIndex} style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              color: '#444',
              marginBottom: '1rem',
              position: 'sticky',
              top: '80px',
              backgroundColor: '#f5f5f5',
              zIndex: 1,
              padding: '0.5rem 0'
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
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
    </div>
  );
};

export default Lab;