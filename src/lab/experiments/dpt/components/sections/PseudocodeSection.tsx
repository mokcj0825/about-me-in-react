import React from 'react';
import Section from '../Section';
import { BlessingInstruction } from '../../types';

interface PseudocodeSectionProps {
  instruction: BlessingInstruction;
}

const PseudocodeSection: React.FC<PseudocodeSectionProps> = ({ instruction }) => (
  <Section title="Pseudocode">
    {Object.entries(instruction.implementation.pseudocode).map(([name, lines]) => (
      <div key={name}>
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>{name}</h3>
        <pre style={{ 
          margin: 0,
          background: "#fff",
          padding: "0.5rem",
          borderRadius: "4px",
          fontSize: "0.875rem",
          whiteSpace: "pre-wrap"
        }}>
          {lines.join('\n')}
        </pre>
      </div>
    ))}
  </Section>
);

export default PseudocodeSection; 