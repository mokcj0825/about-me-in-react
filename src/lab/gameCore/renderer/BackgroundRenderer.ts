import { Position } from './map-utils';

/**
 * Manages map background images and their positioning
 */
export class BackgroundRenderer {
  private static loadedBackgrounds: Map<string, string> = new Map();
  
  /**
   * Loads a background image for a specific map
   * @param mapId - The ID of the map
   * @param backgroundPath - The path to the background image
   * @returns Promise that resolves with the image URL when loaded
   */
  static async loadBackground(mapId: string, backgroundPath: string): Promise<string | null> {
    
    // If already loaded, return the cached URL
    if (this.loadedBackgrounds.has(mapId)) {
      console.log(`Background already loaded for map ${mapId}`);
      return this.loadedBackgrounds.get(mapId) || null;
    }
    
    try {
      // Check if the backgroundPath already includes an extension
      const hasExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(backgroundPath);
      const pathWithExtension = hasExtension ? backgroundPath : `${backgroundPath}`;
      
      // Try to import the image directly
      try {
        // Updated path to match the actual directory structure
        const imageModule = await import(`../../../assets/maps/background/${pathWithExtension}`);
        
        // Cache the URL
        this.loadedBackgrounds.set(mapId, imageModule.default);
        return imageModule.default;
      } catch (importError) {
        console.error(`Failed to import image:`, importError);
        
        // Fallback to URL approach with updated path
        const imageUrl = new URL(
          `../../../assets/maps/background/${pathWithExtension}`,
          import.meta.url
        ).href;
        
        // Cache the URL
        this.loadedBackgrounds.set(mapId, imageUrl);
        return imageUrl;
      }
    } catch (error) {
      console.error(`Failed to load background for map: ${mapId}`, error);
      return null;
    }
  }
  
  /**
   * Gets the CSS background style for a map
   * @param mapId - The ID of the map
   * @param position - The current position of the map
   * @returns CSS properties for the background
   */
  static getBackgroundStyle(mapId: string, position: Position): React.CSSProperties {
    const backgroundUrl = this.loadedBackgrounds.get(mapId);
    
    if (!backgroundUrl) {
      console.log(`No background URL found for map ${mapId}`);
      return {};
    }
    
    // Instead of using backgroundPosition, we'll use transform to ensure
    // the background moves exactly the same as the map content
    const style = {
      backgroundImage: `url(${backgroundUrl})`,
      backgroundSize: '100% 100%', // Changed from 'cover' to '100% 100%' to ensure full stretching
      backgroundRepeat: 'no-repeat',
      // Remove backgroundPosition and use transform instead
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: 'transform 0.1s linear',
    };
    
    console.log(`Background style for map ${mapId}:`, style);
    return style;
  }
} 