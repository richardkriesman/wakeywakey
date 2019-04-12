import { Watcher } from "./Watcher";

/**
 * An Emitter is producer-end version of a {@link Watcher}. It can update all handlers for its Watcher counterpart, and
 * accepts handlers for de-allocation.
 */
export class Emitter<T> implements Watcher<T> {

    private data?: T[];
    private readonly filterHandlers: Array<(data: T[]) => T[]> = [];
    private readonly deallocHandlers: Array<() => void> = [];
    private readonly handlers: Array<(data: T[]) => void> = [];

    public on(fn: (data: T[]) => void): void {
        this.handlers.push(fn);
        if (this.data) {
            fn(this.data);
        }
    }

    public onDealloc(fn: () => void): void {
        this.deallocHandlers.push(fn);
    }

    public onFilter(fn: (data: T[]) => T[]): void {
        this.filterHandlers.push(fn);
    }

    public off(fn: (data: T[]) => void): void {
        const index: number = this.handlers.indexOf(fn);
        if (index >= 0) {
            this.handlers.slice(index, 1);
        }
        if (this.handlers.length === 0) { // watcher is no longer used, deallocate it
            this.deallocHandlers.forEach((h) => h());
        }
    }

    /**
     * Updates the {@link Emitter}'s data set, notifying each handler of the change.
     *
     * @param data New data set
     */
    public update(data: T[]): void {
        this.data = data;
        for (const filter of this.filterHandlers) {
            this.data = filter(this.data);
        }
        this.handlers.forEach((h) => h(this.data));
    }

    /**
     * Updates the {@link Emitter}'s data set, notifying each handler of the change.
     *
     * Unlike `update()`, the data set will be updated ONLY if this is the initial data set. If `update()` has already
     * been called, this data set will be discarded.
     *
     * @param data Initial data set
     */
    public updateInitialSet(data: T[]): void {
        if (!this.data) {
            this.update(data);
        }
    }

}
