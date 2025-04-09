import React, { useRef, useEffect, useState } from 'react';
import { TerrainType } from '../types/TerrainType';
import { GridRenderer } from './GridRenderer';
import { createHexCoordinate, HexCoordinate } from '../types/HexCoordinate';
import { ScrollConfig } from '../system-config/ScrollConfig';
import { GridLayout } from '../system-config/GridLayout';
import { MapBorders } from './MapBorders';

interface MapData {
  width: number;
  height: number;
  terrain: TerrainType[][];
}

interface MapRendererProps {
  mapFile: string;
}

export const MapRenderer: React.FC<MapRendererProps> = ({ mapFile }) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement | null>(null);
  const scrollInterval = useRef<number | null>(null);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const map = await import(`../map-data/${mapFile}.json`);
        setMapData(map);
      } catch (error) {
        console.error('Failed to load map data:', error);
      }
    };

    loadMapData();
    return () => {
      if (scrollInterval.current !== null) {
        window.clearInterval(scrollInterval.current);
      }
    };
  }, [mapFile]);

  if (!mapData) {
    return <div>Loading map...</div>;
  }

  const { width, height } = mapData;
  const mapWidth = width * GridLayout.WIDTH + GridLayout.ROW_OFFSET + (ScrollConfig.PADDING * 2);
  const mapHeight = height * GridLayout.WIDTH * 0.75 + (ScrollConfig.PADDING * 2);

  const handleScroll = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (scrollInterval.current !== null) {
      window.clearInterval(scrollInterval.current);
    }

    scrollInterval.current = window.setInterval(() => {
      setPosition(prev => {
        const newPos = { ...prev };
        const viewportWidth = mapRef.current?.clientWidth || 0;
        const viewportHeight = mapRef.current?.clientHeight || 0;
        
        switch (direction) {
          case 'left':
            newPos.x = Math.min(ScrollConfig.SCROLL_THRESHOLD, prev.x + ScrollConfig.SCROLL_SPEED);
            break;
          case 'right':
            newPos.x = Math.max(-(mapWidth - viewportWidth), prev.x - ScrollConfig.SCROLL_SPEED);
            break;
          case 'up':
            newPos.y = Math.min(ScrollConfig.SCROLL_THRESHOLD, prev.y + ScrollConfig.SCROLL_SPEED);
            break;
          case 'down':
            newPos.y = Math.max(-(mapHeight - viewportHeight), prev.y - ScrollConfig.SCROLL_SPEED);
            break;
        }
        
        return newPos;
      });
    }, 16); // ~60fps
  };

  const handleStopScroll = () => {
    if (scrollInterval.current !== null) {
      window.clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const renderHex = (coordinate: HexCoordinate) => {
    return (
      <GridRenderer
        key={`${coordinate.x},${coordinate.y}`}
        coordinate={coordinate}
        terrain={mapData.terrain[coordinate.y][coordinate.x] as TerrainType}
      />
    );
  };

  const grid = generateGrid(width, height);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      <MapBorders onScroll={handleScroll} onStopScroll={handleStopScroll} />
      <div style={{
        padding: `${ScrollConfig.PADDING}px`,
        width: `${mapWidth}px`,
        height: `${mapHeight}px`,
        margin: 0,
        boxSizing: 'border-box',
        position: 'absolute',
        zIndex: 1,
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.1s linear'
      }}>
        {grid.map((row, index) => (
          <div key={index} style={{
            display: 'flex',
            margin: 0,
            padding: 0,
            lineHeight: 0,
            fontSize: 0,
            whiteSpace: 'nowrap',
            marginLeft: (height - 1 - index) % 2 === 0 ? `${GridLayout.ROW_OFFSET}px` : '0',
            marginTop: index === 0 ? '0' : '-25px',
          }}>
            {row.map((coord) => renderHex(coord))}
          </div>
        ))}
      </div>
    </div>
  );
};

const generateGrid = (width: number, height: number) => {
  const grid: HexCoordinate[][] = [];
  for (let y = height - 1; y >= 0; y--) {
    const row: HexCoordinate[] = [];
    for (let x = 0; x < width; x++) {
      row.push(createHexCoordinate(x, y));
    }
    grid.push(row);
  }
  return grid;
}; 