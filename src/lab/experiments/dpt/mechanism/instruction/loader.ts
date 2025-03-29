import { InstructionData } from '../../type/InstructionData';

/**
 * Loads instruction data by blessing ID
 */
export async function loadInstruction(blessingId: string): Promise<InstructionData> {
  try {
    const module = await import(`../../instructions/${blessingId}.json`);
    return module.default;
  } catch (error) {
    throw new Error(`Failed to load instruction for blessing ${blessingId}: ${error instanceof Error ? error.message : String(error)}`);
  }
} 