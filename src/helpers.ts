export interface ITouchCoordinates {
    clientX: number;
    clientY: number;
}

export function getLengthOfLine(point1: Touch, point2: Touch): number {
    let middlePoint: ITouchCoordinates = {
        clientX: point2.clientX,
        clientY: point1.clientY,
    };

    let legX: number = Math.abs(middlePoint.clientX - point1.clientX);
    let legY: number = Math.abs(middlePoint.clientY - point2.clientY);

    return Math.sqrt(legX * legX + legY * legY);
}

export function getMiddleOfLine(point1: Touch, point2: Touch): ITouchCoordinates {
    return {
        clientX: Math.min(point2.clientX, point1.clientX) + (Math.abs(point2.clientX - point1.clientX) / 2),
        clientY: Math.min(point2.clientY, point1.clientY) + (Math.abs(point2.clientY - point1.clientY) / 2),
    };
}

export function getMiddleTouchOnElement(touches: TouchList, boundingRect: ClientRect | DOMRect): ITouchCoordinates {
    let middleTouch: ITouchCoordinates = getMiddleOfLine(touches[0], touches[1]);

    return {
        clientX: middleTouch.clientX - boundingRect.left,
        clientY: middleTouch.clientY - boundingRect.top,
    };
}

export function isTouchesInsideRect(touches: TouchList, rect: ClientRect | DOMRect): boolean {
    return Array.prototype.every.call(touches, (touch: Touch) => (
        (touch.clientX <= rect.right) && (touch.clientX >= rect.left)
        &&
        (touch.clientY <= rect.bottom) && (touch.clientY >= rect.top)
    ));
}
