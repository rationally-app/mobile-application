import React, {
  FunctionComponent,
  useRef,
  RefObject,
  useEffect,
  ReactNode
} from "react";
import { View, StyleSheet } from "react-native";
import BottomSheetBehavior from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import { color, size, borderRadius, shadow } from "../../common/styles";

const { call } = Animated;

const FLICK_THRESHOLD = 0.04;
const OPEN_THRESHOLD = 0.7;
const CLOSE_THRESHOLD = 0.3;

const styles = StyleSheet.create({
  fixedHeaderWrapper: {
    height: 52,
    overflow: "hidden"
  },
  fixedHeader: {
    borderRadius: borderRadius(4),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: color("grey", 5),
    marginTop: size(4),
    height: size(2.5),
    borderColor: color("grey", 10),
    borderWidth: 1,
    borderBottomWidth: 0,
    ...shadow(4)
  },
  dragIndicator: {
    position: "absolute",
    alignSelf: "center",
    top: size(1),
    width: size(6),
    height: size(0.5),
    borderRadius: borderRadius(5),
    backgroundColor: "#E0E0E0"
  },
  connector: {
    // Ensures the header and content are connected nicely
    position: "absolute",
    bottom: -1,
    height: 2,
    backgroundColor: color("grey", 5),
    width: "100%"
  },
  contentWrapper: {
    minHeight: "100%",
    padding: size(3),
    paddingTop: size(0.5),
    backgroundColor: color("grey", 5)
  }
});

type BottomSheetChildrenFn = (openSheet: () => null | void) => ReactNode;

interface BottomSheet {
  children: ReactNode | BottomSheetChildrenFn;
  snapPoints?: (number | string)[];
  initialSnap?: number;
  onOpenEnd?: () => void;
  onCloseEnd?: () => void;
  onOpenStart?: () => void;
  onCloseStart?: () => void;
}

type SheetStatus = "opening" | "closing" | null;

export const BottomSheet: FunctionComponent<BottomSheet> = ({
  children,
  onOpenEnd,
  onCloseEnd,
  onOpenStart,
  onCloseStart,
  snapPoints = ["20%", "100%"],
  initialSnap
}) => {
  const bottomSheetRef: RefObject<BottomSheetBehavior> = useRef(null);

  // Snap to the first point whenever snapPoints changes,
  // this allows snapPoints to be dynamic
  useEffect(() => {
    requestAnimationFrame(() => {
      bottomSheetRef.current && bottomSheetRef.current.snapTo(0);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...snapPoints]);

  const sheetStatus = useRef<SheetStatus>(null);
  const isTransitioning = useRef(false);

  const openSheet = (): null | void => {
    // Ensure that snapTo is not called multiple times
    if (!isTransitioning.current) {
      isTransitioning.current = true;
      bottomSheetRef.current &&
        bottomSheetRef.current.snapTo(snapPoints.length - 1);
    }
  };

  const closeSheet = (): null | void => {
    if (!isTransitioning.current) {
      isTransitioning.current = true;
      bottomSheetRef.current && bottomSheetRef.current.snapTo(0);
    }
  };

  // This is updated by BottomSheetBehavior
  const sheetHiddenPercentage = new Animated.Value(1);

  // Keep track of the previous percentage. This allows us to
  // figure out whether the user's drag action was a quick flick
  const prevSheetHiddenPercentage = useRef(1);

  const handlePercentageChange = ([hiddenPercentage]: ReadonlyArray<
    number
  >): void => {
    const status = sheetStatus.current;
    const changeInHiddenPercentage =
      hiddenPercentage - prevSheetHiddenPercentage.current;

    if (!isTransitioning.current && status !== null) {
      // Two optimizations have been made:
      // 1. If the user flicks the bottom sheet up or down, it opens and closes accordingly.
      //    The default approach required the user to drag to the halfway point between
      //    the snap points to cause it to open/close.
      // 2. When the user opens the sheet, if the sheet is dragged over a threshold,
      //    the sheet automatically opens. (same thing happens when the sheet is being closed)
      if (
        changeInHiddenPercentage < -FLICK_THRESHOLD ||
        (status === "opening" && hiddenPercentage < OPEN_THRESHOLD)
      ) {
        openSheet();
      } else if (
        changeInHiddenPercentage > FLICK_THRESHOLD ||
        (status === "closing" && hiddenPercentage > CLOSE_THRESHOLD)
      ) {
        closeSheet();
      }
    }

    prevSheetHiddenPercentage.current = hiddenPercentage;
  };

  return (
    <>
      <Animated.Code
        exec={call<number>([sheetHiddenPercentage], handlePercentageChange)}
      />
      <BottomSheetBehavior
        ref={bottomSheetRef}
        renderHeader={() => <FixedHeader />}
        renderContent={() => (
          <ContentWrapper>
            {typeof children === "function"
              ? (children as BottomSheetChildrenFn)(openSheet)
              : children}
          </ContentWrapper>
        )}
        enabledContentTapInteraction={false}
        snapPoints={snapPoints}
        initialSnap={initialSnap}
        callbackNode={sheetHiddenPercentage}
        onOpenStart={() => {
          sheetStatus.current = "opening";
          onOpenStart?.();
        }}
        onOpenEnd={() => {
          sheetStatus.current = null;
          isTransitioning.current = false;
          onOpenEnd?.();
        }}
        onCloseStart={() => {
          sheetStatus.current = "closing";
          onCloseStart?.();
        }}
        onCloseEnd={() => {
          sheetStatus.current = null;
          isTransitioning.current = false;
          onCloseEnd?.();
        }}
      />
    </>
  );
};

const FixedHeader: FunctionComponent = () => (
  <>
    <View style={styles.fixedHeaderWrapper}>
      <View style={styles.fixedHeader}>
        <View testID="drag-indicator" style={styles.dragIndicator} />
      </View>
    </View>
    <View style={styles.connector} />
  </>
);

const ContentWrapper: FunctionComponent = ({ children }) => (
  <View style={styles.contentWrapper}>{children}</View>
);
