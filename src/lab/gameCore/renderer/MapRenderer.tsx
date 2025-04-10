import React, { useRef, useEffect, useState } from 'react';
import { TerrainType } from '../types/TerrainType';
import { GridRenderer } from './GridRenderer';
import { createHexCoordinate, HexCoordinate } from '../types/HexCoordinate';
import { ScrollConfig } from '../system-config/ScrollConfig';
import { GridLayout } from '../system-config/GridLayout';
import { MapBorder } from '../component/MapBorder';
import {calculateNewPosition, Position, ScrollDirection} from "./map-utils";

interface MapData {
  width: number;
  height: number;
  terrain: TerrainType[][];
}

interface Props {
  mapFile: string;
}

export const MapRenderer: React.FC<Props> = ({ mapFile }) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement | null>(null);
  const scrollInterval = useRef<number | null>(null);

  const loadMapData = async () => {
    try {
      const map = await import(`../map-data/${mapFile}.json`);
      setMapData(map);
    } catch (error) {
      console.error('Failed to load map data:', error);
    }
  };

  useEffect(() => {
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
  const mapDimension = {x: mapWidth, y: mapHeight}

  const handleScroll = (direction: ScrollDirection) => {
    if (scrollInterval.current !== null) {
      window.clearInterval(scrollInterval.current);
    }

    scrollInterval.current = window.setInterval(() => {
      setPosition(prev => {

        const viewportDimension = {
          x: mapRef.current?.clientWidth || 0,
          y: mapRef.current?.clientHeight || 0
        }
        return calculateNewPosition(prev, direction, mapDimension, viewportDimension);
      });
    }, 16); // ~60fps
  };

  const handleStopScroll = () => {
    if (scrollInterval.current !== null) {
      window.clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const grid = generateGrid(width, height);

  return (
    <div ref={mapRef} style={wrapperStyle}>
      <MapBorder onScroll={handleScroll} onStopScroll={handleStopScroll} />
      <div style={mapSheetStyle(mapDimension, position)}>
        {grid.map((row, index) => (
          <div key={index} style={gridStyle(height, index)}>
            {
              row.map((coordinate) => renderHex(coordinate, mapData.terrain[coordinate.x][coordinate.y] as TerrainType))
            }
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

const renderHex = (coordinate: HexCoordinate, terrain: TerrainType) => {
  return (
    <GridRenderer
      key={`${coordinate.x},${coordinate.y}`}
      coordinate={coordinate}
      terrain={terrain}
    />
  );
};

const wrapperStyle = {
  width: '100%',
  height: '100%',
  position: 'relative',
  userSelect: 'none',
  overflow: 'hidden'
} as const;

const mapSheetStyle = (mapDimension: Position, position: Position) => {
  return {
    padding: `${ScrollConfig.PADDING}px`,
    width: `${mapDimension.x}px`,
    height: `${mapDimension.y}px`,
    margin: 0,
    boxSizing: 'border-box',
    position: 'absolute',
    zIndex: 1,
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: 'transform 0.1s linear'
  } as const;
}

const gridStyle = (height: number, index: number) => {
  return {
    display: 'flex',
    margin: 0,
    padding: 0,
    lineHeight: 0,
    fontSize: 0,
    whiteSpace: 'nowrap',
    marginLeft: (height - 1 - index) % 2 === 0 ? `${GridLayout.ROW_OFFSET}px` : '0',
    marginTop: index === 0 ? '0' : '-25px',
  }
}