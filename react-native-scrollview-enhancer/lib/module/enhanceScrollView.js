function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { ScrollViewEnhancerView } from './native';
import { getRNVersion } from './utils';
import { useBiDirectional } from './useBiDirectional';
const {
  minor
} = getRNVersion();
const SHOULD_ENHANCE = Platform.OS === 'android' && minor < 72;
const DEFAULT_PREVENT_AUTO_SCROLL_THRESHOLD = -(Dimensions.get('window').height * 2);
const getMaintainVisibleContentPosition = option => {
  return {
    autoscrollToTopThreshold: (option === null || option === void 0 ? void 0 : option.autoscrollToTopThreshold) ?? DEFAULT_PREVENT_AUTO_SCROLL_THRESHOLD,
    minIndexForVisible: (option === null || option === void 0 ? void 0 : option.minIndexForVisible) ?? 0
  };
};
export const enhanceScrollView = ScrollViewComponent => {
  return /*#__PURE__*/React.forwardRef((props, ref) => {
    if (SHOULD_ENHANCE) {
      return /*#__PURE__*/React.createElement(ScrollViewEnhancerView, {
        style: props.style,
        horizontal: props.horizontal,
        maintainVisibleContentPosition: getMaintainVisibleContentPosition(props.maintainVisibleContentPosition)
      }, /*#__PURE__*/React.createElement(ScrollViewComponent, _extends({
        ref: ref
      }, props)));
    } else {
      return /*#__PURE__*/React.createElement(ScrollViewComponent, _extends({
        ref: ref
      }, props));
    }
  });
};
export const enhanceScrollViewWithBidirectional = ScrollViewComponent => {
  return /*#__PURE__*/React.forwardRef((props, ref) => {
    const {
      renderScrollView
    } = useBiDirectional(ScrollViewComponent, props, ref);
    if (SHOULD_ENHANCE) {
      return /*#__PURE__*/React.createElement(ScrollViewEnhancerView, {
        style: props.style,
        horizontal: props.horizontal,
        maintainVisibleContentPosition: getMaintainVisibleContentPosition(props.maintainVisibleContentPosition)
      }, renderScrollView());
    } else {
      return renderScrollView();
    }
  });
};
//# sourceMappingURL=enhanceScrollView.js.map