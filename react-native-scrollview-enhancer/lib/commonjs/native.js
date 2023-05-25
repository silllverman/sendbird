"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollViewEnhancerView = exports.NativeView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LINKING_ERROR = `The package 'react-native-scrollview-enhancer' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const ComponentName = 'ScrollViewEnhancerView';
const NativeView = (() => {
  if (_reactNative.Platform.OS === 'android') {
    return _reactNative.UIManager.getViewManagerConfig(ComponentName) != null ? (0, _reactNative.requireNativeComponent)(ComponentName) : () => {
      throw new Error(LINKING_ERROR);
    };
  } else {
    return _reactNative.View;
  }
})();
exports.NativeView = NativeView;
const ScrollViewEnhancerView = props => {
  if (__DEV__ && _reactNative.Platform.OS === 'android') (0, _utils.warningOnHorizontalScroll)(props);
  return /*#__PURE__*/_react.default.createElement(NativeView, props);
};
exports.ScrollViewEnhancerView = ScrollViewEnhancerView;
//# sourceMappingURL=native.js.map