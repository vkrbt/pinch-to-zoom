let imgElement = document.getElementById('img');

interface Point {
    x: number;
    y: number;
}

class PinchToZoom {
    private startPoint: Point;
    private initialPinchLength: number;
    private currentPinchLength: number;
    private element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
        
        element.addEventListener('touchstart', this.onTouchStart);
        element.addEventListener('touchmove', this.onTouchMove);
        element.addEventListener('touchend', this.onTouchEnd);
    }

    onTouchStart = (event: TouchEvent) => {
        if (event.touches.length === 2) {
            event.preventDefault();

            let touch1 = getPointFromTouch(event.touches[0]);
            let touch2 = getPointFromTouch(event.touches[1]);

            let middleOfTouch: Point = getMiddleOfLine(touch1, touch2);

            console.log(this.element);
            let boxSize = this.element.getBoundingClientRect();

            this.startPoint = {
                x: boxSize.left + middleOfTouch.x,
                y: boxSize.top + middleOfTouch.y,
            }

            this.initialPinchLength = getLengthOfLine(touch1, touch2);
        }
    }

    onTouchMove = (event: TouchEvent) => {
        if (event.touches.length === 2) {
            this.currentPinchLength = getLengthOfLine(
                getPointFromTouch(event.touches[0]),
                getPointFromTouch(event.touches[1]),
            );
            this.element.style.transform = `scale(${this.currentPinchLength / this.initialPinchLength})`
        }
    }

    onTouchEnd = () => {
        this.element.style.transform = `scale(1)`
    }
}

function getPointFromTouch(touch: Touch): Point {
    return {
        x: touch.clientX,
        y: touch.clientY,
    }
}

function getLengthOfLine(point1: Point, point2: Point): number {
    let middlePoint: Point = {
        x: point2.x,
        y: point1.y,
    }

    let legX: number = Math.abs(middlePoint.x - point1.x);
    let legY: number = Math.abs(middlePoint.y - point2.y);

    return Math.sqrt(legX * legX + legY * legY);
}

function getMiddleOfLine(point1: Point, point2: Point): Point {
    return {
        x: Math.min(point2.x, point1.x) + Math.abs(point2.x - point1.x) / 2,
        y: Math.min(point2.y, point1.y) + Math.abs(point2.y - point1.y) / 2,
    }
};

new PinchToZoom(imgElement);