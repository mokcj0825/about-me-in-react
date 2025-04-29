import React from 'react';
import { DialogEvent } from '../utils/DialogEvent';
import { EventCommand } from '../EventCommand';

/**
 * Constants for dialog execution
 */
export const DIALOG_CONSTANTS = {
  VARIABLE_PATTERN: /\{([^}]+)\}/g,
  STORAGE_SUFFIX: {
    NEXT_SCRIPT_ID: '_nextScriptId'
  }
};

/**
 * Type guard to check if an event is a ShowMessageEvent
 */
export const isShowMessageEvent = (event: any): boolean => {
  return event?.eventCommand === EventCommand.SHOW_MESSAGE;
};

/**
 * Type guard to check if an event is a ClearMessageEvent
 */
export const isClearMessageEvent = (event: any): boolean => {
  return event?.eventCommand === EventCommand.CLEAR_MESSAGE;
};

/**
 * Type guard to check if an event is a RequestSelectionEvent
 */
export const isRequestSelectionEvent = (event: any): boolean => {
  return event?.eventCommand === EventCommand.REQUEST_SELECTION;
};

/**
 * Utility to render a component with retained message
 * Used for REQUEST_SELECTION to keep previous message visible
 */
export const renderWithRetainedMessage = (
  messageVisible: boolean, 
  previousMessageComponent: React.ReactNode | null, 
  currentComponent: React.ReactNode
): React.ReactNode[] => {
  const elements: React.ReactNode[] = [];
  
  if (messageVisible && previousMessageComponent) {
    elements.push(previousMessageComponent);
  }
  
  elements.push(currentComponent);
  
  return elements;
};

/**
 * Process dynamic variable substitution in a string
 * Replaces {variable} with values from localStorage
 */
export const processVariableSubstitution = (text: string): string => {
  if (!text) return '';
  
  return text.replace(DIALOG_CONSTANTS.VARIABLE_PATTERN, (match, variableName) => {
    const value = localStorage.getItem(variableName);
    return value || match;
  });
};

/**
 * Process next script ID based on selection
 * Handles both direct nextScriptId and dynamic {variable} substitution
 */
export const resolveNextScriptId = (storageKey: string, defaultScriptId?: string): string | null => {
  // First try to get the nextScriptId directly if it was stored
  const directNextScriptId = localStorage.getItem(`${storageKey}${DIALOG_CONSTANTS.STORAGE_SUFFIX.NEXT_SCRIPT_ID}`);
  if (directNextScriptId) {
    console.log(`DialogExecutorUtils: Found direct nextScriptId: ${directNextScriptId}`);
    // Clear this temporary value after use
    localStorage.removeItem(`${storageKey}${DIALOG_CONSTANTS.STORAGE_SUFFIX.NEXT_SCRIPT_ID}`);
    return directNextScriptId;
  }
  
  // If no direct nextScriptId, use the default and apply variable substitution
  if (defaultScriptId) {
    const resolvedScriptId = processVariableSubstitution(defaultScriptId);
    console.log(`DialogExecutorUtils: Resolved scriptId: ${resolvedScriptId}`);
    return resolvedScriptId;
  }
  
  // If neither is available
  return null;
}; 