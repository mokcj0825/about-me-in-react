export interface UnitAction {
  type: string;
  energy_threshold?: number;
  target?: string;
}

export interface UnitStrategy {
  type: 'aggressive' | 'passive' | string;
  actions: UnitAction[];
}

export interface Unit {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  spd: number;
  usedEffects?: {
    preventKnockout?: boolean;
  };
  attack?: number;
  target_type?: string;
  strategy?: UnitStrategy;
}

export interface TestStep {
  step: number;
  expected_actor: string;
  action: {
    type: string;
    actor?: string;
    description: string;
    expected_result: string[];
  };
}

export interface InstructionData {
  id: string;
  name: string;
  description: string;
  setup: {
    blessings: string[];
    player_units: Unit[];
    enemy_units: Unit[];
  };
  test_sequence: TestStep[];
  validation?: {
    success_conditions: string[];
    edge_cases: string[];
  };
}