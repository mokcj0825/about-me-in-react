import React from 'react';
import { GameRenderer } from './renderer/GameRenderer';

interface CoreProps {
	stageId: string;
}

const Core: React.FC<CoreProps> = ({ stageId }) => {
	return (
		<div style={{ width: '100%', height: '100%', position: 'relative' }}>
			<GameRenderer stageId={stageId} />
		</div>
	);
};

export default Core;