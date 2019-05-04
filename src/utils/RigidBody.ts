const SAMPLE_SET_SIZE: number = 10;

export class RigidBody {

    private xSamples: number[] = [];
    private ySamples: number[] = [];
    private timeSamples: number[] = [];

    private _xVelocity: number = 0;
    private _yVelocity: number = 0;

    public constructor(x: number, y: number) {
        this.moveTo(x, y);
    }

    public moveTo(x: number, y: number): void {
        this.xSamples.push(x);
        this.ySamples.push(y);
        this.timeSamples.push(new Date().getTime());

        if (this.xSamples.length > SAMPLE_SET_SIZE) {
            this.xSamples.shift();
            this.ySamples.shift();
            this.timeSamples.shift();
        }

        if (this.xSamples.length >= 2) {
            const xDelta: number = this.xSamples[this.xSamples.length - 1] - this.xSamples[this.xSamples.length - 2];
            const yDelta: number = this.ySamples[this.ySamples.length - 1] - this.ySamples[this.ySamples.length - 2];
            const timeDelta: number = (this.timeSamples[this.timeSamples.length - 1] -
                this.timeSamples[this.timeSamples.length - 2]) / 1000;
            this._xVelocity = xDelta / timeDelta;
            this._yVelocity = yDelta / timeDelta;
        }
    }

    public get x(): number {
        return this.xSamples[this.xSamples.length - 1];
    }

    public get xVelocity(): number {
        return this._xVelocity;
    }

    public get yVelocity(): number {
        return this._yVelocity;
    }

    public get y(): number {
        return this.ySamples[this.ySamples.length - 1];
    }

}
