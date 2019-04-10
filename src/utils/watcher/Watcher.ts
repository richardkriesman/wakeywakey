/**
 * A Watcher watches for updates to a data set.
 *
 * When a handler is added to the Watcher, it is guaranteed to receive the current data set. It will then be called
 * again for any changes to that data set.
 *
 * When all handlers are removed from the Watcher, it will be de-allocated and will no longer receive updates. You
 * should only use a Watcher instance on a single screen.
 */
export interface Watcher<T> {
    on(fn: (data: T) => void): void;
    off(fn: (data: T) => void): void;
}
