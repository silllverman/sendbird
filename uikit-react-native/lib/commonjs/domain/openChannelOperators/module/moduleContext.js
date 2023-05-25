"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenChannelOperatorsContextsProvider = exports.OpenChannelOperatorsContexts = void 0;
var _react = _interopRequireWildcard(require("react"));
var _ProviderLayout = _interopRequireDefault(require("../../../components/ProviderLayout"));
var _useContext = require("../../../hooks/useContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const OpenChannelOperatorsContexts = {
  Fragment: /*#__PURE__*/(0, _react.createContext)({
    headerTitle: '',
    channel: {}
  })
};
exports.OpenChannelOperatorsContexts = OpenChannelOperatorsContexts;
const OpenChannelOperatorsContextsProvider = _ref => {
  let {
    children,
    channel
  } = _ref;
  const {
    STRINGS
  } = (0, _useContext.useLocalization)();
  return /*#__PURE__*/_react.default.createElement(_ProviderLayout.default, null, /*#__PURE__*/_react.default.createElement(OpenChannelOperatorsContexts.Fragment.Provider, {
    value: {
      headerTitle: STRINGS.OPEN_CHANNEL_OPERATORS.HEADER_TITLE,
      channel
    }
  }, children));
};
exports.OpenChannelOperatorsContextsProvider = OpenChannelOperatorsContextsProvider;
//# sourceMappingURL=moduleContext.js.map