import { styled } from "styled-components";

// Control panel for menu buttons
export const ControlPanel = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10;
`;

export const ControlButton = styled.button`
    background: #a67c52;
    color: white;
    border: 2px solid #8c5e2a;
    border-radius: 5px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    
    &:hover {
        background: #c89c72;
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(1px);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
    }
`;

export const ButtonIcon = styled.div`
    font-size: 20px;
    margin-bottom: 3px;
`;

export const ButtonLabel = styled.div`
    font-size: 10px;
    text-transform: uppercase;
`;

// Dialog history panel
export const HistoryPanel = styled.div<{ $visible: boolean }>`
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 70%;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid #a67c52;
    border-radius: 10px;
    padding: 20px;
    color: white;
    z-index: 20;
    display: ${props => props.$visible ? 'block' : 'none'};
    overflow-y: auto;
`;

export const HistoryEntry = styled.div`
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #a67c52;
`;

export const HistoryName = styled.div`
    font-weight: bold;
    color: #a67c52;
    margin-bottom: 5px;
`;

export const HistoryText = styled.div`
    font-size: 16px;
    line-height: 1.4;
`;