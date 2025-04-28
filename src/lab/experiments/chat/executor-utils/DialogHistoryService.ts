import { DialogEvent } from '../utils/DialogEvent';
import { isShowMessageEvent } from '../execution/ShowMessage';

// Singleton pattern for the history service
class DialogHistoryService {
    private static instance: DialogHistoryService;
    private history: DialogEvent[] = [];
    private processedIds = new Set<string>();
    private subscribers: Set<(history: DialogEvent[]) => void> = new Set();
    
    private constructor() {}
    
    public static getInstance(): DialogHistoryService {
        if (!DialogHistoryService.instance) {
            DialogHistoryService.instance = new DialogHistoryService();
        }
        return DialogHistoryService.instance;
    }
    
    // Add an event to history
    public addEvent(event: DialogEvent): void {
        // Check if this event has already been processed
        if (event.id && this.processedIds.has(event.id)) {
            console.log(`Event already in history: ${event.id}`);
            return;
        }
        
        // Add the event to history
        this.history.push(event);
        
        // Mark the ID as processed
        if (event.id) {
            this.processedIds.add(event.id);
        }
        
        console.log(`Added event to history: ${event.id || 'no_id'}`);
        this.notifySubscribers();
    }
    
    // Get filtered message history
    public getMessageHistory(): DialogEvent[] {
        return this.history.filter(isShowMessageEvent);
    }
    
    // Get total count of message events
    public getMessageCount(): number {
        return this.history.filter(isShowMessageEvent).length;
    }
    
    // Get a specific message by index
    public getMessageByIndex(index: number): DialogEvent | null {
        const messageHistory = this.getMessageHistory();
        return index >= 0 && index < messageHistory.length ? messageHistory[index] : null;
    }
    
    // Subscribe to history changes
    public subscribe(callback: (history: DialogEvent[]) => void): () => void {
        this.subscribers.add(callback);
        
        // Return unsubscribe function
        return () => {
            this.subscribers.delete(callback);
        };
    }
    
    // Clear history
    public clearHistory(): void {
        this.history = [];
        this.processedIds.clear();
        console.log('History cleared');
        this.notifySubscribers();
    }
    
    // Notify all subscribers of changes
    private notifySubscribers(): void {
        const messageHistory = this.getMessageHistory();
        this.subscribers.forEach(callback => callback(messageHistory));
    }
}

export default DialogHistoryService.getInstance(); 