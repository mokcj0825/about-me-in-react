import React, { memo } from 'react';
import styled from 'styled-components';

// Import UI components and event handlers
import { ControlPanel, ControlButton, ButtonIcon, ButtonLabel, HistoryPanel, HistoryEntry, HistoryName, HistoryText } from '../executor-utils/executor-styled-div';
import { DialogEvent } from '../utils/DialogEvent';
import RequestSelection from '../execution/RequestSelection';
import { isRequestSelectionEvent, RequestSelectionEvent } from '../execution/RequestSelection';

const ContentLayer = styled.div`
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: all;
`;

interface UILayerProps {
  currentEvent: DialogEvent | null;
  messageHistory: DialogEvent[];
  showHistory: boolean;
  handleContentClick: (e: React.MouseEvent) => void;
  handleSaveClick: (e: React.MouseEvent) => void;
  handleLoadClick: (e: React.MouseEvent) => void;
  handleConfigClick: (e: React.MouseEvent) => void;
  handleHistoryClick: (e: React.MouseEvent) => void;
  handleSelection: (value: string) => void;
  commandExecution: React.ReactNode;
}

/**
 * UILayer component
 * 
 * Responsible for handling all UI elements (dialogs, buttons, selections)
 * Controlled by the ScriptExecutor
 * Completely isolated from background and character layers
 */
const UILayer: React.FC<UILayerProps> = ({
  currentEvent,
  messageHistory,
  showHistory,
  handleContentClick,
  handleSaveClick,
  handleLoadClick,
  handleConfigClick,
  handleHistoryClick,
  handleSelection,
  commandExecution
}) => {
  console.log('UILayer rendered with current event:', currentEvent?.eventCommand);
  
  return (
    <ContentLayer onClick={handleContentClick}>
      {commandExecution}

      <ControlPanel className="ui-element">
        <ControlButton 
          className="ui-element"
          onClick={handleSaveClick}
        >
          <ButtonIcon>💾</ButtonIcon>
          <ButtonLabel>Save</ButtonLabel>
        </ControlButton>
        <ControlButton 
          className="ui-element"
          onClick={handleLoadClick}
        >
          <ButtonIcon>📂</ButtonIcon>
          <ButtonLabel>Load</ButtonLabel>
        </ControlButton>
        <ControlButton 
          className="ui-element"
          onClick={handleConfigClick}
        >
          <ButtonIcon>⚙️</ButtonIcon>
          <ButtonLabel>Config</ButtonLabel>
        </ControlButton>
        <ControlButton 
          className="ui-element"
          onClick={handleHistoryClick}
        >
          <ButtonIcon>📜</ButtonIcon>
          <ButtonLabel>Logs</ButtonLabel>
        </ControlButton>
      </ControlPanel>

      {/* History panel */}
      <HistoryPanel 
        $visible={showHistory} 
        className="ui-element"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: '#a67c52', marginBottom: '20px', textAlign: 'center' }}>
          Message History
        </h2>
        {messageHistory.map((event, index) => (
          <HistoryEntry key={index}>
            {event.unitRes && <HistoryName>{event.unitRes}</HistoryName>}
            <HistoryText>{event.message}</HistoryText>
          </HistoryEntry>
        ))}
      </HistoryPanel>

      {currentEvent && isRequestSelectionEvent(currentEvent) && (
        <RequestSelection
          event={currentEvent as RequestSelectionEvent}
          onSelect={handleSelection}
        />
      )}
    </ContentLayer>
  );
};

export default memo(UILayer); 