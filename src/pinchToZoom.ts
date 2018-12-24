interface IPoint {
    x: number;
    y: number;
}

interface IPinchToZoomConfig {
    maxScale: number;
    minScale: number;
    transitionDuration: number;
}

let defaultConfig: IPinchToZoomConfig = {
    maxScale: 4,
    minScale: 0.5,
    transitionDuration: 100,
};

function getPointFromTouch(touch: Touch): IPoint {
    return {
        x: touch.clientX,
        y: touch.clientY,
    };
}

function getLengthOfLine(point1: IPoint, point2: IPoint): number {
    let middlePoint: IPoint = {
        x: point2.x,
        y: point1.y,
    };

    let legX: number = Math.abs(middlePoint.x - point1.x);
    let legY: number = Math.abs(middlePoint.y - point2.y);

    return Math.sqrt(legX * legX + legY * legY);
}

function getMiddleOfLine(point1: IPoint, point2: IPoint): IPoint {
    return {
        x: Math.min(point2.x, point1.x) + (Math.abs(point2.x - point1.x) / 2),
        y: Math.min(point2.y, point1.y) + (Math.abs(point2.y - point1.y) / 2),
    };
}

export class PinchToZoom {
    private startPoint: IPoint;
    private initialPinchLength: number;
    private currentPinchLength: number;
    private initialBoundingRect: ClientRect | DOMRect;
    private timeoutId: number;

    constructor(private element: HTMLElement, private config: IPinchToZoomConfig = defaultConfig) {
        element.addEventListener('touchstart', this.onTouchStart);
        element.addEventListener('touchmove', this.onTouchMove);
        element.addEventListener('touchend', this.onTouchEnd);
        element.addEventListener('touchcancel', this.onTouchEnd);
    }

    private onTouchStart = (event: TouchEvent) => {
        if (event.touches.length !== 2) {
            return;
        }

        this.initialBoundingRect = this.element.getBoundingClientRect();
        let isTouchesOnImages = [].every.call(event.touches, (touch: Touch) => {
            let point = getPointFromTouch(touch);
            return (
                (point.x <= this.initialBoundingRect.right) && (point.x >= this.initialBoundingRect.left)
                &&
                (point.y <= this.initialBoundingRect.bottom) && (point.y >= this.initialBoundingRect.top)
            );
        });

        if (!isTouchesOnImages) {
            return;
        }

        event.preventDefault();
        this.setTransitionDuration(0);
        let touch1 = getPointFromTouch(event.touches[0]);
        let touch2 = getPointFromTouch(event.touches[1]);

        let middleTouch: IPoint = getMiddleOfLine(touch1, touch2);

        let boxSize = this.initialBoundingRect;

        let middleOnElement = {
            x: middleTouch.x - boxSize.left,
            y: middleTouch.y - boxSize.top,
        };

        this.initialPinchLength = getLengthOfLine(touch1, touch2);
        this.setTransformOrigin(`${middleOnElement.x}px`, `${middleOnElement.y}px`);
        this.startPoint = middleOnElement;
    }

    private onTouchMove = (event: TouchEvent) => {
        if (this.startPoint) {
            this.currentPinchLength = getLengthOfLine(
                getPointFromTouch(event.touches[0]),
                getPointFromTouch(event.touches[1]),
            );

            let touch1 = getPointFromTouch(event.touches[0]);
            let touch2 = getPointFromTouch(event.touches[1]);

            let middleTouch: IPoint = getMiddleOfLine(touch1, touch2);

            let boxSize = this.initialBoundingRect;

            let middleOnElement = {
                x: middleTouch.x - boxSize.left,
                y: middleTouch.y - boxSize.top,
            };

            this.setTransform(
                this.currentPinchLength / this.initialPinchLength,
                middleOnElement.x - this.startPoint.x,
                middleOnElement.y - this.startPoint.y,
            );
        }
    }

    private onTouchEnd = () => {
        this.setTransitionDuration(this.config.transitionDuration);
        this.setTransform(1, 0, 0);
        clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(() => {
            this.setTransitionDuration(0);
            this.setTransformOrigin('50%', '50%');
        }, this.config.transitionDuration);

        this.reset();
    }

    private reset = () => {
        this.startPoint = null;
        this.initialPinchLength = null;
        this.currentPinchLength = null;
        this.initialBoundingRect = null;
        this.timeoutId = null;
    }

    private setTransitionDuration = (duration: number) => {
        this.element.style.transitionDuration = `${duration}ms`;
    }

    private setTransform = (scale: number, translateX: number, translateY: number) => {
        scale = scale < this.config.minScale ? this.config.minScale : scale;
        scale = scale > this.config.maxScale ? this.config.maxScale : scale;
        this.element.style.transform = (
            `translate3d(${translateX}px, ${translateY}px, 0)` +
            `scale3d(${scale}, ${scale}, 1)`
        );
    }

    private setTransformOrigin = (x: string, y: string) => {
        this.element.style.transformOrigin = `${x} ${y} 0`;
    }
}
