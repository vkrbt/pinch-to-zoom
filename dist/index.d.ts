export interface IPinchToZoomConfig {
    maxScale: number;
    minScale: number;
    transitionDuration: number;
    onScale?: (scale: number, translateX: number, translateY: number) => any;
}
export declare class PinchToZoom {
    private element;
    private firstTouch;
    private initialPinchLength;
    private currentPinchLength;
    private initialBoundingRect;
    private timeoutId;
    private config;
    constructor(element: HTMLElement, config?: IPinchToZoomConfig);
    unsibscribe: () => void;
    private onTouchStart;
    private onTouchMove;
    private onTouchEnd;
    private resetProperties;
    private setTransitionDuration;
    private setTransform;
    private setTransformOrigin;
}
