import { useRef, useState, useEffect } from 'react';
import { ScrollConfig } from '../constants/ScrollConfig';

interface Position {
  x: number;
  y: number;
}

interface UseMapInteractionProps {
  onMousePositionChange?: (position: Position | null) => void;
}

interface UseMapInteractionReturn {
  // State
  mousePosition: Position | null;
  scrollPosition: Position;
  isDragging: boolean;
  mapRef: React.RefObject<HTMLDivElement | null>;

  // Event handlers
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleMouseLeave: (e: React.MouseEvent) => void;
}

/**
 * Custom hook for managing map interaction including mouse position,
 * scrolling, and drag functionality
 */
export const useMapInteraction = ({ 
  onMousePositionChange 
}: UseMapInteractionProps = {}): UseMapInteractionReturn => {
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState<Position>({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState<Position>({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  // Handle mouse position and edge scrolling
  useEffect(() => {
    if (!mapRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mapRef.current!.getBoundingClientRect();
      const newPosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setMousePosition(newPosition);
      onMousePositionChange?.(newPosition);
    };

    const handleMouseLeave = () => {
      setMousePosition(null);
      onMousePositionChange?.(null);
    };

    mapRef.current.addEventListener('mousemove', handleMouseMove);
    mapRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      mapRef.current?.removeEventListener('mousemove', handleMouseMove);
      mapRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [onMousePositionChange]);

  // Edge scrolling effect
  useEffect(() => {
    if (!mousePosition || !mapRef.current) {
      if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      return;
    }

    const container = mapRef.current;
    const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();

    scrollIntervalRef.current = window.setInterval(() => {
      const scrollLeft = mousePosition.x < ScrollConfig.SCROLL_THRESHOLD ? -ScrollConfig.SCROLL_SPEED :
                        mousePosition.x > containerWidth - ScrollConfig.SCROLL_THRESHOLD ? ScrollConfig.SCROLL_SPEED : 0;
      
      const scrollTop = mousePosition.y < ScrollConfig.SCROLL_THRESHOLD ? -ScrollConfig.SCROLL_SPEED :
                       mousePosition.y > containerHeight - ScrollConfig.SCROLL_THRESHOLD ? ScrollConfig.SCROLL_SPEED : 0;

      if (scrollLeft) container.scrollLeft += scrollLeft;
      if (scrollTop) container.scrollTop += scrollTop;

      setScrollPosition({
        x: -container.scrollLeft,
        y: -container.scrollTop
      });
    }, 16);

    return () => {
      if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [mousePosition]);

  // Handle wheel scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!mapRef.current) return;
      
      e.preventDefault();
      mapRef.current.scrollLeft += e.deltaX;
      mapRef.current.scrollTop += e.deltaY;
      
      setScrollPosition({
        x: -mapRef.current.scrollLeft,
        y: -mapRef.current.scrollTop
      });
    };

    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (mapElement) {
        mapElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Initialize scroll position
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.scrollLeft = ScrollConfig.PADDING;
      mapRef.current.scrollTop = ScrollConfig.PADDING;
      setScrollPosition({
        x: -ScrollConfig.PADDING,
        y: -ScrollConfig.PADDING
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) { // Only middle click for dragging
      e.preventDefault();
      setIsDragging(true);
      setStartDrag({ x: e.clientX - scrollPosition.x, y: e.clientY - scrollPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && mapRef.current) {
      const newX = e.clientX - startDrag.x;
      const newY = e.clientY - startDrag.y;
      mapRef.current.scrollLeft = -newX;
      mapRef.current.scrollTop = -newY;
      setScrollPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 1) { // Only respond to middle button release
      setIsDragging(false);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    handleMouseUp(e);
  };

  return {
    mousePosition,
    scrollPosition,
    isDragging,
    mapRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
}; 