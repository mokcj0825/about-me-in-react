import { useState } from 'react';
import { UIModalState } from '../types/UIState';
import { TerrainType } from '../movement/types';
import { HexCoordinate } from '../types/HexCoordinate';

interface UseUIStateProps {
  onModalClose?: () => void;
  onMenuClose?: () => void;
}

interface UseUIStateReturn {
  // State
  hoveredTerrain: TerrainType | null;
  hoveredCoord: HexCoordinate | null;
  uiModal: UIModalState;
  isGameMenuOpen: boolean;
  announcement: string | null;
  showActionMenu: { x: number; y: number } | null;
  
  // Actions
  handleTerrainHover: (terrain: TerrainType | null, coord: HexCoordinate | null) => void;
  handleModalToggle: (type: UIModalState['type'], data?: any) => void;
  handleMenuToggle: () => void;
  handleActionMenuShow: (position: { x: number; y: number }) => void;
  handleActionMenuHide: () => void;
  
  // Setters
  setAnnouncement: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Custom hook for managing UI state including modals, menus,
 * announcements, and hover states
 */
export const useUIState = ({
  onModalClose,
  onMenuClose
}: UseUIStateProps = {}): UseUIStateReturn => {
  const [hoveredTerrain, setHoveredTerrain] = useState<TerrainType | null>(null);
  const [hoveredCoord, setHoveredCoord] = useState<HexCoordinate | null>(null);
  const [uiModal, setUiModal] = useState<UIModalState>({ type: null });
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<{ x: number; y: number } | null>(null);

  const handleTerrainHover = (terrain: TerrainType | null, coord: HexCoordinate | null) => {
    setHoveredTerrain(terrain);
    setHoveredCoord(coord);
  };

  const handleModalToggle = (type: UIModalState['type'], data?: any) => {
    if (uiModal.type === type) {
      setUiModal({ type: null });
      onModalClose?.();
    } else {
      setUiModal({ type, data });
    }
  };

  const handleMenuToggle = () => {
    setIsGameMenuOpen(current => {
      const newState = !current;
      if (!newState) {
        onMenuClose?.();
      }
      return newState;
    });
  };

  const handleActionMenuShow = (position: { x: number; y: number }) => {
    setShowActionMenu(position);
  };

  const handleActionMenuHide = () => {
    setShowActionMenu(null);
  };

  return {
    hoveredTerrain,
    hoveredCoord,
    uiModal,
    isGameMenuOpen,
    announcement,
    showActionMenu,
    handleTerrainHover,
    handleModalToggle,
    handleMenuToggle,
    handleActionMenuShow,
    handleActionMenuHide,
    setAnnouncement,
  };
}; 