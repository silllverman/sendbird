"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollView = exports.FlatList = void 0;
Object.defineProperty(exports, "ScrollViewEnhancerView", {
  enumerable: true,
  get: function () {
    return _native.ScrollViewEnhancerView;
  }
});
exports.SectionList = void 0;
Object.defineProperty(exports, "enhanceScrollView", {
  enumerable: true,
  get: function () {
    return _enhanceScrollView.enhanceScrollView;
  }
});
Object.defineProperty(exports, "enhanceScrollViewWithBidirectional", {
  enumerable: true,
  get: function () {
    return _enhanceScrollView.enhanceScrollViewWithBidirectional;
  }
});
Object.defineProperty(exports, "useBiDirectional", {
  enumerable: true,
  get: function () {
    return _useBiDirectional.useBiDirectional;
  }
});
var _reactNative = require("react-native");
var _enhanceScrollView = require("./enhanceScrollView");
var _useBiDirectional = require("./useBiDirectional");
var _native = require("./native");
const ScrollView = (0, _enhanceScrollView.enhanceScrollViewWithBidirectional)(_reactNative.ScrollView);
exports.ScrollView = ScrollView;
const FlatList = (0, _enhanceScrollView.enhanceScrollViewWithBidirectional)(_reactNative.FlatList);
exports.FlatList = FlatList;
const SectionList = (0, _enhanceScrollView.enhanceScrollViewWithBidirectional)(_reactNative.SectionList);
exports.SectionList = SectionList;
//# sourceMappingURL=index.js.map