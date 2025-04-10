import React, { useRef, useEffect, useState } from 'react';
import { TerrainType } from '../types/TerrainType';
import { GridRenderer } from './GridRenderer';
import { createHexCoordinate, HexCoordinate } from '../types/HexCoordinate';
import { ScrollConfig } from '../system-config/ScrollConfig';
import { GridLayout } from '../system-config/GridLayout';
import { MapBorder } from '../component/MapBorder';
import { calculateNewPosition, Position, ScrollDirection } from "./map-utils";
import { BackgroundRenderer } from './BackgroundRenderer';

/**
 * Represents the map data structure loaded from JSON files.
 * @interface MapData
 * @property {number} width - The width of the map in grid cells
 * @property {number} height - The height of the map in grid cells
 * @property {TerrainType[][]} terrain - 2D array representing the terrain types
 * @property {string} [background] - Optional path to the background image
 */
interface MapData {
  width: number;
  height: number;
  terrain: TerrainType[][];
  background?: string;
}

/**
 * Props for the MapRenderer component.
 * @interface Props
 * @property {string} mapFile - The filename of the map data to load (without extension)
 */
interface Props {
  mapFile: string;
}

/**
 * MapRenderer is a React component that handles the display and interaction of hexagonal grid maps.
 * It manages:
 * - Map data loading and state
 * - User interactions (scrolling, panning)
 * - Grid rendering and layout
 * - Viewport management
 * 
 * The component uses a hexagonal grid system and supports smooth scrolling in all directions.
 * It maintains the map's position state and handles boundary constraints during scrolling.
 * 
 * @component
 * @param {Props} props - Component props
 * @returns {JSX.Element} The rendered map component
 * 
 * @example
 * <MapRenderer mapFile="map-0001" />
 */
export const MapRenderer: React.FC<Props> = ({ mapFile }) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const scrollInterval = useRef<number | null>(null);

  /**
   * Loads map data from a JSON file.
   * The file should be located in the map-data directory.
   * @async
   */
  const loadMapData = async () => {
    try {
      const map = await import(`../map-data/${mapFile}.json`);
      console.log(`Loaded map data for ${mapFile}:`, map);
      setMapData(map);
      
      // Load background if specified
      if (map.background) {
        console.log(`Map ${mapFile} has background: ${map.background}`);
        await BackgroundRenderer.loadBackground(mapFile, map.background);
        setBackgroundLoaded(true);
        console.log(`Background loaded for map ${mapFile}`);
      } else {
        console.log(`Map ${mapFile} has no background specified`);
      }
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

  /**
   * Handles continuous scrolling in the specified direction.
   * Uses an interval to create smooth scrolling animation.
   * @param {ScrollDirection} direction - The direction to scroll
   */
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

  /**
   * Stops any ongoing scroll animation.
   */
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
      {backgroundLoaded && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${mapDimension.x}px`,
            height: `${mapDimension.y}px`,
            zIndex: 0,
            ...BackgroundRenderer.getBackgroundStyle(mapFile, position)
          }}
        />
      )}
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

/**
 * Generates a 2D grid of hexagonal coordinates.
 * @param {number} width - The width of the grid
 * @param {number} height - The height of the grid
 * @returns {HexCoordinate[][]} A 2D array of hexagonal coordinates
 */
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

/**
 * Renders a single hexagon cell with the specified terrain type.
 * @param {HexCoordinate} coordinate - The position of the hexagon
 * @param {TerrainType} terrain - The terrain type to render
 * @returns {JSX.Element} The rendered hexagon component
 */
const renderHex = (coordinate: HexCoordinate, terrain: TerrainType) => {
  return (
    <GridRenderer
      key={`${coordinate.x},${coordinate.y}`}
      coordinate={coordinate}
      terrain={terrain}
    />
  );
};

/**
 * Base styles for the map container.
 */
const wrapperStyle = {
  width: '100%',
  height: '100%',
  position: 'relative',
  userSelect: 'none',
  overflow: 'hidden'
} as const;

/**
 * Styles for the map sheet container.
 * @param {Position} mapDimension - The dimensions of the map
 * @param {Position} position - The current position of the map
 * @returns {React.CSSProperties} The computed styles
 */
const mapSheetStyle = (mapDimension: Position, position: Position): React.CSSProperties => ({
  padding: `${ScrollConfig.PADDING}px`,
  width: `${mapDimension.x}px`,
  height: `${mapDimension.y}px`,
  margin: 0,
  boxSizing: 'border-box',
  position: 'absolute',
  zIndex: 1,
  transform: `translate(${position.x}px, ${position.y}px)`,
  transition: 'transform 0.1s linear',
  // Add a semi-transparent background for maps without a background image
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
});

/**
 * Styles for each row in the hexagonal grid.
 * @param {number} height - The total height of the grid
 * @param {number} index - The index of the current row
 * @returns {React.CSSProperties} The computed styles
 */
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