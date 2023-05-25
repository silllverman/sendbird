"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _uikitUtils = require("@sendbird/uikit-utils");
var _ChannelInput = _interopRequireDefault(require("../../../components/ChannelInput"));
var _moduleContext = require("../module/moduleContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GroupChannelInput = props => {
  const {
    channel,
    messageToEdit,
    setMessageToEdit,
    keyboardAvoidOffset = 0
  } = (0, _react.useContext)(_moduleContext.GroupChannelContexts.Fragment);
  const chatAvailableState = (0, _uikitUtils.getGroupChannelChatAvailableState)(channel);
  return /*#__PURE__*/_react.default.createElement(_ChannelInput.default, {
    channel: channel,
    messageToEdit: messageToEdit,
    setMessageToEdit: setMessageToEdit,
    inputMuted: chatAvailableState.muted,
    inputFrozen: chatAvailableState.frozen,
    inputDisabled: chatAvailableState.disabled,
    keyboardAvoidOffset: keyboardAvoidOffset,
    shouldRenderInput: props.shouldRenderInput,
    onPressSendUserMessage: props.onPressSendUserMessage,
    onPressSendFileMessage: props.onPressSendFileMessage,
    onPressUpdateUserMessage: props.onPressUpdateUserMessage,
    onPressUpdateFileMessage: props.onPressUpdateFileMessage,
    SuggestedMentionList: props.SuggestedMentionList,
    onSendFileMessage: props.onSendFileMessage,
    onSendUserMessage: props.onSendUserMessage,
    onUpdateFileMessage: props.onUpdateFileMessage,
    onUpdateUserMessage: props.onUpdateUserMessage
  });
};
var _default = /*#__PURE__*/_react.default.memo(GroupChannelInput);
exports.default = _default;
//# sourceMappingURL=GroupChannelInput.js.map