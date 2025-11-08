# DisplayPanel Components

A collection of components that handle information display and UI overlays in the game. These components are separate from the grid system and provide informational UI elements that float above the main game board.

## Components

### UnitInfoDisplay

A floating panel component that shows detailed unit information when hovering over units on the game board.

#### Features
- Fixed position display
- Automatic positioning based on mouse location
- Comprehensive unit information display:
  - Unit name
  - Class
  - Description
  - Fraction
  - Movement details
  - Position coordinates

#### Visual Characteristics
- White background with black border
- Consistent text styling
- Scrollable content
- High z-index (9999) to ensure visibility
- Responsive positioning to prevent edge overflow

#### Usage Example

```tsx
<UnitInfoDisplay
  unit={unitData}
  mousePosition={{ x: 100, y: 200 }}
```


## Design Philosophy

The DisplayPanel folder contains components that are:
1. **Overlay-based**: Components that float above the main game interface
2. **Informational**: Focused on displaying game data to the player
3. **Context-sensitive**: Appear based on player interactions
4. **Independent**: Not tied to the grid system's visual hierarchy

## Future Considerations

Potential additions to this folder might include:
- Combat information displays
- Unit comparison panels
- Terrain information tooltips
- Status effect indicators
- Action menu overlays

## Technical Notes
- Components use fixed positioning for overlay behavior
- Responsive to window boundaries
- Handle null/undefined data gracefully
- Maintain consistent styling with the game's theme