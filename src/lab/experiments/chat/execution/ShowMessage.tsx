import React from 'react';
import styled from 'styled-components';
import { EventCommand } from '../EventCommand';
import { DialogEvent } from '../utils/DialogEvent';

/**
 * Types and interfaces for message display
 */
export interface ShowMessageEvent extends DialogEvent {
	eventCommand: EventCommand.SHOW_MESSAGE;
	message: string;
	characterName?: string;
}

export enum SpritePosition {
	LEFT = 'LEFT',
	MIDDLE = 'MIDDLE',
	RIGHT = 'RIGHT'
}

/**
 * Type guard to check if an event is a show message event
 */
export const isShowMessageEvent = (event: DialogEvent): event is ShowMessageEvent => {
	return event.eventCommand === EventCommand.SHOW_MESSAGE && 'message' in event;
};

interface ShowMessageProps {
	event: DialogEvent;
}

/**
 * ShowMessage component - Renders a visual novel style message box
 */
const ShowMessage: React.FC<ShowMessageProps> = ({ event }) => {
	if (!isShowMessageEvent(event)) {
		return null;
	}

	const { characterName = SpritePosition.MIDDLE, message } = event;

	return (
		<>
			<VisualNovelTextBox>
				{characterName && <NameBox>{characterName}</NameBox>}
				<MessageText>{MessageUtils.processMessage(message)}</MessageText>
				<ContinueIndicator />
			</VisualNovelTextBox>
		</>
	);
};

/**
 * Utility class for message text processing
 */
class MessageUtils {
	public static processMessage(message: string): string {
		return message.replace(/\{([^}]+)\}/g, (match, variableName) => {
			const value = localStorage.getItem(variableName);
			return value || match;
		});
	}
}

/**
 * Styled components for the visual novel dialog interface
 */
const VisualNovelTextBox = styled.div`
	position: absolute;
	bottom: 30px;
	left: 50%;
	transform: translateX(-50%);
	width: 90%;
	min-height: 180px;
	background: rgba(0, 0, 0, 0.7);
	border: 2px solid #a67c52;
	border-radius: 10px;
	padding: 20px;
	color: white;
	z-index: 10;
	box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
`;

const NameBox = styled.div`
	position: absolute;
	top: -22px;
	left: 20px;
	background: #a67c52;
	padding: 5px 15px;
	border-radius: 5px 5px 0 0;
	color: white;
	font-weight: bold;
	font-size: 18px;
	box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.3);
`;

const MessageText = styled.div`
	font-size: 20px;
	line-height: 1.5;
	letter-spacing: 0.5px;
	margin-top: 5px;
`;

const ContinueIndicator = styled.div`
	position: absolute;
	bottom: 15px;
	right: 20px;
	width: 20px;
	height: 20px;
	border-right: 3px solid white;
	border-bottom: 3px solid white;
	transform: rotate(-45deg);
	animation: pulse 1.5s infinite;

	@keyframes pulse {
		0% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0.5;
		}
	}
`;

export default ShowMessage;