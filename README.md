# pinch-to-zoom
Instagram like Pinch-to-zoom.

No dependencies.

# Usage
```js
interface PinchToZoomConfig {
    maxScale: number;
    minScale: number;
    transitionDuration: number;
    onScale?: (scale: number, translateX: number, translateY: number) => any;
}

new PinchToZoom(element: HTMLElement, options?: PinchToZoomConfig);
```

## Default Options
```
maxScale: 4
minScale: 1
transitionDuration: 100
```
