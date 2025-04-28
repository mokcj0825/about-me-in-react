import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogExecutor } from './DialogExecutor';

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
	
	const handleDialogEnd = () => {
		onChatEnd?.();
	};
	
	return (
		<div style={{ width: '100%', height: '100%', position: 'relative' }}>
			{isVisible && (
				<DialogExecutor 
					scriptId={currentScriptId} 
					onDialogEnd={handleDialogEnd} 
				/>
			)}
		</div>
	);
};