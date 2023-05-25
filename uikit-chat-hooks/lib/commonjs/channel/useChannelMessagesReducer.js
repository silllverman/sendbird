"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChannelMessagesReducer = void 0;
var _react = require("react");
var _uikitUtils = require("@sendbird/uikit-utils");
const defaultReducer = (_ref, action) => {
  let {
    ...draft
  } = _ref;
  switch (action.type) {
    case 'update_refreshing':
      {
        draft['refreshing'] = action.value.status;
        return draft;
      }
    case 'update_loading':
      {
        draft['loading'] = action.value.status;
        return draft;
      }
    case 'update_messages':
      {
        if (action.value.clearBeforeAction) {
          draft['messageMap'] = (0, _uikitUtils.arrayToMapWithGetter)(action.value.messages, _uikitUtils.getMessageUniqId);
        } else {
          // Remove existing messages before update for prevent duplicate display
          const messageKeys = action.value.messages.map(it => (0, _uikitUtils.isSendableMessage)(it) ? [it.messageId, it.reqId] : [it.messageId]).flat();
          messageKeys.forEach(key => delete draft['messageMap'][key]);
          draft['messageMap'] = {
            ...draft['messageMap'],
            ...(0, _uikitUtils.arrayToMapWithGetter)(action.value.messages, _uikitUtils.getMessageUniqId)
          };
        }
        return draft;
      }
    case 'update_new_messages':
      {
        const newMessages = action.value.messages.filter(it => (0, _uikitUtils.isNewMessage)(it, action.value.currentUserId));
        if (action.value.clearBeforeAction) {
          draft['newMessageMap'] = (0, _uikitUtils.arrayToMapWithGetter)(newMessages, _uikitUtils.getMessageUniqId);
        } else {
          // Remove existing messages before update for prevent duplicate display
          const messageKeys = newMessages.map(it => it.messageId);
          messageKeys.forEach(key => delete draft['newMessageMap'][key]);
          draft['newMessageMap'] = {
            ...draft['newMessageMap'],
            ...(0, _uikitUtils.arrayToMapWithGetter)(newMessages, _uikitUtils.getMessageUniqId)
          };
        }
        return draft;
      }
    case 'delete_messages':
    case 'delete_new_messages':
      {
        const key = action.type === 'delete_messages' ? 'messageMap' : 'newMessageMap';
        draft[key] = {
          ...draft[key]
        };
        action.value.messageIds.forEach(msgId => delete draft[key][msgId]);
        action.value.reqIds.forEach(reqId => delete draft[key][reqId]);
        return draft;
      }
  }
};
const useChannelMessagesReducer = sortComparator => {
  const [{
    loading,
    refreshing,
    messageMap,
    newMessageMap
  }, dispatch] = (0, _react.useReducer)(defaultReducer, {
    loading: true,
    refreshing: false,
    messageMap: {},
    newMessageMap: {}
  });
  const updateMessages = (messages, clearBeforeAction, currentUserId) => {
    dispatch({
      type: 'update_messages',
      value: {
        messages,
        clearBeforeAction,
        currentUserId
      }
    });
  };
  const deleteMessages = (messageIds, reqIds) => {
    dispatch({
      type: 'delete_messages',
      value: {
        messageIds,
        reqIds
      }
    });
  };
  const updateNewMessages = (messages, clearBeforeAction, currentUserId) => {
    dispatch({
      type: 'update_new_messages',
      value: {
        messages,
        clearBeforeAction,
        currentUserId
      }
    });
  };
  const deleteNewMessages = (messageIds, reqIds) => {
    dispatch({
      type: 'delete_new_messages',
      value: {
        messageIds,
        reqIds
      }
    });
  };
  const updateLoading = status => {
    dispatch({
      type: 'update_loading',
      value: {
        status
      }
    });
  };
  const updateRefreshing = status => {
    dispatch({
      type: 'update_refreshing',
      value: {
        status
      }
    });
  };
  const messages = (0, _uikitUtils.useIIFE)(() => {
    if (sortComparator) return Object.values(messageMap).sort(sortComparator);
    return Object.values(messageMap);
  });
  const newMessages = Object.values(newMessageMap);
  return {
    updateLoading,
    updateRefreshing,
    updateMessages,
    deleteMessages,
    loading,
    refreshing,
    messages,
    newMessages,
    updateNewMessages,
    deleteNewMessages
  };
};
exports.useChannelMessagesReducer = useChannelMessagesReducer;
//# sourceMappingURL=useChannelMessagesReducer.js.map