"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
var _uikitReactNativeFoundation = require("@sendbird/uikit-react-native-foundation");
var _uikitUtils = require("@sendbird/uikit-utils");
var _constants = require("../../constants");
var _useContext = require("../../hooks/useContext");
var _SBUUtils = _interopRequireDefault(require("../../libs/SBUUtils"));
var _ChatFlatList = _interopRequireDefault(require("../ChatFlatList"));
var _ReactionAddons = require("../ReactionAddons");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ChannelMessageList = (_ref, ref) => {
  let {
    searchItem,
    hasNext,
    channel,
    onEditMessage,
    onDeleteMessage,
    onResendFailedMessage,
    onPressMediaMessage,
    currentUserId,
    renderNewMessagesButton,
    renderScrollToBottomButton,
    renderMessage,
    messages,
    newMessages,
    enableMessageGrouping,
    onScrolledAwayFromBottom,
    scrolledAwayFromBottom,
    onBottomReached,
    onTopReached,
    flatListProps,
    onPressNewMessagesButton,
    onPressScrollToBottomButton,
    onPressImageMessage
  } = _ref;
  const {
    STRINGS
  } = (0, _useContext.useLocalization)();
  const {
    colors
  } = (0, _uikitReactNativeFoundation.useUIKitTheme)();
  const {
    left,
    right
  } = (0, _reactNativeSafeAreaContext.useSafeAreaInsets)();
  const getMessagePressActions = useGetMessagePressActions({
    channel,
    currentUserId,
    onEditMessage,
    onDeleteMessage,
    onResendFailedMessage,
    onPressImageMessage,
    onPressMediaMessage
  });
  const safeAreaLayout = {
    paddingLeft: left,
    paddingRight: right
  };
  const renderItem = (0, _uikitUtils.useFreshCallback)(_ref2 => {
    let {
      item,
      index
    } = _ref2;
    const {
      onPress,
      onLongPress
    } = getMessagePressActions(item);
    return renderMessage({
      message: item,
      prevMessage: messages[index + 1],
      nextMessage: messages[index - 1],
      onPress,
      onLongPress,
      enableMessageGrouping,
      channel,
      currentUserId,
      focused: ((searchItem === null || searchItem === void 0 ? void 0 : searchItem.startingPoint) ?? -1) === item.createdAt
    });
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [{
      flex: 1,
      backgroundColor: colors.background
    }, safeAreaLayout]
  }, channel.isFrozen && /*#__PURE__*/_react.default.createElement(_uikitReactNativeFoundation.ChannelFrozenBanner, {
    style: styles.frozenBanner,
    text: STRINGS.LABELS.CHANNEL_MESSAGE_LIST_FROZEN
  }), /*#__PURE__*/_react.default.createElement(_ChatFlatList.default, _extends({}, flatListProps, {
    onTopReached: onTopReached,
    onBottomReached: onBottomReached,
    onScrolledAwayFromBottom: onScrolledAwayFromBottom,
    ref: ref,
    data: messages,
    renderItem: renderItem,
    keyExtractor: _uikitUtils.messageKeyExtractor,
    contentContainerStyle: [
    // { minHeight: '100%', justifyContent: 'flex-end' },
    channel.isFrozen && styles.frozenListPadding, flatListProps === null || flatListProps === void 0 ? void 0 : flatListProps.contentContainerStyle]
  })), renderNewMessagesButton && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.newMsgButton, safeAreaLayout]
  }, renderNewMessagesButton({
    visible: newMessages.length > 0 && (hasNext() || scrolledAwayFromBottom),
    onPress: () => onPressNewMessagesButton(),
    newMessages
  })), renderScrollToBottomButton && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.scrollButton, safeAreaLayout]
  }, renderScrollToBottomButton({
    visible: hasNext() || scrolledAwayFromBottom,
    onPress: () => onPressScrollToBottomButton()
  })));
};
const useGetMessagePressActions = _ref3 => {
  let {
    channel,
    currentUserId,
    onResendFailedMessage,
    onEditMessage,
    onDeleteMessage,
    onPressImageMessage,
    onPressMediaMessage
  } = _ref3;
  const {
    colors
  } = (0, _uikitReactNativeFoundation.useUIKitTheme)();
  const {
    STRINGS
  } = (0, _useContext.useLocalization)();
  const toast = (0, _uikitReactNativeFoundation.useToast)();
  const {
    openSheet
  } = (0, _uikitReactNativeFoundation.useBottomSheet)();
  const {
    alert
  } = (0, _uikitReactNativeFoundation.useAlert)();
  const {
    clipboardService,
    fileService
  } = (0, _useContext.usePlatformService)();
  const {
    features
  } = (0, _useContext.useSendbirdChat)();
  const handleFailedMessage = message => {
    openSheet({
      sheetItems: [{
        title: STRINGS.LABELS.CHANNEL_MESSAGE_FAILED_RETRY,
        onPress: () => {
          onResendFailedMessage(message).catch(() => toast.show(STRINGS.TOAST.RESEND_MSG_ERROR, 'error'));
        }
      }, {
        title: STRINGS.LABELS.CHANNEL_MESSAGE_FAILED_REMOVE,
        titleColor: colors.ui.dialog.default.none.destructive,
        onPress: () => confirmDelete(message)
      }]
    });
  };
  const confirmDelete = message => {
    alert({
      title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE,
      buttons: [{
        text: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL
      }, {
        text: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_OK,
        style: 'destructive',
        onPress: () => {
          onDeleteMessage(message).catch(() => toast.show(STRINGS.TOAST.DELETE_MSG_ERROR, 'error'));
        }
      }]
    });
  };
  return msg => {
    if (!msg.isUserMessage() && !msg.isFileMessage()) {
      return {
        onPress: undefined,
        onLongPress: undefined
      };
    }
    const sheetItems = [];
    const response = {
      onPress: undefined,
      onLongPress: undefined
    };
    if (msg.isUserMessage()) {
      sheetItems.push({
        icon: 'copy',
        title: STRINGS.LABELS.CHANNEL_MESSAGE_COPY,
        onPress: () => {
          clipboardService.setString(msg.message || '');
          toast.show(STRINGS.TOAST.COPY_OK, 'success');
        }
      });
      if ((0, _uikitUtils.isMyMessage)(msg, currentUserId) && msg.sendingStatus === 'succeeded') {
        sheetItems.push({
          icon: 'edit',
          title: STRINGS.LABELS.CHANNEL_MESSAGE_EDIT,
          onPress: () => onEditMessage(msg)
        }, {
          icon: 'delete',
          title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE,
          onPress: () => confirmDelete(msg)
        });
      }
    }
    if (msg.isFileMessage()) {
      sheetItems.push({
        icon: 'download',
        title: STRINGS.LABELS.CHANNEL_MESSAGE_SAVE,
        onPress: async () => {
          if ((0, _uikitUtils.toMegabyte)(msg.size) > 4) {
            toast.show(STRINGS.TOAST.DOWNLOAD_START, 'success');
          }
          fileService.save({
            fileUrl: msg.url,
            fileName: msg.name,
            fileType: msg.type
          }).then(response => {
            toast.show(STRINGS.TOAST.DOWNLOAD_OK, 'success');
            _uikitUtils.Logger.log('File saved to', response);
          }).catch(err => {
            toast.show(STRINGS.TOAST.DOWNLOAD_ERROR, 'error');
            _uikitUtils.Logger.log('File save failure', err);
          });
        }
      });
      if ((0, _uikitUtils.isMyMessage)(msg, currentUserId) && msg.sendingStatus === 'succeeded') {
        sheetItems.push({
          icon: 'delete',
          title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE,
          onPress: () => confirmDelete(msg)
        });
      }
      const fileType = (0, _uikitUtils.getFileType)(msg.type || (0, _uikitUtils.getFileExtension)(msg.name));
      switch (fileType) {
        case 'image':
        case 'video':
        case 'audio':
          {
            response.onPress = () => {
              if (onPressImageMessage && fileType === 'image') {
                _uikitUtils.Logger.warn(_constants.DEPRECATION_WARNING.CHANNEL.ON_PRESS_IMAGE_MESSAGE);
                onPressImageMessage(msg, (0, _uikitUtils.getAvailableUriFromFileMessage)(msg));
              }
              onPressMediaMessage === null || onPressMediaMessage === void 0 ? void 0 : onPressMediaMessage(msg, () => onDeleteMessage(msg), (0, _uikitUtils.getAvailableUriFromFileMessage)(msg));
            };
            break;
          }
        default:
          {
            response.onPress = () => _SBUUtils.default.openURL(msg.url);
            break;
          }
      }
    }
    if (sheetItems.length > 0) {
      response.onLongPress = () => {
        openSheet({
          sheetItems,
          HeaderComponent: (0, _uikitUtils.shouldRenderReaction)(channel, features.reactionEnabled) ? _ref4 => {
            let {
              onClose
            } = _ref4;
            return /*#__PURE__*/_react.default.createElement(_ReactionAddons.ReactionAddons.BottomSheet, {
              message: msg,
              channel: channel,
              onClose: onClose
            });
          } : undefined
        });
      };
    }
    if (msg.sendingStatus === 'failed') {
      response.onLongPress = () => handleFailedMessage(msg);
      response.onPress = () => {
        onResendFailedMessage(msg).catch(() => toast.show(STRINGS.TOAST.RESEND_MSG_ERROR, 'error'));
      };
    }
    if (msg.sendingStatus === 'pending') {
      response.onLongPress = undefined;
      response.onPress = undefined;
    }
    return response;
  };
};
const styles = (0, _uikitReactNativeFoundation.createStyleSheet)({
  frozenBanner: {
    position: 'absolute',
    zIndex: 999,
    top: 8,
    left: 8,
    right: 8
  },
  frozenListPadding: {
    paddingBottom: 32
  },
  newMsgButton: {
    position: 'absolute',
    zIndex: 999,
    bottom: 10,
    alignSelf: 'center'
  },
  scrollButton: {
    position: 'absolute',
    zIndex: 998,
    bottom: 10,
    right: 16
  }
});

// NOTE: Due to Generic inference is not working on forwardRef, we need to cast it as typeof ChannelMessageList and implicit `ref` prop
var _default = /*#__PURE__*/_react.default.forwardRef(ChannelMessageList);
exports.default = _default;
//# sourceMappingURL=index.js.map