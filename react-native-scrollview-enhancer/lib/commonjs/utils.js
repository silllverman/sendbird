"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRNVersion = getRNVersion;
exports.warningOnHorizontalScroll = warningOnHorizontalScroll;
var _reactNative = require("react-native");
const pkgVersion = require('react-native/package.json').version;
const [major, minor, patch] = pkgVersion.split('.').map(it => Number(it));
const parsedVersion = {
  major,
  minor,
  patch
};
let _warningCalled = false;
function warningOnHorizontalScroll(props) {
  if (props.horizontal && _reactNative.Platform.OS === 'android' && !_warningCalled) {
    _warningCalled = true;
    console.warn('ScrollViewEnhancerView does not support horizontal direction');
  }
}
function getRNVersion() {
  return parsedVersion;
}
//# sourceMappingURL=utils.js.map