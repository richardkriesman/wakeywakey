import { Watcher } from "./Watcher";

/**
 * An Emitter is producer-end version of a {@link Watcher}. It can update all handlers for its Watcher counterpart, and
 * accepts handlers for de-allocation.
 */
export class Emitter<T> implements Watcher<T> {

    private data?: T;
    private readonly deallocHandlers: Array<() => void> = [];
    private readonly handlers: Array<(data: T) => void> = [];

    public on(fn: (data: T) => void): void {
        this.handlers.push(fn);
        if (this.data) {
            fn(this.data);
        }
    }

    public onDealloc(fn: () => void): void {
        this.deallocHandlers.push(fn);
    }

    public off(fn: (data: T) => void): void {
        const index: number = this.handlers.indexOf(fn);
        if (index >= 0) {
            this.handlers.slice(index, 1);
        }
        if (this.handlers.length === 0) { // watcher is no longer used, deallocate it
            this.deallocHandlers.forEach((h) => h());
        }
    }

    public update(data: T): void {
        this.data = data;
        this.handlers.forEach((h) => h(this.data));
    }

}
