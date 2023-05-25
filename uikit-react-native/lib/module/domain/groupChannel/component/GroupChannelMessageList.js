function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { useContext, useEffect, useRef } from 'react';
import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { isDifferentChannel, useFreshCallback, useUniqHandlerId } from '@sendbird/uikit-utils';
import ChannelMessageList from '../../../components/ChannelMessageList';
import { MESSAGE_SEARCH_SAFE_SCROLL_DELAY } from '../../../constants';
import { useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelContexts } from '../module/moduleContext';
const GroupChannelMessageList = props => {
  const {
    sdk
  } = useSendbirdChat();
  const {
    setMessageToEdit
  } = useContext(GroupChannelContexts.Fragment);
  const {
    subscribe
  } = useContext(GroupChannelContexts.PubSub);
  const id = useUniqHandlerId('GroupChannelMessageList');
  const ref = useRef(null);

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToBottom = function () {
    let animated = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    let timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    setTimeout(() => {
      var _ref$current;
      (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.scrollToOffset({
        offset: 0,
        animated
      });
    }, timeout);
  };

  // FIXME: Workaround, should run after data has been applied to UI.
  const lazyScrollToIndex = function () {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    setTimeout(() => {
      var _ref$current2;
      (_ref$current2 = ref.current) === null || _ref$current2 === void 0 ? void 0 : _ref$current2.scrollToIndex({
        index,
        animated,
        viewPosition: 0.5
      });
    }, timeout);
  };
  useEffect(() => {
    if (props.searchItem) {
      const createdAt = props.searchItem.startingPoint;
      const foundMessageIndex = props.messages.findIndex(it => it.createdAt === createdAt);
      const isIncludedInList = foundMessageIndex > -1;
      if (isIncludedInList) {
        lazyScrollToIndex(foundMessageIndex, true, MESSAGE_SEARCH_SAFE_SCROLL_DELAY);
      }
    }
  }, [props.searchItem]);
  const scrollToBottom = useFreshCallback(function () {
    let animated = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (props.hasNext()) {
      props.onResetMessageList(() => {
        lazyScrollToBottom(animated);
        props.onScrolledAwayFromBottom(false);
      });
    } else {
      lazyScrollToBottom(animated);
    }
  });
  useChannelHandler(sdk, id, {
    onReactionUpdated(channel, event) {
      if (isDifferentChannel(channel, props.channel)) return;
      const recentMessage = props.messages[0];
      const isRecentMessage = recentMessage && recentMessage.messageId === event.messageId;
      const scrollReachedBottomAndCanScroll = !props.scrolledAwayFromBottom && !props.hasNext();
      if (isRecentMessage && scrollReachedBottomAndCanScroll) {
        lazyScrollToBottom(true, 250);
      }
    }
  });
  useEffect(() => {
    return subscribe(_ref => {
      let {
        type
      } = _ref;
      switch (type) {
        case 'MESSAGES_RECEIVED':
          {
            if (!props.scrolledAwayFromBottom) {
              scrollToBottom(true);
            }
            break;
          }
        case 'MESSAGE_SENT_SUCCESS':
        case 'MESSAGE_SENT_PENDING':
          {
            scrollToBottom(false);
            break;
          }
      }
    });
  }, [props.scrolledAwayFromBottom]);
  return /*#__PURE__*/React.createElement(ChannelMessageList, _extends({}, props, {
    ref: ref,
    onEditMessage: setMessageToEdit,
    onPressNewMessagesButton: scrollToBottom,
    onPressScrollToBottomButton: scrollToBottom
  }));
};
export default /*#__PURE__*/React.memo(GroupChannelMessageList);
//# sourceMappingURL=GroupChannelMessageList.js.map