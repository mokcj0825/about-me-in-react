import { Blessing } from './types';

/**
 * Loads a blessing by ID
 */
export async function loadBlessing(id: string): Promise<Blessing> {
  const blessingData = await import(`../../data/${id}.json`);
  return blessingData as Blessing;
}