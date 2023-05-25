"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGroupChannelMessagesWithCollection = void 0;
var _react = require("react");
var _groupChannel = require("@sendbird/chat/groupChannel");
var _uikitUtils = require("@sendbird/uikit-utils");
var _useChannelHandler = require("../../handler/useChannelHandler");
var _useChannelMessagesReducer = require("../useChannelMessagesReducer");
const MESSAGE_LIMIT = {
  DEFAULT: 50,
  SEARCH: 20
};
const createMessageCollection = (channel, limit, options) => {
  if (options !== null && options !== void 0 && options.collectionCreator) return options === null || options === void 0 ? void 0 : options.collectionCreator({
    startingPoint: options === null || options === void 0 ? void 0 : options.startingPoint
  });
  const filter = new _groupChannel.MessageFilter();
  return channel.createMessageCollection({
    filter,
    limit,
    startingPoint: options === null || options === void 0 ? void 0 : options.startingPoint
  });
};
function isNotEmpty(arr) {
  if (!arr) return false;
  return arr.length !== 0;
}
const useGroupChannelMessagesWithCollection = (sdk, channel, userId, options) => {
  const initialStartingPoint = (options === null || options === void 0 ? void 0 : options.startingPoint) ?? Number.MAX_SAFE_INTEGER;
  const initialLimit = typeof (options === null || options === void 0 ? void 0 : options.startingPoint) === 'number' ? MESSAGE_LIMIT.SEARCH : MESSAGE_LIMIT.DEFAULT;
  const forceUpdate = (0, _uikitUtils.useForceUpdate)();
  const collectionRef = (0, _react.useRef)();
  const collectionInitializedRef = (0, _react.useRef)(false);
  const handlerId = (0, _uikitUtils.useUniqHandlerId)('useGroupChannelMessagesWithCollection');
  const {
    loading,
    refreshing,
    messages,
    newMessages,
    updateMessages,
    updateNewMessages,
    deleteNewMessages,
    deleteMessages,
    updateLoading,
    updateRefreshing
  } = (0, _useChannelMessagesReducer.useChannelMessagesReducer)(options === null || options === void 0 ? void 0 : options.sortComparator);
  const channelMarkAsRead = async source => {
    try {
      switch (source) {
        case _groupChannel.MessageEventSource.EVENT_MESSAGE_RECEIVED:
        case _groupChannel.MessageEventSource.EVENT_MESSAGE_SENT_SUCCESS:
        case _groupChannel.MessageEventSource.SYNC_MESSAGE_FILL:
        case undefined:
          await (0, _uikitUtils.confirmAndMarkAsRead)([channel]);
          break;
      }
    } catch (e) {
      _uikitUtils.Logger.warn('[useGroupChannelMessagesWithCollection/channelMarkAsRead]', e);
    }
  };
  const updateUnsendMessages = () => {
    const {
      pendingMessages,
      failedMessages
    } = collectionRef.current ?? {};
    if (isNotEmpty(pendingMessages)) updateMessages(pendingMessages, false, sdk.currentUser.userId);
    if (isNotEmpty(failedMessages)) updateMessages(failedMessages, false, sdk.currentUser.userId);
  };
  const init = (0, _uikitUtils.useFreshCallback)(async (startingPoint, limit, callback) => {
    var _collectionRef$curren, _collectionRef$curren2;
    if (collectionRef.current) (_collectionRef$curren = collectionRef.current) === null || _collectionRef$curren === void 0 ? void 0 : _collectionRef$curren.dispose();
    channelMarkAsRead();
    updateNewMessages([], true, sdk.currentUser.userId);
    collectionInitializedRef.current = false;
    collectionRef.current = createMessageCollection(channel, limit, {
      collectionCreator: options === null || options === void 0 ? void 0 : options.collectionCreator,
      startingPoint
    });
    (_collectionRef$curren2 = collectionRef.current) === null || _collectionRef$curren2 === void 0 ? void 0 : _collectionRef$curren2.setMessageCollectionHandler({
      onMessagesAdded: (_, __, messages) => {
        channelMarkAsRead(_.source);
        const incomingMessages = messages.filter(it => {
          switch (_.source) {
            case _groupChannel.MessageEventSource.EVENT_MESSAGE_SENT_PENDING:
            case _groupChannel.MessageEventSource.EVENT_MESSAGE_SENT_SUCCESS:
            case _groupChannel.MessageEventSource.EVENT_MESSAGE_SENT_FAILED:
              return !(0, _uikitUtils.isMyMessage)(it, sdk.currentUser.userId);
            default:
              return true;
          }
        });
        if (incomingMessages.length > 0) {
          var _options$shouldCountN;
          updateMessages(incomingMessages, false, sdk.currentUser.userId);
          if (options !== null && options !== void 0 && (_options$shouldCountN = options.shouldCountNewMessages) !== null && _options$shouldCountN !== void 0 && _options$shouldCountN.call(options)) {
            updateNewMessages(incomingMessages, false, sdk.currentUser.userId);
          }
          switch (_.source) {
            case _groupChannel.MessageEventSource.EVENT_MESSAGE_RECEIVED:
            case _groupChannel.MessageEventSource.SYNC_MESSAGE_FILL:
              {
                var _options$onMessagesRe;
                options === null || options === void 0 ? void 0 : (_options$onMessagesRe = options.onMessagesReceived) === null || _options$onMessagesRe === void 0 ? void 0 : _options$onMessagesRe.call(options, incomingMessages);
              }
          }
        }
      },
      onMessagesUpdated: (_, __, messages) => {
        channelMarkAsRead(_.source);
        const incomingMessages = messages.filter(it => {
          switch (_.source) {
            case _groupChannel.MessageEventSource.EVENT_MESSAGE_UPDATED:
              return !(0, _uikitUtils.isMyMessage)(it, sdk.currentUser.userId);
            default:
              return true;
          }
        });
        if (incomingMessages.length > 0) {
          var _options$shouldCountN2;
          // NOTE: admin message is not added via onMessagesAdded handler, not checked yet is this a bug.
          updateMessages(messages, false, sdk.currentUser.userId);
          if (options !== null && options !== void 0 && (_options$shouldCountN2 = options.shouldCountNewMessages) !== null && _options$shouldCountN2 !== void 0 && _options$shouldCountN2.call(options)) {
            if (_.source === _groupChannel.MessageEventSource.EVENT_MESSAGE_RECEIVED) {
              updateNewMessages(messages, false, sdk.currentUser.userId);
            }
          }
        }
      },
      onMessagesDeleted: (_, __, messageIds) => {
        deleteMessages(messageIds, []);
        deleteNewMessages(messageIds, []);
      },
      onChannelDeleted: () => {
        var _options$onChannelDel;
        options === null || options === void 0 ? void 0 : (_options$onChannelDel = options.onChannelDeleted) === null || _options$onChannelDel === void 0 ? void 0 : _options$onChannelDel.call(options);
      },
      onChannelUpdated: (_, eventChannel) => {
        if (eventChannel.isGroupChannel() && !(0, _uikitUtils.isDifferentChannel)(eventChannel, channel)) {
          forceUpdate();
        }
      },
      onHugeGapDetected: () => {
        init(Number.MAX_SAFE_INTEGER, MESSAGE_LIMIT.DEFAULT);
      }
    });
    collectionRef.current.initialize(_groupChannel.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API).onCacheResult((err, messages) => {
      if (err) sdk.isCacheEnabled && _uikitUtils.Logger.error('[useGroupChannelMessagesWithCollection/onCacheResult]', err);else {
        _uikitUtils.Logger.debug('[useGroupChannelMessagesWithCollection/onCacheResult]', 'message length:', messages.length);
        updateMessages(messages, true, sdk.currentUser.userId);
        updateUnsendMessages();
      }
      callback === null || callback === void 0 ? void 0 : callback();
    }).onApiResult((err, messages) => {
      if (err) _uikitUtils.Logger.warn('[useGroupChannelMessagesWithCollection/onApiResult]', err);else {
        var _options$onMessagesRe2;
        _uikitUtils.Logger.debug('[useGroupChannelMessagesWithCollection/onApiResult]', 'message length:', messages.length);
        updateMessages(messages, true, sdk.currentUser.userId);
        if (!(options !== null && options !== void 0 && options.startingPoint)) options === null || options === void 0 ? void 0 : (_options$onMessagesRe2 = options.onMessagesReceived) === null || _options$onMessagesRe2 === void 0 ? void 0 : _options$onMessagesRe2.call(options, messages);
        if (sdk.isCacheEnabled) updateUnsendMessages();
      }
      collectionInitializedRef.current = true;
      callback === null || callback === void 0 ? void 0 : callback();
    });
  });
  (0, _useChannelHandler.useChannelHandler)(sdk, handlerId, {
    onUserBanned(channel, bannedUser) {
      if (channel.isGroupChannel() && !(0, _uikitUtils.isDifferentChannel)(channel, channel)) {
        if (bannedUser.userId === sdk.currentUser.userId) {
          var _options$onChannelDel2;
          options === null || options === void 0 ? void 0 : (_options$onChannelDel2 = options.onChannelDeleted) === null || _options$onChannelDel2 === void 0 ? void 0 : _options$onChannelDel2.call(options);
        } else {
          forceUpdate();
        }
      }
    }
  });
  (0, _react.useEffect)(() => {
    // NOTE: Cache read is heavy task, and it prevents smooth ui transition
    setTimeout(async () => {
      updateLoading(true);
      init(initialStartingPoint, initialLimit, () => updateLoading(false));
    }, 0);
  }, [channel.url, userId]);
  (0, _react.useEffect)(() => {
    return () => {
      var _collectionRef$curren3;
      if (collectionRef.current) (_collectionRef$curren3 = collectionRef.current) === null || _collectionRef$curren3 === void 0 ? void 0 : _collectionRef$curren3.dispose();
    };
  }, []);
  const refresh = (0, _uikitUtils.useFreshCallback)(async () => {
    updateRefreshing(true);
    init(Number.MAX_SAFE_INTEGER, MESSAGE_LIMIT.DEFAULT, () => updateRefreshing(false));
  });
  const prev = (0, _uikitUtils.useFreshCallback)(async () => {
    var _collectionRef$curren4;
    if (collectionRef.current && (_collectionRef$curren4 = collectionRef.current) !== null && _collectionRef$curren4 !== void 0 && _collectionRef$curren4.hasPrevious) {
      try {
        var _collectionRef$curren5;
        const list = await ((_collectionRef$curren5 = collectionRef.current) === null || _collectionRef$curren5 === void 0 ? void 0 : _collectionRef$curren5.loadPrevious());
        updateMessages(list, false, sdk.currentUser.userId);
      } catch {}
    }
  });
  const hasPrev = (0, _uikitUtils.useFreshCallback)(() => {
    if (collectionInitializedRef.current && collectionRef.current) {
      return collectionRef.current.hasPrevious;
    } else {
      return false;
    }
  });
  const next = (0, _uikitUtils.useFreshCallback)(async () => {
    var _collectionRef$curren6;
    if (collectionRef.current && (_collectionRef$curren6 = collectionRef.current) !== null && _collectionRef$curren6 !== void 0 && _collectionRef$curren6.hasNext) {
      try {
        var _collectionRef$curren7;
        const fetchedList = await ((_collectionRef$curren7 = collectionRef.current) === null || _collectionRef$curren7 === void 0 ? void 0 : _collectionRef$curren7.loadNext());
        updateMessages(fetchedList, false, sdk.currentUser.userId);
      } catch {}
    }
  });
  const hasNext = (0, _uikitUtils.useFreshCallback)(() => {
    if (collectionInitializedRef.current && collectionRef.current) {
      return collectionRef.current.hasNext;
    } else {
      return false;
    }
  });
  const sendUserMessage = (0, _uikitUtils.useFreshCallback)((params, onPending) => {
    return new Promise((resolve, reject) => {
      channel.sendUserMessage(params).onPending(pendingMessage => {
        if (pendingMessage.isUserMessage()) {
          onPending === null || onPending === void 0 ? void 0 : onPending(pendingMessage);
          updateMessages([pendingMessage], false, sdk.currentUser.userId);
        }
      }).onSucceeded(sentMessage => {
        if (sentMessage.isUserMessage()) {
          updateMessages([sentMessage], false, sdk.currentUser.userId);
          resolve(sentMessage);
        }
      }).onFailed((err, failedMessage) => {
        updateMessages([failedMessage], false, sdk.currentUser.userId);
        reject(err);
      });
    });
  });
  const sendFileMessage = (0, _uikitUtils.useFreshCallback)((params, onPending) => {
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
      }).onFailed((err, failedMessage) => {
        updateMessages([failedMessage], false, sdk.currentUser.userId);
        reject(err);
      });
    });
  });
  const updateUserMessage = (0, _uikitUtils.useFreshCallback)(async (messageId, params) => {
    const updatedMessage = await channel.updateUserMessage(messageId, params);
    updateMessages([updatedMessage], false, sdk.currentUser.userId);
    return updatedMessage;
  });
  const updateFileMessage = (0, _uikitUtils.useFreshCallback)(async (messageId, params) => {
    const updatedMessage = await channel.updateFileMessage(messageId, params);
    updateMessages([updatedMessage], false, sdk.currentUser.userId);
    return updatedMessage;
  });
  const resendMessage = (0, _uikitUtils.useFreshCallback)(async failedMessage => {
    const resentMessage = await (() => {
      if (failedMessage.isUserMessage()) return channel.resendUserMessage(failedMessage);
      if (failedMessage.isFileMessage()) return channel.resendFileMessage(failedMessage);
      return null;
    })();
    if (resentMessage) updateMessages([resentMessage], false, sdk.currentUser.userId);
  });
  const deleteMessage = (0, _uikitUtils.useFreshCallback)(async message => {
    if (message.sendingStatus === 'succeeded') {
      if (message.isUserMessage()) await channel.deleteMessage(message);
      if (message.isFileMessage()) await channel.deleteMessage(message);
    } else {
      try {
        var _collectionRef$curren8;
        await ((_collectionRef$curren8 = collectionRef.current) === null || _collectionRef$curren8 === void 0 ? void 0 : _collectionRef$curren8.removeFailedMessage(message.reqId));
      } finally {
        deleteMessages([message.messageId], [message.reqId]);
      }
    }
  });
  const resetNewMessages = (0, _uikitUtils.useFreshCallback)(() => {
    updateNewMessages([], true, sdk.currentUser.userId);
  });
  const resetWithStartingPoint = (0, _uikitUtils.useFreshCallback)((startingPoint, callback) => {
    updateLoading(true);
    updateMessages([], true, sdk.currentUser.userId);
    init(startingPoint, MESSAGE_LIMIT.DEFAULT, () => {
      updateLoading(false);
      callback === null || callback === void 0 ? void 0 : callback();
    });
  });
  return {
    loading,
    refreshing,
    refresh,
    messages,
    next,
    hasNext,
    prev,
    hasPrev,
    newMessages,
    resetNewMessages,
    sendUserMessage,
    sendFileMessage,
    updateUserMessage,
    updateFileMessage,
    resendMessage,
    deleteMessage,
    resetWithStartingPoint,
    nextMessages: newMessages,
    newMessagesFromMembers: newMessages
  };
};
exports.useGroupChannelMessagesWithCollection = useGroupChannelMessagesWithCollection;
//# sourceMappingURL=useGroupChannelMessagesWithCollection.js.map