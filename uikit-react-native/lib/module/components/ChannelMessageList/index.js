function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChannelFrozenBanner, createStyleSheet, useAlert, useBottomSheet, useToast, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { Logger, getAvailableUriFromFileMessage, getFileExtension, getFileType, isMyMessage, messageKeyExtractor, shouldRenderReaction, toMegabyte, useFreshCallback } from '@sendbird/uikit-utils';
import { DEPRECATION_WARNING } from '../../constants';
import { useLocalization, usePlatformService, useSendbirdChat } from '../../hooks/useContext';
import SBUUtils from '../../libs/SBUUtils';
import ChatFlatList from '../ChatFlatList';
import { ReactionAddons } from '../ReactionAddons';
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
  } = useLocalization();
  const {
    colors
  } = useUIKitTheme();
  const {
    left,
    right
  } = useSafeAreaInsets();
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
  const renderItem = useFreshCallback(_ref2 => {
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
  return /*#__PURE__*/React.createElement(View, {
    style: [{
      flex: 1,
      backgroundColor: colors.background
    }, safeAreaLayout]
  }, channel.isFrozen && /*#__PURE__*/React.createElement(ChannelFrozenBanner, {
    style: styles.frozenBanner,
    text: STRINGS.LABELS.CHANNEL_MESSAGE_LIST_FROZEN
  }), /*#__PURE__*/React.createElement(ChatFlatList, _extends({}, flatListProps, {
    onTopReached: onTopReached,
    onBottomReached: onBottomReached,
    onScrolledAwayFromBottom: onScrolledAwayFromBottom,
    ref: ref,
    data: messages,
    renderItem: renderItem,
    keyExtractor: messageKeyExtractor,
    contentContainerStyle: [
    // { minHeight: '100%', justifyContent: 'flex-end' },
    channel.isFrozen && styles.frozenListPadding, flatListProps === null || flatListProps === void 0 ? void 0 : flatListProps.contentContainerStyle]
  })), renderNewMessagesButton && /*#__PURE__*/React.createElement(View, {
    style: [styles.newMsgButton, safeAreaLayout]
  }, renderNewMessagesButton({
    visible: newMessages.length > 0 && (hasNext() || scrolledAwayFromBottom),
    onPress: () => onPressNewMessagesButton(),
    newMessages
  })), renderScrollToBottomButton && /*#__PURE__*/React.createElement(View, {
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
  } = useUIKitTheme();
  const {
    STRINGS
  } = useLocalization();
  const toast = useToast();
  const {
    openSheet
  } = useBottomSheet();
  const {
    alert
  } = useAlert();
  const {
    clipboardService,
    fileService
  } = usePlatformService();
  const {
    features
  } = useSendbirdChat();
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
      if (isMyMessage(msg, currentUserId) && msg.sendingStatus === 'succeeded') {
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
          if (toMegabyte(msg.size) > 4) {
            toast.show(STRINGS.TOAST.DOWNLOAD_START, 'success');
          }
          fileService.save({
            fileUrl: msg.url,
            fileName: msg.name,
            fileType: msg.type
          }).then(response => {
            toast.show(STRINGS.TOAST.DOWNLOAD_OK, 'success');
            Logger.log('File saved to', response);
          }).catch(err => {
            toast.show(STRINGS.TOAST.DOWNLOAD_ERROR, 'error');
            Logger.log('File save failure', err);
          });
        }
      });
      if (isMyMessage(msg, currentUserId) && msg.sendingStatus === 'succeeded') {
        sheetItems.push({
          icon: 'delete',
          title: STRINGS.LABELS.CHANNEL_MESSAGE_DELETE,
          onPress: () => confirmDelete(msg)
        });
      }
      const fileType = getFileType(msg.type || getFileExtension(msg.name));
      switch (fileType) {
        case 'image':
        case 'video':
        case 'audio':
          {
            response.onPress = () => {
              if (onPressImageMessage && fileType === 'image') {
                Logger.warn(DEPRECATION_WARNING.CHANNEL.ON_PRESS_IMAGE_MESSAGE);
                onPressImageMessage(msg, getAvailableUriFromFileMessage(msg));
              }
              onPressMediaMessage === null || onPressMediaMessage === void 0 ? void 0 : onPressMediaMessage(msg, () => onDeleteMessage(msg), getAvailableUriFromFileMessage(msg));
            };
            break;
          }
        default:
          {
            response.onPress = () => SBUUtils.openURL(msg.url);
            break;
          }
      }
    }
    if (sheetItems.length > 0) {
      response.onLongPress = () => {
        openSheet({
          sheetItems,
          HeaderComponent: shouldRenderReaction(channel, features.reactionEnabled) ? _ref4 => {
            let {
              onClose
            } = _ref4;
            return /*#__PURE__*/React.createElement(ReactionAddons.BottomSheet, {
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
const styles = createStyleSheet({
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
export default /*#__PURE__*/React.forwardRef(ChannelMessageList);
//# sourceMappingURL=index.js.map