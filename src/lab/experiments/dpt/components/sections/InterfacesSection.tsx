import React from 'react';
import Section from '../Section';
import { BlessingInstruction } from '../../types';

interface InterfacesSectionProps {
  instruction: BlessingInstruction;
}

const InterfacesSection: React.FC<InterfacesSectionProps> = ({ instruction }) => (
  <Section title="Required Interfaces">
    {Object.entries(instruction.implementation.data_structures.required_interfaces).map(([name, { methods }]) => (
      <div key={name} style={{ marginBottom: "1rem" }}>
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>{name}</h3>
        <ul style={{ 
          margin: 0,
          paddingLeft: "1.5rem",
          fontSize: "0.875rem"
        }}>
          {methods.map((method, index) => (
            <li key={index}>{method}</li>
          ))}
        </ul>
      </div>
    ))}
  </Section>
);

export default InterfacesSection; 