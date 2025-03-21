import { BuffEffect } from './BuffEffect';
import { UnitData } from '../types/UnitData';
import {BuffProvider} from "./BuffProvider";

export class NightPhobicDebuff implements BuffProvider {
  id = 'nightPhobicDebuff';

  getEffect(): BuffEffect {
    return {
      id: this.id,
      duration: -1,
      onApply: (unit: UnitData) => {
        console.log('NightPhobicDebuff applied to unit:', unit);
      },
      onRemove: (unit: UnitData) => {
        console.log('NightPhobicDebuff removed from unit:', unit);
      },
      modifyMovement: (unit: UnitData, baseValue: number) => Math.max(1, baseValue - 2)
    };
  }
} 