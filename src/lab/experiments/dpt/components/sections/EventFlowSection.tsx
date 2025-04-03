import React from 'react';
import Section from '../Section';
import { BlessingInstruction } from '../../types';

interface EventFlowSectionProps {
  instruction: BlessingInstruction;
}

const EventFlowSection: React.FC<EventFlowSectionProps> = ({ instruction }) => (
  <Section title="Event Flow">
    {instruction.implementation.event_flow.map((flow, index) => (
      <div key={index} style={{ marginBottom: "1rem" }}>
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>Trigger: {flow.trigger}</h3>
        {flow.check && (
          <>
            <h4 style={{ margin: "0.5rem 0", fontSize: "0.875rem" }}>Checks:</h4>
            <ul style={{ margin: "0 0 0.5rem 0", paddingLeft: "1.5rem" }}>
              {flow.check.map((check, idx) => (
                <li key={idx}>{check}</li>
              ))}
            </ul>
          </>
        )}
        <h4 style={{ margin: "0.5rem 0", fontSize: "0.875rem" }}>Actions:</h4>
        <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
          {flow.action.map((action, idx) => (
            <li key={idx}>{action}</li>
          ))}
        </ul>
      </div>
    ))}
  </Section>
);

export default EventFlowSection; 