/// <reference types="vite/client" />
import React, { useEffect, useState } from 'react';
import { BlessingInstruction } from './types';
import TabButton from './components/TabButton';
import {
  OverviewSection,
  DataStructuresSection,
  InterfacesSection,
  EventFlowSection,
  PseudocodeSection,
  ValidationSection
} from './components/sections';

interface RendererProps {
  blessingId: string;
}

// Pre-load all instruction files
const instructionModules = import.meta.glob<{ default: BlessingInstruction }>('./instructions/*.json');

const sections = [
  { id: "overview", title: "Overview" },
  { id: "dataStructures", title: "Data Structures" },
  { id: "interfaces", title: "Required Interfaces" },
  { id: "eventFlow", title: "Event Flow" },
  { id: "pseudocode", title: "Pseudocode" },
  { id: "validation", title: "Validation" }
] as const;

const Renderer: React.FC<RendererProps> = ({ blessingId }) => {
  const [instruction, setInstruction] = useState<BlessingInstruction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<typeof sections[number]['id']>("overview");

  useEffect(() => {
    const loadInstruction = async () => {
      try {
        const modulePath = `./instructions/${blessingId}.json`;
        const loader = instructionModules[modulePath];
        
        if (!loader) {
          throw new Error(`Instruction file not found: ${modulePath}`);
        }

        const module = await loader();
        const data = module.default;

        // Validate category
        if (!['offense', 'defense', 'hinder', 'boost', 'recovery'].includes(data.category)) {
          throw new Error(`Invalid category: ${data.category}`);
        }

        setInstruction({
          ...data,
          category: data.category as 'offense' | 'defense' | 'hinder' | 'boost' | 'recovery'
        });
        setError(null);
      } catch (error) {
        console.error('Failed to load blessing instruction:', error);
        setError(`Failed to load instruction for blessing ${blessingId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    loadInstruction();
  }, [blessingId]);

  if (!instruction) {
    return (
      <div style={{ padding: '1rem' }}>
        {error ? (
          <div style={{ color: 'red' }}>
            {error}
          </div>
        ) : (
          'Loading...'
        )}
      </div>
    );
  }

  return (
    <div style={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      gap: "1rem",
      padding: "1rem",
      overflow: "hidden"
    }}>
      {/* Header Section */}
      <div style={{
        borderBottom: "1px solid #e0e0e0",
        paddingBottom: "1rem",
        flexShrink: 0
      }}>
        <h1 style={{ margin: "0 0 0.5rem 0" }}>{instruction.name}</h1>
        <p style={{ margin: "0 0 1rem 0", color: "#666" }}>{instruction.description}</p>
        
        {/* Section Navigation */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.5rem"
        }}>
          {sections.map(section => (
            <TabButton
              key={section.id}
              id={section.id}
              title={section.title}
              isActive={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {activeSection === "overview" && <OverviewSection instruction={instruction} />}
        {activeSection === "dataStructures" && <DataStructuresSection instruction={instruction} />}
        {activeSection === "interfaces" && <InterfacesSection instruction={instruction} />}
        {activeSection === "eventFlow" && <EventFlowSection instruction={instruction} />}
        {activeSection === "pseudocode" && <PseudocodeSection instruction={instruction} />}
        {activeSection === "validation" && <ValidationSection instruction={instruction} />}
      </div>
    </div>
  );
};

export default Renderer;
