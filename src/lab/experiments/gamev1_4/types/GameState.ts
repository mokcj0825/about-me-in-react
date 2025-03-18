export type GameActionState = 
  | 'idle'               // No action in progress
  | 'unitSelected'       // Unit is selected, showing movement range
  | 'unitMoved'         // Unit has moved, showing action menu
  | 'weaponSelection'    // Selecting weapon from panel
  | 'targetSelection'    // Weapon selected, selecting target
  | 'aiTurn';           // AI turn in progress 