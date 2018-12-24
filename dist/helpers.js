export function getLengthOfLine(point1, point2) {
    let middlePoint = {
        clientX: point2.clientX,
        clientY: point1.clientY,
    };
    let legX = Math.abs(middlePoint.clientX - point1.clientX);
    let legY = Math.abs(middlePoint.clientY - point2.clientY);
    return Math.sqrt(legX * legX + legY * legY);
}
export function getMiddleOfLine(point1, point2) {
    return {
        clientX: Math.min(point2.clientX, point1.clientX) + (Math.abs(point2.clientX - point1.clientX) / 2),
        clientY: Math.min(point2.clientY, point1.clientY) + (Math.abs(point2.clientY - point1.clientY) / 2),
    };
}
export function getMiddleTouchOnElement(touches, boundingRect) {
    let middleTouch = getMiddleOfLine(touches[0], touches[1]);
    return {
        clientX: middleTouch.clientX - boundingRect.left,
        clientY: middleTouch.clientY - boundingRect.top,
    };
}
export function isTouchesInsideRect(touches, rect) {
    return Array.prototype.every.call(touches, (touch) => ((touch.clientX <= rect.right) && (touch.clientX >= rect.left)
        &&
            (touch.clientY <= rect.bottom) && (touch.clientY >= rect.top)));
}
