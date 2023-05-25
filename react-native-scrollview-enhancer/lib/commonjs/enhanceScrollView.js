"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enhanceScrollViewWithBidirectional = exports.enhanceScrollView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _native = require("./native");
var _utils = require("./utils");
var _useBiDirectional = require("./useBiDirectional");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const {
  minor
} = (0, _utils.getRNVersion)();
const SHOULD_ENHANCE = _reactNative.Platform.OS === 'android' && minor < 72;
const DEFAULT_PREVENT_AUTO_SCROLL_THRESHOLD = -(_reactNative.Dimensions.get('window').height * 2);
const getMaintainVisibleContentPosition = option => {
  return {
    autoscrollToTopThreshold: (option === null || option === void 0 ? void 0 : option.autoscrollToTopThreshold) ?? DEFAULT_PREVENT_AUTO_SCROLL_THRESHOLD,
    minIndexForVisible: (option === null || option === void 0 ? void 0 : option.minIndexForVisible) ?? 0
  };
};
const enhanceScrollView = ScrollViewComponent => {
  return /*#__PURE__*/_react.default.forwardRef((props, ref) => {
    if (SHOULD_ENHANCE) {
      return /*#__PURE__*/_react.default.createElement(_native.ScrollViewEnhancerView, {
        style: props.style,
        horizontal: props.horizontal,
        maintainVisibleContentPosition: getMaintainVisibleContentPosition(props.maintainVisibleContentPosition)
      }, /*#__PURE__*/_react.default.createElement(ScrollViewComponent, _extends({
        ref: ref
      }, props)));
    } else {
      return /*#__PURE__*/_react.default.createElement(ScrollViewComponent, _extends({
        ref: ref
      }, props));
    }
  });
};
exports.enhanceScrollView = enhanceScrollView;
const enhanceScrollViewWithBidirectional = ScrollViewComponent => {
  return /*#__PURE__*/_react.default.forwardRef((props, ref) => {
    const {
      renderScrollView
    } = (0, _useBiDirectional.useBiDirectional)(ScrollViewComponent, props, ref);
    if (SHOULD_ENHANCE) {
      return /*#__PURE__*/_react.default.createElement(_native.ScrollViewEnhancerView, {
        style: props.style,
        horizontal: props.horizontal,
        maintainVisibleContentPosition: getMaintainVisibleContentPosition(props.maintainVisibleContentPosition)
      }, renderScrollView());
    } else {
      return renderScrollView();
    }
  });
};
exports.enhanceScrollViewWithBidirectional = enhanceScrollViewWithBidirectional;
//# sourceMappingURL=enhanceScrollView.js.map