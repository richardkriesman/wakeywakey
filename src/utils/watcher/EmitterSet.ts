import { Emitter } from "./Emitter";

/**
 * An EmitterSet is a set of {@link Emitter}s.
 */
export class EmitterSet<T> {

    private readonly emitters: Array<Emitter<T>> = [];

    public constructor(emitters: Array<Emitter<T>> = []) {
        this.emitters = emitters;
    }

    public create(): Emitter<T> {
        const emitter = new Emitter<T>();
        emitter.onDealloc(() => this.remove(emitter));
        this.emitters.push(emitter);
        return emitter;
    }

    public remove(emitter: Emitter<T>): void {
        const index: number = this.emitters.indexOf(emitter);
        if (index >= 0) {
            this.emitters.slice(index, 1);
        }
    }

    public update(data: T[]): void {
        this.emitters.forEach((emitter) => emitter.update(data.slice(0)));
    }

}
