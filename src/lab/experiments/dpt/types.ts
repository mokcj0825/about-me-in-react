export interface BlessingInstruction {
  id: string;
  name: string;
  description: string;
  rarity: number;
  category: 'defense' | 'offense' | 'hinder' | 'boost' | 'recovery';
  implementation: {
    data_structure: {
      [key: string]: any;
      event_type: string[];
      required_interface: {
        [key: string]: {
          method: string[];
        };
      };
    };
    event_flow: Array<{
      trigger: string;
      check?: string[];
      action: string[];
    }>;
    pseudocode: {
      [key: string]: string[];
    };
  };
  validation: {
    success_condition: string[];
    edge_case: string[];
  };
} 