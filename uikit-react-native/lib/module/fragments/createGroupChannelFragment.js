import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { useGroupChannelMessages } from '@sendbird/uikit-chat-hooks';
import { NOOP, PASS, messageComparator, useFreshCallback, useRefTracker } from '@sendbird/uikit-utils';
import MessageRenderer from '../components/MessageRenderer';
import NewMessagesButton from '../components/NewMessagesButton';
import ScrollToBottomButton from '../components/ScrollToBottomButton';
import StatusComposition from '../components/StatusComposition';
import { MESSAGE_FOCUS_ANIMATION_DELAY, MESSAGE_SEARCH_SAFE_SCROLL_DELAY } from '../constants';
import createGroupChannelModule from '../domain/groupChannel/module/createGroupChannelModule';
import { useSendbirdChat } from '../hooks/useContext';
import pubsub from '../utils/pubsub';
const createGroupChannelFragment = initModule => {
  const GroupChannelModule = createGroupChannelModule(initModule);
  return _ref => {
    let {
      searchItem,
      renderNewMessagesButton = props => /*#__PURE__*/React.createElement(NewMessagesButton, props),
      renderScrollToBottomButton = props => /*#__PURE__*/React.createElement(ScrollToBottomButton, props),
      renderMessage,
      enableMessageGrouping = true,
      enableTypingIndicator = true,
      onPressHeaderLeft = NOOP,
      onPressHeaderRight = NOOP,
      onPressMediaMessage = NOOP,
      onChannelDeleted = NOOP,
      onBeforeSendUserMessage = PASS,
      onBeforeSendFileMessage = PASS,
      onBeforeUpdateUserMessage = PASS,
      onBeforeUpdateFileMessage = PASS,
      channel,
      keyboardAvoidOffset,
      queryCreator,
      collectionCreator,
      sortComparator = messageComparator,
      flatListProps,
      onPressImageMessage
    } = _ref;
    const {
      sdk,
      currentUser
    } = useSendbirdChat();
    const [internalSearchItem, setInternalSearchItem] = useState(searchItem);
    const navigateFromMessageSearch = useCallback(() => Boolean(searchItem), []);
    const [groupChannelPubSub] = useState(() => pubsub());
    const [scrolledAwayFromBottom, setScrolledAwayFromBottom] = useState(false);
    const scrolledAwayFromBottomRef = useRefTracker(scrolledAwayFromBottom);
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
    } = useGroupChannelMessages(sdk, channel, currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId, {
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
    const MessageComponent = useCallback(withFocusingAnimation(renderMessage ? props => /*#__PURE__*/React.createElement(React.Fragment, null, renderMessage(props)) : MessageRenderer), [renderMessage]);
    const _renderMessage = useFreshCallback(props => {
      return /*#__PURE__*/React.createElement(MessageComponent, props);
    });
    const memoizedFlatListProps = useMemo(() => ({
      ListEmptyComponent: /*#__PURE__*/React.createElement(GroupChannelModule.StatusEmpty, null),
      contentContainerStyle: {
        flexGrow: 1
      },
      ...flatListProps
    }), [flatListProps]);
    const onResetMessageList = useCallback(callback => {
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
    const onPressSendUserMessage = useFreshCallback(async params => {
      const processedParams = await onBeforeSendUserMessage(params);
      const message = await sendUserMessage(processedParams, onPending);
      onSent(message);
    });
    const onPressSendFileMessage = useFreshCallback(async params => {
      const processedParams = await onBeforeSendFileMessage(params);
      const message = await sendFileMessage(processedParams, onPending);
      onSent(message);
    });
    const onPressUpdateUserMessage = useFreshCallback(async (message, params) => {
      const processedParams = await onBeforeUpdateUserMessage(params);
      await updateUserMessage(message.messageId, processedParams);
    });
    const onPressUpdateFileMessage = useFreshCallback(async (message, params) => {
      const processedParams = await onBeforeUpdateFileMessage(params);
      await updateFileMessage(message.messageId, processedParams);
    });
    const onScrolledAwayFromBottom = useFreshCallback(value => {
      if (!value) resetNewMessages();
      setScrolledAwayFromBottom(value);
    });

    /** @deprecated **/
    const onSendFileMessage = useFreshCallback(async file => {
      const processedParams = await onBeforeSendFileMessage({
        file
      });
      const message = await sendFileMessage(processedParams, onPending);
      onSent(message);
    });
    /** @deprecated **/
    const onSendUserMessage = useFreshCallback(async (text, mention) => {
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
    const onUpdateFileMessage = useFreshCallback(async (editedFile, message) => {
      const processedParams = await onBeforeSendFileMessage({
        file: editedFile
      });
      await updateFileMessage(message.messageId, processedParams);
    });
    /** @deprecated **/
    const onUpdateUserMessage = useFreshCallback(async (editedText, message, mention) => {
      const processedParams = await onBeforeSendUserMessage({
        message: editedText,
        mentionedUserIds: mention === null || mention === void 0 ? void 0 : mention.userIds,
        mentionedMessageTemplate: mention === null || mention === void 0 ? void 0 : mention.messageTemplate,
        mentionType: mention === null || mention === void 0 ? void 0 : mention.type
      });
      await updateUserMessage(message.messageId, processedParams);
    });
    return /*#__PURE__*/React.createElement(GroupChannelModule.Provider, {
      channel: channel,
      groupChannelPubSub: groupChannelPubSub,
      enableTypingIndicator: enableTypingIndicator,
      keyboardAvoidOffset: keyboardAvoidOffset
    }, /*#__PURE__*/React.createElement(GroupChannelModule.Header, {
      shouldHideRight: navigateFromMessageSearch,
      onPressHeaderLeft: onPressHeaderLeft,
      onPressHeaderRight: onPressHeaderRight
    }), /*#__PURE__*/React.createElement(StatusComposition, {
      loading: loading,
      LoadingComponent: /*#__PURE__*/React.createElement(GroupChannelModule.StatusLoading, null)
    }, /*#__PURE__*/React.createElement(GroupChannelModule.MessageList, {
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
    }), /*#__PURE__*/React.createElement(GroupChannelModule.Input, {
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
  return /*#__PURE__*/React.memo(props => {
    const translateY = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      if (props.focused) {
        setTimeout(() => {
          Animated.sequence([{
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
          }].map(value => Animated.timing(translateY, {
            ...value,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease)
          }))).start();
        }, MESSAGE_SEARCH_SAFE_SCROLL_DELAY + MESSAGE_FOCUS_ANIMATION_DELAY);
      }
    }, [props.focused]);
    return /*#__PURE__*/React.createElement(Animated.View, {
      style: {
        transform: [{
          translateY
        }]
      }
    }, /*#__PURE__*/React.createElement(Component, props));
  });
}
export default createGroupChannelFragment;
//# sourceMappingURL=createGroupChannelFragment.js.map