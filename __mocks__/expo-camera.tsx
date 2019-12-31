import React, {
  forwardRef,
  Ref,
  useImperativeHandle,
  useLayoutEffect
} from "react";
import { View } from "react-native";

/**
 * A functional component is used so that we can call onCameraReady
 * only when the ref has initialized (useLayoutEffect).
 * By using `useImperativeHandle`, we can specify the methods belonging
 * to the ref.
 */

// eslint-disable-next-line react/display-name
export const Camera = forwardRef<View, { onCameraReady?: () => void }>(
  ({ onCameraReady, ...props }, ref: Ref<any>) => {
    useImperativeHandle(ref, () => ({
      getSupportedRatiosAsync: () => Promise.resolve(["4:3", "16:9"])
    }));

    useLayoutEffect(() => {
      onCameraReady?.();
    }, [onCameraReady]);

    return <View testID="qr-camera" ref={ref} {...props}></View>;
  }
);
