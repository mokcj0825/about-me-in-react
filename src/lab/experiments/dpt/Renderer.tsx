/// <reference types="vite/client" />
import React, { useEffect, useState } from 'react';
import OverviewSection from './components/sections/OverviewSection';
import EventFlowSection from './components/sections/EventFlowSection';
import PseudocodeSection from './components/sections/PseudocodeSection';
import ValidationSection from './components/sections/ValidationSection';
import { BlessingInstruction } from './types';
import InterfaceSection from './components/sections/InterfaceSection';
import DataStructureSection from './components/sections/DataStructureSection';

interface RendererProps {
  blessingId: string;
}

// Pre-load all instruction files
const instructionModules = import.meta.glob<{ default: BlessingInstruction }>(
  './blessings/*/instructions/*.json',
  { eager: true }
);

const Renderer: React.FC<RendererProps> = ({ blessingId }) => {
  const [instruction, setInstruction] = useState<BlessingInstruction | null>(null);
  const [activeSection, setActiveSection] = useState<"overview" | "data_structure" | "interface" | "event_flow" | "pseudocode" | "validation">("overview");

  useEffect(() => {
    const loadInstruction = () => {
      try {
        const foundInstruction = Object.values(instructionModules)
          .find(module => module.default.id === blessingId)?.default;

        if (!foundInstruction) {
          throw new Error(`Instruction not found for blessing: ${blessingId}`);
        }

        setInstruction(foundInstruction);
      } catch (error) {
        console.error('Error loading instruction:', error);
      }
    };

    loadInstruction();
  }, [blessingId]);

  if (!instruction) {
    return <div>Loading...</div>;
  }

  const section = [
    {
      id: "overview",
      title: "Overview",
      component: <OverviewSection instruction={instruction} />
    },
    {
      id: "data_structure",
      title: "Data Structure",
      component: <DataStructureSection instruction={instruction} />
    },
    {
      id: "interface",
      title: "Required Interface",
      component: <InterfaceSection instruction={instruction} />
    },
    {
      id: "event_flow",
      title: "Event Flow",
      component: <EventFlowSection instruction={instruction} />
    },
    {
      id: "pseudocode",
      title: "Pseudocode",
      component: <PseudocodeSection instruction={instruction} />
    },
    {
      id: "validation",
      title: "Validation",
      component: <ValidationSection instruction={instruction} />
    }
  ] as const;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      maxWidth: "800px",
      margin: "2rem auto",
      padding: "0 1rem"
    }}>
      <div style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap"
      }}>
        {section.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              background: activeSection === section.id ? "#007bff" : "#e9ecef",
              color: activeSection === section.id ? "#fff" : "#212529",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500
            }}
          >
            {section.title}
          </button>
        ))}
      </div>

      {section.find(s => s.id === activeSection)?.component}
    </div>
  );
};

export default Renderer;
