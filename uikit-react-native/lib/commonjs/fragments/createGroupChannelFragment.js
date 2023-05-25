"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _uikitChatHooks = require("@sendbird/uikit-chat-hooks");
var _uikitUtils = require("@sendbird/uikit-utils");
var _MessageRenderer = _interopRequireDefault(require("../components/MessageRenderer"));
var _NewMessagesButton = _interopRequireDefault(require("../components/NewMessagesButton"));
var _ScrollToBottomButton = _interopRequireDefault(require("../components/ScrollToBottomButton"));
var _StatusComposition = _interopRequireDefault(require("../components/StatusComposition"));
var _constants = require("../constants");
var _createGroupChannelModule = _interopRequireDefault(require("../domain/groupChannel/module/createGroupChannelModule"));
var _useContext = require("../hooks/useContext");
var _pubsub = _interopRequireDefault(require("../utils/pubsub"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const createGroupChannelFragment = initModule => {
  const GroupChannelModule = (0, _createGroupChannelModule.default)(initModule);
  return _ref => {
    let {
      searchItem,
      renderNewMessagesButton = props => /*#__PURE__*/_react.default.createElement(_NewMessagesButton.default, props),
      renderScrollToBottomButton = props => /*#__PURE__*/_react.default.createElement(_ScrollToBottomButton.default, props),
      renderMessage,
      enableMessageGrouping = true,
      enableTypingIndicator = true,
      onPressHeaderLeft = _uikitUtils.NOOP,
      onPressHeaderRight = _uikitUtils.NOOP,
      onPressMediaMessage = _uikitUtils.NOOP,
      onChannelDeleted = _uikitUtils.NOOP,
      onBeforeSendUserMessage = _uikitUtils.PASS,
      onBeforeSendFileMessage = _uikitUtils.PASS,
      onBeforeUpdateUserMessage = _uikitUtils.PASS,
      onBeforeUpdateFileMessage = _uikitUtils.PASS,
      channel,
      keyboardAvoidOffset,
      queryCreator,
      collectionCreator,
      sortComparator = _uikitUtils.messageComparator,
      flatListProps,
      onPressImageMessage
    } = _ref;
    const {
      sdk,
      currentUser
    } = (0, _useContext.useSendbirdChat)();
    const [internalSearchItem, setInternalSearchItem] = (0, _react.useState)(searchItem);
    const navigateFromMessageSearch = (0, _react.useCallback)(() => Boolean(searchItem), []);
    const [groupChannelPubSub] = (0, _react.useState)(() => (0, _pubsub.default)());
    const [scrolledAwayFromBottom, setScrolledAwayFromBottom] = (0, _react.useState)(false);
    const scrolledAwayFromBottomRef = (0, _uikitUtils.useRefTracker)(scrolledAwayFromBottom);
    const {
      loading,
      messages,
      newMessages,
      resetNewMessages,
      next,
      prev,
      hasNext,
      sendFileMessage,
      sendUserMessage,
      updateFileMessage,
      updateUserMessage,
      resendMessage,
      deleteMessage,
      resetWithStartingPoint
    } = (0, _uikitChatHooks.useGroupChannelMessages)(sdk, channel, currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId, {
      collectionCreator,
      queryCreator,
      sortComparator,
      onChannelDeleted,
      enableCollectionWithoutLocalCache: !queryCreator,
      shouldCountNewMessages: () => scrolledAwayFromBottomRef.current,
      onMessagesReceived(messages) {
        groupChannelPubSub.publish({
          type: 'MESSAGES_RECEIVED',
          data: {
            messages
          }
        });
      },
      startingPoint: internalSearchItem === null || internalSearchItem === void 0 ? void 0 : internalSearchItem.startingPoint
    });
    const MessageComponent = (0, _react.useCallback)(withFocusingAnimation(renderMessage ? props => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderMessage(props)) : _MessageRenderer.default), [renderMessage]);
    const _renderMessage = (0, _uikitUtils.useFreshCallback)(props => {
      return /*#__PURE__*/_react.default.createElement(MessageComponent, props);
    });
    const memoizedFlatListProps = (0, _react.useMemo)(() => ({
      ListEmptyComponent: /*#__PURE__*/_react.default.createElement(GroupChannelModule.StatusEmpty, null),
      contentContainerStyle: {
        flexGrow: 1
      },
      ...flatListProps
    }), [flatListProps]);
    const onResetMessageList = (0, _react.useCallback)(callback => {
      resetWithStartingPoint(Number.MAX_SAFE_INTEGER, callback);
      setInternalSearchItem(undefined);
    }, []);
    const onPending = message => {
      groupChannelPubSub.publish({
        type: 'MESSAGE_SENT_PENDING',
        data: {
          message
        }
      });
    };
    const onSent = message => {
      groupChannelPubSub.publish({
        type: 'MESSAGE_SENT_SUCCESS',
        data: {
          message
        }
      });
    };
    const onPressSendUserMessage = (0, _uikitUtils.useFreshCallback)(async params => {
      const processedParams = await onBeforeSendUserMessage(params);
      const message = await sendUserMessage(processedParams, onPending);
      onSent(message);
    });
    const onPressSendFileMessage = (0, _uikitUtils.useFreshCallback)(async params => {
      const processedParams = await onBeforeSendFileMessage(params);
      const message = await sendFileMessage(processedParams, onPending);
      onSent(message);
    });
    const onPressUpdateUserMessage = (0, _uikitUtils.useFreshCallback)(async (message, params) => {
      const processedParams = await onBeforeUpdateUserMessage(params);
      await updateUserMessage(message.messageId, processedParams);
    });
    const onPressUpdateFileMessage = (0, _uikitUtils.useFreshCallback)(async (message, params) => {
      const processedParams = await onBeforeUpdateFileMessage(params);
      await updateFileMessage(message.messageId, processedParams);
    });
    const onScrolledAwayFromBottom = (0, _uikitUtils.useFreshCallback)(value => {
      if (!value) resetNewMessages();
      setScrolledAwayFromBottom(value);
    });

    /** @deprecated **/
    const onSendFileMessage = (0, _uikitUtils.useFreshCallback)(async file => {
      const processedParams = await onBeforeSendFileMessage({
        file
      });
      const message = await sendFileMessage(processedParams, onPending);
      onSent(message);
    });
    /** @deprecated **/
    const onSendUserMessage = (0, _uikitUtils.useFreshCallback)(async (text, mention) => {
      const processedParams = await onBeforeSendUserMessage({
        message: text,
        mentionedUserIds: mention === null || mention === void 0 ? void 0 : mention.userIds,
        mentionedMessageTemplate: mention === null || mention === void 0 ? void 0 : mention.messageTemplate,
        mentionType: mention === null || mention === void 0 ? void 0 : mention.type
      });
      const message = await sendUserMessage(processedParams, onPending);
      onSent(message);
    });
    /** @deprecated **/
    const onUpdateFileMessage = (0, _uikitUtils.useFreshCallback)(async (editedFile, message) => {
      const processedParams = await onBeforeSendFileMessage({
        file: editedFile
      });
      await updateFileMessage(message.messageId, processedParams);
    });
    /** @deprecated **/
    const onUpdateUserMessage = (0, _uikitUtils.useFreshCallback)(async (editedText, message, mention) => {
      const processedParams = await onBeforeSendUserMessage({
        message: editedText,
        mentionedUserIds: mention === null || mention === void 0 ? void 0 : mention.userIds,
        mentionedMessageTemplate: mention === null || mention === void 0 ? void 0 : mention.messageTemplate,
        mentionType: mention === null || mention === void 0 ? void 0 : mention.type
      });
      await updateUserMessage(message.messageId, processedParams);
    });
    return /*#__PURE__*/_react.default.createElement(GroupChannelModule.Provider, {
      channel: channel,
      groupChannelPubSub: groupChannelPubSub,
      enableTypingIndicator: enableTypingIndicator,
      keyboardAvoidOffset: keyboardAvoidOffset
    }, /*#__PURE__*/_react.default.createElement(GroupChannelModule.Header, {
      shouldHideRight: navigateFromMessageSearch,
      onPressHeaderLeft: onPressHeaderLeft,
      onPressHeaderRight: onPressHeaderRight
    }), /*#__PURE__*/_react.default.createElement(_StatusComposition.default, {
      loading: loading,
      LoadingComponent: /*#__PURE__*/_react.default.createElement(GroupChannelModule.StatusLoading, null)
    }, /*#__PURE__*/_react.default.createElement(GroupChannelModule.MessageList, {
      channel: channel,
      searchItem: internalSearchItem,
      onResetMessageList: onResetMessageList,
      enableMessageGrouping: enableMessageGrouping,
      currentUserId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId,
      renderMessage: _renderMessage,
      messages: messages,
      newMessages: newMessages,
      onTopReached: prev,
      onBottomReached: next,
      hasNext: hasNext,
      scrolledAwayFromBottom: scrolledAwayFromBottom,
      onScrolledAwayFromBottom: onScrolledAwayFromBottom,
      renderNewMessagesButton: renderNewMessagesButton,
      renderScrollToBottomButton: renderScrollToBottomButton,
      onResendFailedMessage: resendMessage,
      onDeleteMessage: deleteMessage,
      onPressMediaMessage: onPressMediaMessage,
      flatListProps: memoizedFlatListProps,
      nextMessages: newMessages,
      newMessagesFromMembers: newMessages,
      onPressImageMessage: onPressImageMessage
    }), /*#__PURE__*/_react.default.createElement(GroupChannelModule.Input, {
      SuggestedMentionList: GroupChannelModule.SuggestedMentionList,
      shouldRenderInput: shouldRenderInput(channel),
      onPressSendUserMessage: onPressSendUserMessage,
      onPressSendFileMessage: onPressSendFileMessage,
      onPressUpdateUserMessage: onPressUpdateUserMessage,
      onPressUpdateFileMessage: onPressUpdateFileMessage,
      onSendFileMessage: onSendFileMessage,
      onSendUserMessage: onSendUserMessage,
      onUpdateFileMessage: onUpdateFileMessage,
      onUpdateUserMessage: onUpdateUserMessage
    })));
  };
};
function shouldRenderInput(channel) {
  if (channel.isBroadcast) {
    return channel.myRole === 'operator';
  }
  return true;
}
function withFocusingAnimation(Component) {
  return /*#__PURE__*/_react.default.memo(props => {
    const translateY = (0, _react.useRef)(new _reactNative.Animated.Value(0)).current;
    (0, _react.useEffect)(() => {
      if (props.focused) {
        setTimeout(() => {
          _reactNative.Animated.sequence([{
            toValue: -10,
            duration: 500
          }, {
            toValue: 0,
            duration: 100
          }, {
            toValue: -10,
            duration: 200
          }, {
            toValue: 0,
            duration: 100
          }].map(value => _reactNative.Animated.timing(translateY, {
            ...value,
            useNativeDriver: true,
            easing: _reactNative.Easing.inOut(_reactNative.Easing.ease)
          }))).start();
        }, _constants.MESSAGE_SEARCH_SAFE_SCROLL_DELAY + _constants.MESSAGE_FOCUS_ANIMATION_DELAY);
      }
    }, [props.focused]);
    return /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
      style: {
        transform: [{
          translateY
        }]
      }
    }, /*#__PURE__*/_react.default.createElement(Component, props));
  });
}
var _default = createGroupChannelFragment;
exports.default = _default;
//# sourceMappingURL=createGroupChannelFragment.js.map