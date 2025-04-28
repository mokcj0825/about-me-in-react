import React from 'react';
import { DialogEvent } from '../utils/DialogEvent';
import { isShowMessageEvent } from '../execution/ShowMessage';
import ShowMessage from '../execution/ShowMessage';
import dialogHistoryService from './DialogHistoryService';

/**
 * Renders a component with the last message retained if needed
 * This function is stateless and directly accesses current values from services
 * 
 * @param currentComponent - The component to render
 * @param messageVisible - Whether the message should be visible
 * @returns React node with the last message and current component if applicable
 */
export const renderWithRetainedMessage = (
  currentComponent: React.ReactNode,
  messageVisible: boolean
): React.ReactNode => {
  // Get the current history directly from the service
  const currentHistory = dialogHistoryService.getMessageHistory();
  
  // If message is visible and we have history, show the last message
  if (messageVisible && currentHistory.length > 0) {
    const lastMessageEvent = currentHistory[currentHistory.length - 1];
    if (isShowMessageEvent(lastMessageEvent)) {
      return (
        <>
          <ShowMessage event={lastMessageEvent} />
          {currentComponent}
        </>
      );
    }
  }
  return currentComponent;
};

/**
 * Checks if an event is a duplicate of an existing event in the history
 * 
 * @param event - The event to check
 * @param history - The current history of events
 * @returns boolean indicating if the event is a duplicate
 */
export const isDuplicateEvent = (
  event: DialogEvent,
  history: DialogEvent[]
): boolean => {
  return history.some(existingEvent => 
    existingEvent === event || 
    (isShowMessageEvent(existingEvent) && 
     isShowMessageEvent(event) && 
     existingEvent.message === event.message && 
     existingEvent.unitRes === event.unitRes)
  );
};

/**
 * Processes variable substitution in a script string
 * 
 * @param script - The script string that may contain variables in the format {variableName}
 * @returns The processed script with variables replaced by their values from localStorage
 */
export const processVariableSubstitution = (script: string): string => {
  // Check if script contains variables in the format {variableName}
  const variableRegex = /\{([^}]+)\}/g;
  const matches = script.match(variableRegex);
  
  if (matches) {
    // Replace each variable with its value from localStorage
    matches.forEach(match => {
      const variableName = match.replace(/[{}]/g, '');
      const variableValue = localStorage.getItem(variableName) || '';
      script = script.replace(match, variableValue);
    });
  }
  
  return script;
}; 