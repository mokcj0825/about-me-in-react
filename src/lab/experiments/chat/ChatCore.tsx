import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Constants for configuration
const CHAT_CONFIG = {
	DIALOG_END_DELAY: 1000,
	TRANSITION_DURATION: 500,
	NAVIGATION: {
		BASE_PATH: '/labs/chat/',
	},
} as const;

// Styled components
const ChatContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
`;

const BackgroundLayer = styled.div<{ $isVisible: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	opacity: ${props => props.$isVisible ? 1 : 0};
	transition: opacity ${CHAT_CONFIG.TRANSITION_DURATION}ms ease-in-out;
	z-index: 1;
`;

const ContentLayer = styled.div`
	position: relative;
	z-index: 2;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

interface Props {
	dialogScriptId: string;
	onChatEnd?: () => void;
}

export const ChatCore: React.FC<Props> = ({
	dialogScriptId,
	onChatEnd
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [currentScriptId, setCurrentScriptId] = useState(dialogScriptId);
	const navigate = useNavigate();
	
	// Update currentScriptId when dialogScriptId prop changes
	useEffect(() => {
		console.log(`ChatCore: Script ID changed from ${currentScriptId} to ${dialogScriptId}`);
		
		// Clear all dialog state when script ID changes
		setCurrentScriptId(dialogScriptId);
		setIsVisible(false);
		
		// Initialize new dialog after a short delay to ensure clean state
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 100);
		
		return () => {
			clearTimeout(timer);
		};
	}, [dialogScriptId]);
	
	useEffect(() => {
		const initializeDialog = async () => {
			try {
				// The DialogScriptLoader component will handle setting up the script
				setIsVisible(true);
				
				// Execute the example script
				const response = await fetch('./dialog-script/example-script.json');
				const scriptJson = await response.text();
				
			} catch (error) {
				console.error('Failed to initialize dialog:', error);
				onChatEnd?.();
			}
		};
		
		initializeDialog();
	}, [currentScriptId, onChatEnd]);
	
	return (
		<ChatContainer>
			<BackgroundLayer $isVisible={isVisible} />
			<ContentLayer>
			</ContentLayer>
		</ChatContainer>
	);
};