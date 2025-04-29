// Constants for configuration
const BACKGROUND_CONFIG = {
    BASE_PATH: '/background/',
} as const;

// Simple event emitter for background changes
type BackgroundChangeListener = (background: string | null) => void;

/**
 * BackgroundService
 * 
 * Singleton service that manages the background state
 * Used by the BackgroundLayer component and the DialogExecutor
 */
class BackgroundService {
    private static instance: BackgroundService;
    private currentBackground: string | null = null;
    private listeners: BackgroundChangeListener[] = [];

    private constructor() {}

    /**
     * Get the singleton instance
     */
    public static getInstance(): BackgroundService {
        if (!BackgroundService.instance) {
            BackgroundService.instance = new BackgroundService();
        }
        return BackgroundService.instance;
    }

    /**
     * Get the current background
     */
    public getBackground(): string | null {
        return this.currentBackground;
    }

    /**
     * Set the background
     * @param background The background image path or null to remove
     */
    public setBackground(background: string | null): void {
        if (this.currentBackground === background) return; // No change
        
        console.log(`BackgroundService: Setting background to ${background}`);
        this.currentBackground = background;
        this.notifyListeners();
    }

    /**
     * Get the full background image URL
     */
    public getBackgroundImageUrl(): string | null {
        if (!this.currentBackground) return null;
        return `${BACKGROUND_CONFIG.BASE_PATH}${this.currentBackground}`;
    }

    /**
     * Add a listener for background changes
     */
    public addChangeListener(listener: BackgroundChangeListener): void {
        this.listeners.push(listener);
    }

    /**
     * Remove a listener
     */
    public removeChangeListener(listener: BackgroundChangeListener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    /**
     * Notify all listeners of a background change
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.currentBackground));
    }
}

// Export singleton instance
export const backgroundService = BackgroundService.getInstance(); 