import React from 'react';
import styled from 'styled-components';
import { EventCommand } from '../EventCommand';

interface SelectionOption {
    label: string;
    value: string;
}

export interface RequestSelectionEvent {
    eventCommand: EventCommand.REQUEST_SELECTION;
    option: SelectionOption[];
    storageKey: string;
    valueType?: 'STRING' | 'NUMBER' | 'BOOLEAN';
    actionToStorage?: 'SET' | 'APPEND' | 'REMOVE';
}

export const isRequestSelectionEvent = (event: any): event is RequestSelectionEvent => {
    return event?.eventCommand === EventCommand.REQUEST_SELECTION;
};

interface Props {
    event: RequestSelectionEvent;
    onSelect: (value: string) => void;
}

const RequestSelection: React.FC<Props> = ({ event, onSelect }) => {
    if (!isRequestSelectionEvent(event)) {
        return null;
    }

    const handleSelection = (value: string) => {
        // Process the value based on valueType
        let processedValue = value;
        if (event.valueType === 'NUMBER') {
            processedValue = value.toString();
        } else if (event.valueType === 'BOOLEAN') {
            processedValue = value.toString();
        }
        
        // Determine the action to take based on actionToStorage
        const action = event.actionToStorage || 'SET';
        
        // Handle storage based on action
        switch (action) {
            case 'SET':
                localStorage.setItem(event.storageKey, processedValue);
                break;
            case 'APPEND':
                const existingValue = localStorage.getItem(event.storageKey) || '';
                localStorage.setItem(event.storageKey, existingValue + ',' + processedValue);
                break;
            case 'REMOVE':
                const currentValue = localStorage.getItem(event.storageKey) || '';
                const values = currentValue.split(',').filter(v => v !== processedValue);
                localStorage.setItem(event.storageKey, values.join(','));
                break;
            default:
                localStorage.setItem(event.storageKey, processedValue);
        }
        
        // Call the parent's onSelect callback
        onSelect(value);
    };

    return (
        <SelectionContainer>
            <OptionList>
                {event.option.map((option, index) => (
                    <OptionButton
                        key={index}
                        onClick={() => handleSelection(option.value)}
                    >
                        {option.label}
                    </OptionButton>
                ))}
            </OptionList>
        </SelectionContainer>
    );
};

const SelectionContainer = styled.div`
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 600px;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid #a67c52;
    border-radius: 10px;
    padding: 20px;
    z-index: 10;
`;

const OptionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const OptionButton = styled.button`
    background: #a67c52;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 15px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    
    &:hover {
        background: #c89c72;
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(1px);
    }
`;

export default RequestSelection; 