import { movementCostRegistry } from './registry/MovementCostRegistry';
import { PlainMovementCost } from './costs/PlainMovementCost';
import { MountainMovementCost } from './costs/MountainMovementCost';
import { ForestMovementCost } from './costs/ForestMovementCost';
import { SeaMovementCost } from './costs/SeaMovementCost';
import { RiverMovementCost } from './costs/RiverMovementCost';
import { CliffMovementCost } from './costs/CliffMovementCost';
import { RoadMovementCost } from './costs/RoadMovementCost';
import { WastelandMovementCost } from './costs/WastelandMovementCost';
import { RuinsMovementCost } from './costs/RuinsMovementCost';
import { SwampMovementCost } from './costs/SwampMovementCost';

export function initMovementCosts() {
  movementCostRegistry.register(new PlainMovementCost());
  movementCostRegistry.register(new MountainMovementCost());
  movementCostRegistry.register(new ForestMovementCost());
  movementCostRegistry.register(new SeaMovementCost());
  movementCostRegistry.register(new RiverMovementCost());
  movementCostRegistry.register(new CliffMovementCost());
  movementCostRegistry.register(new RoadMovementCost());
  movementCostRegistry.register(new WastelandMovementCost());
  movementCostRegistry.register(new RuinsMovementCost());
  movementCostRegistry.register(new SwampMovementCost());
} 