# pinch-to-zoom
Instagram like Pinch-to-zoom.
[DEMO](https://vkrbt.github.io/pinch-to-zoom/demo/) Pinch on multitouch devices on images.
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

## React Usage
```js
import React from 'react';

export class PinchToZoom extends React.Component {
    imgRef = React.createRef();
    pinchToZoom = null;

    componentDidMount() {
        if (this.imgRef.current) {
            this.pinchToZoom = new PinchToZoom(this.imgRef.current);
        }
    }

    // Don't forget to unsibscribe before unmounting
    componentWillUnmount() {
        if (this.pinchToZoom) {
            this.pinchToZoom.unsubscibe();
        }
    }

    render() {
        return (
            <img ref={imgRef} />
        );
    }
}

```