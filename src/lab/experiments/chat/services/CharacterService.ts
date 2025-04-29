import { CharacterPosition } from '../EventCommand';

// Simple event emitter for character changes
type CharacterChangeListener = (characters: Record<CharacterPosition, string | null>) => void;

/**
 * CharacterService
 * 
 * Singleton service that manages character sprite states
 * Used by the CharacterLayer component and the DialogExecutor
 */
class CharacterService {
    private static instance: CharacterService;
    private characters: Record<CharacterPosition, string | null> = {
        [CharacterPosition.LEFT]: null,
        [CharacterPosition.MIDDLE]: null, 
        [CharacterPosition.RIGHT]: null
    };
    private listeners: CharacterChangeListener[] = [];

    private constructor() {}

    /**
     * Get the singleton instance
     */
    public static getInstance(): CharacterService {
        if (!CharacterService.instance) {
            CharacterService.instance = new CharacterService();
        }
        return CharacterService.instance;
    }

    /**
     * Get all character positions and sprites
     */
    public getCharacters(): Record<CharacterPosition, string | null> {
        return { ...this.characters };
    }

    /**
     * Show a character at a specific position
     */
    public showCharacter(position: CharacterPosition, spriteUrl: string): void {
        if (this.characters[position] === spriteUrl) return; // No change
        
        console.log(`CharacterService: Showing character at ${position} with sprite ${spriteUrl}`);
        this.characters = {
            ...this.characters,
            [position]: spriteUrl
        };
        this.notifyListeners();
    }

    /**
     * Hide a character at a specific position
     */
    public hideCharacter(position: CharacterPosition): void {
        if (this.characters[position] === null) return; // Already hidden
        
        console.log(`CharacterService: Hiding character at ${position}`);
        this.characters = {
            ...this.characters,
            [position]: null
        };
        this.notifyListeners();
    }

    /**
     * Add a listener for character changes
     */
    public addChangeListener(listener: CharacterChangeListener): void {
        this.listeners.push(listener);
    }

    /**
     * Remove a listener
     */
    public removeChangeListener(listener: CharacterChangeListener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    /**
     * Notify all listeners of character changes
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener({ ...this.characters }));
    }
}

// Export singleton instance
export const characterService = CharacterService.getInstance(); 