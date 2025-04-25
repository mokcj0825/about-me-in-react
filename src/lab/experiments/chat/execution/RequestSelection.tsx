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

    return (
        <SelectionContainer>
            <OptionList>
                {event.option.map((option, index) => (
                    <OptionButton
                        key={index}
                        onClick={() => onSelect(option.value)}
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