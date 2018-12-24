import {
    getLengthOfLine,
    getMiddleTouchOnElement,
    isTouchesInsideRect,
    ITouchCoordinates,
} from './helpers';

export interface IPinchToZoomConfig {
    maxScale: number;
    minScale: number;
    transitionDuration: number;
    onScale?: (scale: number, translateX: number, translateY: number) => any;
}

let defaultConfig: IPinchToZoomConfig = {
    maxScale: 4,
    minScale: 1,
    transitionDuration: 100,
};

export class PinchToZoom {
    private firstTouch: ITouchCoordinates;
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

    private onTouchStart = (event: TouchEvent): void => {
        if (event.touches.length !== 2) {
            return;
        }

        this.initialBoundingRect = this.element.getBoundingClientRect();

        if (!event.touches.length || !isTouchesInsideRect(event.touches, this.initialBoundingRect)) {
            return;
        }

        event.preventDefault();

        this.setTransitionDuration(0);

        let [touch1, touch2] = event.touches;
        let middleTouchOnElement: ITouchCoordinates = getMiddleTouchOnElement(
            event.touches,
            this.initialBoundingRect,
        );

        this.initialPinchLength = getLengthOfLine(touch1, touch2);
        this.setTransformOrigin(`${middleTouchOnElement.clientX}px`, `${middleTouchOnElement.clientY}px`);
        this.firstTouch = middleTouchOnElement;
    }

    private onTouchMove = (event: TouchEvent): void => {
        if (this.firstTouch) {
            let middleTouchOnElement: ITouchCoordinates = getMiddleTouchOnElement(
                event.touches,
                this.initialBoundingRect,
            );

            this.currentPinchLength = getLengthOfLine(event.touches[0], event.touches[1]);

            let scale: number = this.currentPinchLength / this.initialPinchLength;
            let translateX: number = middleTouchOnElement.clientX - this.firstTouch.clientX;
            let translateY: number = middleTouchOnElement.clientY - this.firstTouch.clientY;

            this.setTransform(scale, translateX, translateY);

            if (this.config.onScale) {
                this.config.onScale(scale, translateX, translateY);
            }
        }
    }

    private onTouchEnd = (): void => {
        this.setTransitionDuration(this.config.transitionDuration);
        this.setTransform(1, 0, 0);
        clearTimeout(this.timeoutId);

        this.timeoutId = window.setTimeout(() => {
            this.setTransitionDuration(0);
            this.setTransformOrigin('50%', '50%');
        }, this.config.transitionDuration);

        this.resetProperties();
    }

    private resetProperties = (): void => {
        this.firstTouch = null;
        this.initialPinchLength = null;
        this.currentPinchLength = null;
        this.initialBoundingRect = null;
    }

    private setTransitionDuration = (duration: number): void => {
        this.element.style.transitionDuration = `${duration}ms`;
    }

    private setTransform = (scale: number, translateX: number, translateY: number): void => {
        scale = scale < this.config.minScale ? this.config.minScale : scale;
        scale = scale > this.config.maxScale ? this.config.maxScale : scale;
        this.element.style.transform = (
            `translate3d(${translateX}px, ${translateY}px, 0)` +
            `scale3d(${scale}, ${scale}, 1)`
        );
    }

    private setTransformOrigin = (x: string, y: string): void => {
        this.element.style.transformOrigin = `${x} ${y} 0`;
    }
}
