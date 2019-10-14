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
import {PinchToZoom} from 'pinch-to-zoom';

export class PinchToZoomImage extends React.Component {
    imgRef = React.createRef();
    pinchToZoom = null;

    componentDidMount() {
        if (this.imgRef.current) {
            this.pinchToZoom = new PinchToZoom(this.imgRef.current);
        }
    }

    // Don't forget to unsubscribe before unmounting
    componentWillUnmount() {
        if (this.pinchToZoom) {
            this.pinchToZoom.unsubscribe();
        }
    }

    render() {
        return (
            <img ref={imgRef} />
        );
    }
}

```

 ## React functional Usage

```js
import React, { useRef, useEffect } from 'react';
import { PinchToZoom } from 'pinch-to-zoom';
 const PinchToZoomImage = props => {
    const imgRef = useRef(null)
    const pinchToZoom = useRef(null)
    useEffect(() => {
        if (imgRef.current) {
        pinchToZoom.current = new PinchToZoom(imgRef.current)
        }
        return () => {
        if (pinchToZoom.current) {
            pinchToZoom.current.unsubscribe()
        }
        }
    }, [])
   return <img ref={imgRef} {...props} />
}
```