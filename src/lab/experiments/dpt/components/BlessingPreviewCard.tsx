import React from 'react';
import { BlessingPreview } from '../type/BlessingPreview';

interface BlessingPreviewCardProps {
  preview: BlessingPreview;
}

export const BlessingPreviewCard: React.FC<BlessingPreviewCardProps> = ({ preview }) => {
  return (
    <div style={{
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ margin: '0 0 12px 0' }}>{preview.name}</h3>
      <div style={{ 
        display: 'inline-block',
        padding: '4px 12px',
        backgroundColor: '#e9ecef',
        borderRadius: '16px',
        fontSize: '14px',
        marginBottom: '12px'
      }}>
        {preview.path}
      </div>
      <p style={{ 
        margin: '0',
        lineHeight: '1.6',
        color: '#495057'
      }}>
        {preview.description}
      </p>
    </div>
  );
};

export default BlessingPreviewCard; 