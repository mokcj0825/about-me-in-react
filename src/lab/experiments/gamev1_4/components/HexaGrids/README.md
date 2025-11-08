# HexaGrids Components

A collection of React components for rendering and managing hexagonal grid cells in a game board. These components work together to create an interactive, visually rich hexagonal grid system.

## Component Architecture

### Core Components

#### `HexCell`
The main orchestrator component that combines all other hex components. It manages:
- User interactions (hover, click)
- Unit information display
- Visual state management
- Component layering

#### `HexCellContainer`
The base container component that:
- Defines the hexagonal shape using CSS clip-path
- Handles terrain background display
- Manages basic mouse interactions
- Provides the foundation for all other layers

### Visual Layer Components

The components are rendered in layers (from bottom to top):

1. **HexCellOverlay** (z-index: 1)
   - Provides the base visual structure
   - Renders hexagonal borders
   - Adds semi-transparent white fill for depth

2. **HexCellHighlight** (z-index: 2)
   - Shows movement possibilities
   - Indicates zones of control
   - Provides visual feedback for different states

3. **HexCellContent** (z-index: 3)
   - Displays unit information
   - Handles unit sprites/representations
   - Shows direction indicators

4. **HexCellHoverIndicator** (z-index: 5)
   - Manages hover effects
   - Shows selection state
   - Provides visual feedback for user interaction

### Supporting Components

#### `DirectionIndicator`
- Renders SVG-based direction indicators for units
- Supports six directions: top-right, right, bottom-right, bottom-left, left, top-left
- Uses vector graphics for crisp rendering at any scale

## Usage

Basic example of creating a hex cell:
```tsx
<HexCell
coordinate={{ x: 0, y: 0 }}
terrain="plains"
unit={unitData}
isMoveable={true}
onHover={(coord, isHovering, isUnit) => handleHover(coord, isHovering, isUnit)}
onClick={(coord, isRightClick) => handleClick(coord, isRightClick)}
findUnitAtPosition={(coord) => getUnitAt(coord)}
/>
```

## Component Interactions

1. **Mouse Hover Flow**:
   - HexCellContainer receives hover event
   - HexCell manages hover state
   - HexCellHoverIndicator shows visual feedback
   - Unit info display appears if unit is present

2. **Selection Flow**:
   - Click event captured by HexCellContainer
   - HexCell processes selection
   - Visual feedback shown through HexCellHoverIndicator
   - Additional highlights appear based on game state

3. **Unit Display Flow**:
   - HexCellContent manages unit representation
   - DirectionIndicator shows unit orientation
   - Unit sprites (planned feature) will be rendered here

## Styling

The components use a combination of:
- CSS clip-path for hexagonal shapes
- SVG for precise borders and indicators
- Absolute positioning for layering
- CSS transitions for smooth state changes

## Future Improvements

1. **Sprite Implementation**:
   - Replace text-based unit representation with sprites
   - Add unit animations
   - Implement fraction-specific visuals

2. **Performance Optimizations**:
   - Memoization of expensive renders
   - Batch updates for large grid changes
   - Optimize SVG rendering

3. **Visual Enhancements**:
   - Add more terrain types
   - Implement weather effects
   - Enhanced unit status indicators

## Technical Notes

- All components are written in TypeScript
- Props interfaces are documented with TSDoc
- Components follow React functional patterns
- Z-index layering is consistently maintained
- SVG elements use vector-effect for crisp rendering
