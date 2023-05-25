function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { forwardRef, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { FlatList } from '@sendbird/react-native-scrollview-enhancer';
import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP, getMessageUniqId, useFreshCallback } from '@sendbird/uikit-utils';
let ANDROID_BUG_ALERT_SHOWED = Platform.OS !== 'android';
const BOTTOM_DETECT_THRESHOLD = 25;
const UNREACHABLE_THRESHOLD = Number.MIN_SAFE_INTEGER;
// FIXME: Inverted FlatList performance issue on Android {@link https://github.com/facebook/react-native/issues/30034}
const ChatFlatList = /*#__PURE__*/forwardRef(function CustomFlatList(_ref, ref) {
  var _props$data;
  let {
    onTopReached,
    onBottomReached,
    onScrolledAwayFromBottom,
    onLeaveScrollBottom,
    onScroll,
    ...props
  } = _ref;
  const {
    select
  } = useUIKitTheme();
  const contentOffsetY = useRef(0);
  const _onScroll = useFreshCallback(event => {
    onScroll === null || onScroll === void 0 ? void 0 : onScroll(event);
    const {
      contentOffset
    } = event.nativeEvent;
    const prevOffsetY = contentOffsetY.current;
    const currOffsetY = contentOffset.y;
    if (BOTTOM_DETECT_THRESHOLD < prevOffsetY && currOffsetY <= BOTTOM_DETECT_THRESHOLD) {
      onScrolledAwayFromBottom(false);
      onLeaveScrollBottom === null || onLeaveScrollBottom === void 0 ? void 0 : onLeaveScrollBottom(false);
    } else if (BOTTOM_DETECT_THRESHOLD < currOffsetY && prevOffsetY <= BOTTOM_DETECT_THRESHOLD) {
      onScrolledAwayFromBottom(true);
      onLeaveScrollBottom === null || onLeaveScrollBottom === void 0 ? void 0 : onLeaveScrollBottom(true);
    }
    contentOffsetY.current = contentOffset.y;
  });
  if (__DEV__ && !ANDROID_BUG_ALERT_SHOWED) {
    ANDROID_BUG_ALERT_SHOWED = true;
    // eslint-disable-next-line no-console
    console.warn('UIKit Warning: Inverted FlatList has a performance issue on Android, Maybe this is a bug please refer link\nhttps://github.com/facebook/react-native/issues/30034');
  }
  return /*#__PURE__*/React.createElement(FlatList, _extends({
    bounces: false,
    removeClippedSubviews: true,
    keyboardDismissMode: 'on-drag',
    keyboardShouldPersistTaps: 'handled',
    indicatorStyle: select({
      light: 'black',
      dark: 'white'
    })
  }, props, {
    // FIXME: inverted list of ListEmptyComponent is reversed {@link https://github.com/facebook/react-native/issues/21196#issuecomment-836937743}
    inverted: Boolean((_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.length),
    ref: ref,
    onEndReached: onTopReached,
    onScrollToIndexFailed: NOOP,
    onStartReached: onBottomReached,
    scrollEventThrottle: 16,
    onScroll: _onScroll,
    keyExtractor: getMessageUniqId,
    style: {
      flex: 1,
      ...StyleSheet.flatten(props.style)
    },
    maintainVisibleContentPosition: {
      minIndexForVisible: 0,
      autoscrollToTopThreshold: UNREACHABLE_THRESHOLD
    }
  }));
});
export default ChatFlatList;
//# sourceMappingURL=ChatFlatList.js.map