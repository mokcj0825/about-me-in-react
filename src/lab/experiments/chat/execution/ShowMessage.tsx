import React from 'react';
import styled from 'styled-components';
import { EventCommand } from '../EventCommand';
import { DialogEvent } from '../utils/DialogEvent';

// Specific interface for SHOW_MESSAGE events
export interface ShowMessageEvent extends DialogEvent {
	eventCommand: EventCommand.SHOW_MESSAGE;
	message: string;
	characterName?: string;
}

// Define SpritePosition enum here to avoid circular dependencies
export enum SpritePosition {
	LEFT = 'LEFT',
	MIDDLE = 'MIDDLE',
	RIGHT = 'RIGHT'
}

// Type guard to check if an event is a show message event
export const isShowMessageEvent = (event: DialogEvent): event is ShowMessageEvent => {
	return event.eventCommand === EventCommand.SHOW_MESSAGE && 'message' in event;
};

interface ShowMessageProps {
	event: DialogEvent;
}

const ShowMessage: React.FC<ShowMessageProps> = ({ event }) => {
	// Use type guard to ensure this is a show message event
	if (!isShowMessageEvent(event)) {
		return null;
	}

	// Now TypeScript knows these properties exist
	const { characterName = SpritePosition.MIDDLE, message } = event;

	// Function to get sprite image path based on unitRes
	const getSpriteImagePath = (unitRes: string | null): string | null => {
		if (!unitRes) return null;
		
		// Use the unitRes as the filename with .png extension
		return `/character-sprite/${unitRes.toLowerCase()}.png`;
	};

	return (
		<>
			{/* Character sprite based on position */}
			{/*unitRes && getSpriteImagePath(unitRes) && (
				<CharacterSprite 
					$position={position}
					$active={true}
				>
					<SpriteImage 
						src={getSpriteImagePath(unitRes) || ''} 
						alt={unitRes}
					/>
				</CharacterSprite>
			)*/}

			<VisualNovelTextBox className="ui-element">
				{characterName && <NameBox>{characterName}</NameBox>}
				<MessageText>{MessageUtils.processMessage(message)}</MessageText>
				<ContinueIndicator />
			</VisualNovelTextBox>
		</>
	);
};

class MessageUtils {
	/**
	 * Process a message with template variables
	 * @param message The message with template variables
	 * @returns The processed message with variables replaced
	 */
	public static processMessage(message: string): string {
		// Match patterns like {variableName}
		return message.replace(/\{([^}]+)\}/g, (match, variableName) => {
			// Get the value from localStorage
			const value = localStorage.getItem(variableName);
			// Return the value or the original placeholder if not found
			return value || match;
		});
	}
}

// Styled components
const CharacterSprite = styled.div<{ $position: SpritePosition; $active: boolean }>`
	position: absolute;
	bottom: 240px; // Position above the text box
	opacity: ${props => props.$active ? 1 : 0.7};
	filter: ${props => props.$active ? 'none' : 'grayscale(30%) brightness(80%)'};
	transform-origin: bottom center;
	z-index: ${props => props.$active ? 5 : 3};
	/* Removed transition effects for immediate character changes */
	
	${props => {
		switch (props.$position) {
			case SpritePosition.LEFT:
				return 'left: 15%; transform: translateX(-50%);';
			case SpritePosition.MIDDLE:
				return 'left: 50%; transform: translateX(-50%);';
			case SpritePosition.RIGHT:
				return 'left: 85%; transform: translateX(-50%);';
			default:
				return 'left: 50%; transform: translateX(-50%);';
		}
	}}
`;

const SpriteImage = styled.img`
	max-height: 500px;
	max-width: 300px;
	filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
	/* No transitions for immediate image changes */
`;

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