export interface ITouchCoordinates {
    clientX: number;
    clientY: number;
}
export declare function getLengthOfLine(point1: Touch, point2: Touch): number;
export declare function getMiddleOfLine(point1: Touch, point2: Touch): ITouchCoordinates;
export declare function getMiddleTouchOnElement(touches: TouchList, boundingRect: ClientRect | DOMRect): ITouchCoordinates;
export declare function isTouchesInsideRect(touches: TouchList, rect: ClientRect | DOMRect): boolean;
