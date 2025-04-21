import React from 'react';
import { DialogExecutor } from './DialogExecutor';

interface Props {
    scriptId: string;
    onDialogEnd?: () => void;
}

export const DialogAdapter: React.FC<Props> = ({ scriptId, onDialogEnd }) => {
    return (
        <DialogExecutor 
            scriptId={scriptId} 
            onDialogEnd={onDialogEnd} 
        />
    );
}; 