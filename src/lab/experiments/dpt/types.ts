export interface BlessingInstruction {
  id: string;
  name: string;
  description: string;
  rarity: number;
  category: 'defense' | 'offense' | 'hinder' | 'boost' | 'recovery';
  implementation: {
    data_structures: {
      [key: string]: any;
      event_types: string[];
      required_interfaces: {
        [key: string]: {
          methods: string[];
        };
      };
    };
    event_flow: Array<{
      trigger: string;
      checks?: string[];
      actions: string[];
    }>;
    pseudocode: {
      [key: string]: string[];
    };
  };
  validation: {
    success_conditions: string[];
    edge_cases: string[];
  };
} 