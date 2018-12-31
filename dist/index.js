import { getLengthOfLine, getMiddleTouchOnElement, isTouchesInsideRect, } from './helpers';
let defaultConfig = {
    maxScale: 4,
    minScale: 1,
    transitionDuration: 100,
};
export class PinchToZoom {
    constructor(element, config = defaultConfig) {
        this.element = element;
        this.unsibscribe = () => {
            clearTimeout(this.timeoutId);
            this.element.removeEventListener('touchstart', this.onTouchStart);
            this.element.removeEventListener('touchmove', this.onTouchMove);
            this.element.removeEventListener('touchend', this.onTouchEnd);
            this.element.removeEventListener('touchcancel', this.onTouchEnd);
        };
        this.onTouchStart = (event) => {
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
            let middleTouchOnElement = getMiddleTouchOnElement(event.touches, this.initialBoundingRect);
            this.initialPinchLength = getLengthOfLine(touch1, touch2);
            this.setTransformOrigin(`${middleTouchOnElement.clientX}px`, `${middleTouchOnElement.clientY}px`);
            this.firstTouch = middleTouchOnElement;
        };
        this.onTouchMove = (event) => {
            if (this.firstTouch) {
                let middleTouchOnElement = getMiddleTouchOnElement(event.touches, this.initialBoundingRect);
                this.currentPinchLength = getLengthOfLine(event.touches[0], event.touches[1]);
                let scale = this.currentPinchLength / this.initialPinchLength;
                let translateX = middleTouchOnElement.clientX - this.firstTouch.clientX;
                let translateY = middleTouchOnElement.clientY - this.firstTouch.clientY;
                this.setTransform(scale, translateX, translateY);
                if (this.config.onScale) {
                    this.config.onScale(scale, translateX, translateY);
                }
            }
        };
        this.onTouchEnd = () => {
            this.setTransitionDuration(this.config.transitionDuration);
            this.setTransform(1, 0, 0);
            clearTimeout(this.timeoutId);
            this.timeoutId = window.setTimeout(() => {
                this.setTransitionDuration(0);
                this.setTransformOrigin('50%', '50%');
            }, this.config.transitionDuration);
            this.resetProperties();
        };
        this.resetProperties = () => {
            this.firstTouch = null;
            this.initialPinchLength = null;
            this.currentPinchLength = null;
            this.initialBoundingRect = null;
        };
        this.setTransitionDuration = (duration) => {
            this.element.style.transitionDuration = `${duration}ms`;
        };
        this.setTransform = (scale, translateX, translateY) => {
            scale = scale < this.config.minScale ? this.config.minScale : scale;
            scale = scale > this.config.maxScale ? this.config.maxScale : scale;
            this.element.style.transform = (`translate3d(${translateX}px, ${translateY}px, 0)` +
                `scale3d(${scale}, ${scale}, 1)`);
        };
        this.setTransformOrigin = (x, y) => {
            this.element.style.transformOrigin = `${x} ${y} 0`;
        };
        this.config = Object.assign({}, defaultConfig, config);
        element.addEventListener('touchstart', this.onTouchStart);
        element.addEventListener('touchmove', this.onTouchMove);
        element.addEventListener('touchend', this.onTouchEnd);
        element.addEventListener('touchcancel', this.onTouchEnd);
    }
}
