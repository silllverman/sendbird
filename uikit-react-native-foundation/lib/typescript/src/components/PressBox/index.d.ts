import * as React from 'react';
import type { GestureResponderEvent, StyleProp, ViewProps, ViewStyle } from 'react-native';
type PressBoxStateParams = {
    pressed: boolean;
};
type Props = {
    onPress?: (event: GestureResponderEvent) => void;
    onLongPress?: (event: GestureResponderEvent) => void;
    delayLongPress?: number;
    activeOpacity?: number;
    style?: StyleProp<ViewStyle> | ((state: PressBoxStateParams) => StyleProp<ViewStyle>);
    hitSlop?: ViewProps['hitSlop'];
    children?: React.ReactNode | ((params: PressBoxStateParams) => React.ReactNode);
};
export declare const DEFAULT_LONG_PRESS_DELAY = 350;
declare const PressBox: (props: Props) => JSX.Element;
export default PressBox;
