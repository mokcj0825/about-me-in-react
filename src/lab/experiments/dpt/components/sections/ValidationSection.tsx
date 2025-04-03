import React from 'react';
import Section from '../Section';
import { BlessingInstruction } from '../../types';

interface ValidationSectionProps {
  instruction: BlessingInstruction;
}

const ValidationSection: React.FC<ValidationSectionProps> = ({ instruction }) => (
  <Section title="Validation">
    <div>
      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>Success Conditions</h3>
      <ul style={{ margin: "0 0 1rem 0", paddingLeft: "1.5rem" }}>
        {instruction.validation.success_condition.map((condition, index) => (
          <li key={index}>{condition}</li>
        ))}
      </ul>
      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>Edge Cases</h3>
      <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
        {instruction.validation.edge_case.map((edge, index) => (
          <li key={index}>{edge}</li>
        ))}
      </ul>
    </div>
  </Section>
);

export default ValidationSection; 