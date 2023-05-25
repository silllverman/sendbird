import { useRef } from 'react';
import { ASYNC_NOOP, Logger, confirmAndMarkAsRead, isDifferentChannel, isMyMessage, useAsyncEffect, useForceUpdate, useFreshCallback, useUniqHandlerId } from '@sendbird/uikit-utils';
import { useChannelHandler } from '../../handler/useChannelHandler';
import { useChannelMessagesReducer } from '../useChannelMessagesReducer';
const createMessageQuery = (channel, creator) => {
  if (creator) return creator();
  return channel.createPreviousMessageListQuery({
    limit: 100,
    reverse: true
  });
};
export const useGroupChannelMessagesWithQuery = (sdk, channel, userId, options) => {
  const queryRef = useRef();
  const handlerId = useUniqHandlerId('useGroupChannelMessagesWithQuery');
  const forceUpdate = useForceUpdate();
  const {
    loading,
    refreshing,
    messages,
    newMessages,
    updateMessages,
    deleteMessages,
    updateNewMessages,
    deleteNewMessages,
    updateLoading,
    updateRefreshing
  } = useChannelMessagesReducer(options === null || options === void 0 ? void 0 : options.sortComparator);
  const channelMarkAsRead = async () => {
    try {
      await confirmAndMarkAsRead([channel]);
    } catch (e) {
      Logger.warn('[useGroupChannelMessagesWithQuery/channelMarkAsRead]', e);
    }
  };
  const init = useFreshCallback(async uid => {
    if (uid) {
      var _queryRef$current;
      channelMarkAsRead();
      updateNewMessages([], true, sdk.currentUser.userId);
      queryRef.current = createMessageQuery(channel, options === null || options === void 0 ? void 0 : options.queryCreator);
      if ((_queryRef$current = queryRef.current) !== null && _queryRef$current !== void 0 && _queryRef$current.hasNext) {
        var _queryRef$current2;
        const list = await ((_queryRef$current2 = queryRef.current) === null || _queryRef$current2 === void 0 ? void 0 : _queryRef$current2.load());
        updateMessages(list, true, sdk.currentUser.userId);
      }
    }
  });
  const channelUpdater = channel => {
    if (channel.isGroupChannel() && !isDifferentChannel(channel, channel)) {
      forceUpdate();
    }
  };
  useChannelHandler(sdk, handlerId, {
    // Messages
    onMessageReceived(eventChannel, message) {
      var _options$shouldCountN;
      if (isDifferentChannel(channel, eventChannel)) return;
      if (isMyMessage(message, sdk.currentUser.userId)) return;
      channelMarkAsRead();
      updateMessages([message], false, sdk.currentUser.userId);
      if (options !== null && options !== void 0 && (_options$shouldCountN = options.shouldCountNewMessages) !== null && _options$shouldCountN !== void 0 && _options$shouldCountN.call(options)) {
        updateNewMessages([message], false, sdk.currentUser.userId);
      }
      if (options !== null && options !== void 0 && options.onMessagesReceived) {
        options.onMessagesReceived([message]);
      }
    },
    onMessageUpdated(eventChannel, message) {
      if (isDifferentChannel(channel, eventChannel)) return;
      if (isMyMessage(message, sdk.currentUser.userId)) return;
      updateMessages([message], false, sdk.currentUser.userId);
    },
    onMessageDeleted(eventChannel, messageId) {
      if (isDifferentChannel(channel, eventChannel)) return;
      deleteMessages([messageId], []);
      deleteNewMessages([messageId], []);
    },
    async onReactionUpdated(eventChannel, reactionEvent) {
      if (isDifferentChannel(channel, eventChannel)) return;
      const message = await sdk.message.getMessage({
        messageId: reactionEvent.messageId,
        includeReactions: true,
        includeParentMessageInfo: true,
        includeThreadInfo: true,
        includeMetaArray: true,
        channelUrl: channel.url,
        channelType: channel.channelType
      });
      updateMessages([message], false, sdk.currentUser.userId);
    },
    // Channels
    onChannelChanged: channelUpdater,
    onChannelFrozen: channelUpdater,
    onChannelUnfrozen: channelUpdater,
    onChannelHidden: channelUpdater,
    onChannelMemberCountChanged(channels) {
      const foundChannel = channels.find(c => !isDifferentChannel(c, channel));
      if (foundChannel) channelUpdater(foundChannel);
    },
    onChannelDeleted(channelUrl) {
      var _options$onChannelDel;
      if (channel.url === channelUrl) options === null || options === void 0 ? void 0 : (_options$onChannelDel = options.onChannelDeleted) === null || _options$onChannelDel === void 0 ? void 0 : _options$onChannelDel.call(options);
    },
    // Users
    onOperatorUpdated: channelUpdater,
    onUserLeft: channelUpdater,
    // onUserEntered: channelUpdater,
    // onUserExited: channelUpdater,
    onUserJoined: channelUpdater,
    onUserUnbanned: channelUpdater,
    onUserMuted: channelUpdater,
    onUserUnmuted: channelUpdater,
    onUserBanned(eventChannel, bannedUser) {
      if (isDifferentChannel(channel, eventChannel)) return;
      if (bannedUser.userId === sdk.currentUser.userId) {
        var _options$onChannelDel2;
        options === null || options === void 0 ? void 0 : (_options$onChannelDel2 = options.onChannelDeleted) === null || _options$onChannelDel2 === void 0 ? void 0 : _options$onChannelDel2.call(options);
      } else {
        channelUpdater(eventChannel);
      }
    }
  });
  useAsyncEffect(async () => {
    updateLoading(true);
    await init(userId);
    updateLoading(false);
  }, [channel.url, userId]);
  const refresh = useFreshCallback(async () => {
    updateRefreshing(true);
    await init(userId);
    updateRefreshing(false);
  });
  const prev = useFreshCallback(async () => {
    var _queryRef$current3;
    if (queryRef.current && (_queryRef$current3 = queryRef.current) !== null && _queryRef$current3 !== void 0 && _queryRef$current3.hasNext) {
      var _queryRef$current4;
      const list = await ((_queryRef$current4 = queryRef.current) === null || _queryRef$current4 === void 0 ? void 0 : _queryRef$current4.load());
      updateMessages(list, false, sdk.currentUser.userId);
    }
  });
  const hasPrev = useFreshCallback(() => {
    var _queryRef$current5;
    return ((_queryRef$current5 = queryRef.current) === null || _queryRef$current5 === void 0 ? void 0 : _queryRef$current5.hasNext) ?? false;
  });
  const next = useFreshCallback(ASYNC_NOOP);
  const hasNext = useFreshCallback(() => false);
  const sendUserMessage = useFreshCallback((params, onPending) => {
    return new Promise((resolve, reject) => {
      channel.sendUserMessage(params).onPending(pendingMessage => {
        if (pendingMessage.isUserMessage()) {
          updateMessages([pendingMessage], false, sdk.currentUser.userId);
          onPending === null || onPending === void 0 ? void 0 : onPending(pendingMessage);
        }
      }).onSucceeded(sentMessage => {
        if (sentMessage.isUserMessage()) {
          updateMessages([sentMessage], false, sdk.currentUser.userId);
          resolve(sentMessage);
        }
      }).onFailed((err, sentMessage) => {
        updateMessages([sentMessage], false, sdk.currentUser.userId);
        reject(err);
      });
    });
  });
  const sendFileMessage = useFreshCallback((params, onPending) => {
    return new Promise((resolve, reject) => {
      channel.sendFileMessage(params).onPending(pendingMessage => {
        if (pendingMessage.isFileMessage()) {
          updateMessages([pendingMessage], false, sdk.currentUser.userId);
          onPending === null || onPending === void 0 ? void 0 : onPending(pendingMessage);
        }
      }).onSucceeded(sentMessage => {
        if (sentMessage.isFileMessage()) {
          updateMessages([sentMessage], false, sdk.currentUser.userId);
          resolve(sentMessage);
        }
      }).onFailed((err, sentMessage) => {
        updateMessages([sentMessage], false, sdk.currentUser.userId);
        reject(err);
      });
    });
  });
  const updateUserMessage = useFreshCallback(async (messageId, params) => {
    const updatedMessage = await channel.updateUserMessage(messageId, params);
    updateMessages([updatedMessage], false, sdk.currentUser.userId);
    return updatedMessage;
  });
  const updateFileMessage = useFreshCallback(async (messageId, params) => {
    const updatedMessage = await channel.updateFileMessage(messageId, params);
    updateMessages([updatedMessage], false, sdk.currentUser.userId);
    return updatedMessage;
  });
  const resendMessage = useFreshCallback(async failedMessage => {
    const message = await (() => {
      if (failedMessage.isUserMessage()) return channel.resendUserMessage(failedMessage);
      if (failedMessage.isFileMessage()) return channel.resendFileMessage(failedMessage);
      return null;
    })();
    if (message) updateMessages([message], false, sdk.currentUser.userId);
  });
  const deleteMessage = useFreshCallback(async message => {
    if (message.sendingStatus === 'succeeded') {
      if (message.isUserMessage()) await channel.deleteMessage(message);
      if (message.isFileMessage()) await channel.deleteMessage(message);
    } else {
      deleteMessages([message.messageId], [message.reqId]);
    }
  });
  const resetNewMessages = useFreshCallback(() => {
    updateNewMessages([], true, sdk.currentUser.userId);
  });
  return {
    loading,
    refreshing,
    refresh,
    messages,
    newMessages,
    resetNewMessages,
    next,
    hasNext,
    prev,
    hasPrev,
    sendUserMessage,
    sendFileMessage,
    updateUserMessage,
    updateFileMessage,
    resendMessage,
    deleteMessage,
    resetWithStartingPoint() {
      Logger.warn('resetWithStartingPoint is not supported in Query, please use Collection instead.');
    },
    nextMessages: newMessages,
    newMessagesFromMembers: newMessages
  };
};
//# sourceMappingURL=useGroupChannelMessagesWithQuery.js.map