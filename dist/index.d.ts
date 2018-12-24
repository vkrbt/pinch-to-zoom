export interface IPinchToZoomConfig {
    maxScale: number;
    minScale: number;
    transitionDuration: number;
    onScale?: (scale: number, translateX: number, translateY: number) => any;
}
export declare class PinchToZoom {
    private element;
    private config;
    private firstTouch;
    private initialPinchLength;
    private currentPinchLength;
    private initialBoundingRect;
    private timeoutId;
    constructor(element: HTMLElement, config?: IPinchToZoomConfig);
    private onTouchStart;
    private onTouchMove;
    private onTouchEnd;
    private resetProperties;
    private setTransitionDuration;
    private setTransform;
    private setTransformOrigin;
}
