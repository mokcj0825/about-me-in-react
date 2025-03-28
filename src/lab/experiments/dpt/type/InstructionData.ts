export interface Unit {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    energy?: number;
    maxEnergy?: number;
    attack?: number;
    target_type?: string;
  }
  
  export interface TestStep {
    step: number;
    action: {
      actor: string;
      type: string;
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
    validation: {
      success_conditions: string[];
      edge_cases: string[];
    };
  }