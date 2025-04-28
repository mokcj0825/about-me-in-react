import React, { useState } from 'react';
import { DialogAdapter } from './DialogAdapter';

export const ChatExample: React.FC = () => {
    const [currentScriptId, setCurrentScriptId] = useState('0000');
    
    const handleDialogEnd = () => {
        console.log('Dialog ended');
        // You can add additional logic here, such as showing a menu or transitioning to another scene
    };
    
    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <DialogAdapter 
                scriptId={currentScriptId} 
                onDialogEnd={handleDialogEnd} 
            />
        </div>
    );
}; 