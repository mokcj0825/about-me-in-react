import React from 'react';
import Section from '../Section';
import { BlessingInstruction } from '../../types';

interface InterfaceSectionProps {
  instruction: BlessingInstruction;
}

const InterfaceSection: React.FC<InterfaceSectionProps> = ({ instruction }) => (
  <Section title="Required Interface">
    {Object.entries(instruction.implementation.data_structure.required_interface).map(([name, { method }]) => (
      <div key={name} style={{ marginBottom: "1rem" }}>
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>{name}</h3>
        <ul style={{ 
          margin: 0,
          paddingLeft: "1.5rem",
          fontSize: "0.875rem"
        }}>
          {method.map((methodItem, index) => (
            <li key={index}>{methodItem}</li>
          ))}
        </ul>
      </div>
    ))}
  </Section>
);

export default InterfaceSection; 