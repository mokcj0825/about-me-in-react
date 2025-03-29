import { Blessing } from './types';

/**
 * Loads a blessing by its ID
 */
export async function loadBlessing(blessingId: string): Promise<Blessing> {
  try {
    const module = await import(`../../data/${blessingId}.json`);
    return module.default;
  } catch (error) {
    throw new Error(`Failed to load blessing ${blessingId}: ${error instanceof Error ? error.message : String(error)}`);
  }
} 