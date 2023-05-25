"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _uikitChatHooks = require("@sendbird/uikit-chat-hooks");
var _uikitUtils = require("@sendbird/uikit-utils");
var _ChannelMessageList = _interopRequireDefault(require("../../../components/ChannelMessageList"));
var _constants = require("../../../constants");
var _useContext = require("../../../hooks/useContext");
var _moduleContext = require("../module/moduleContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const GroupChannelMessageList = props => {
  const {
    sdk
  } = (0, _useContext.useSendbirdChat)();
  const {
    setMessageToEdit
  } = (0, _react.useContext)(_moduleContext.GroupChannelContexts.Fragment);
  const {
    subscribe
  } = (0, _react.useContext)(_moduleContext.GroupChannelContexts.PubSub);
  const id = (0, _uikitUtils.useUniqHandlerId)('GroupChannelMessageList');
  const ref = (0, _react.useRef)(null);

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
  (0, _react.useEffect)(() => {
    if (props.searchItem) {
      const createdAt = props.searchItem.startingPoint;
      const foundMessageIndex = props.messages.findIndex(it => it.createdAt === createdAt);
      const isIncludedInList = foundMessageIndex > -1;
      if (isIncludedInList) {
        lazyScrollToIndex(foundMessageIndex, true, _constants.MESSAGE_SEARCH_SAFE_SCROLL_DELAY);
      }
    }
  }, [props.searchItem]);
  const scrollToBottom = (0, _uikitUtils.useFreshCallback)(function () {
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
  (0, _uikitChatHooks.useChannelHandler)(sdk, id, {
    onReactionUpdated(channel, event) {
      if ((0, _uikitUtils.isDifferentChannel)(channel, props.channel)) return;
      const recentMessage = props.messages[0];
      const isRecentMessage = recentMessage && recentMessage.messageId === event.messageId;
      const scrollReachedBottomAndCanScroll = !props.scrolledAwayFromBottom && !props.hasNext();
      if (isRecentMessage && scrollReachedBottomAndCanScroll) {
        lazyScrollToBottom(true, 250);
      }
    }
  });
  (0, _react.useEffect)(() => {
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
  return /*#__PURE__*/_react.default.createElement(_ChannelMessageList.default, _extends({}, props, {
    ref: ref,
    onEditMessage: setMessageToEdit,
    onPressNewMessagesButton: scrollToBottom,
    onPressScrollToBottomButton: scrollToBottom
  }));
};
var _default = /*#__PURE__*/_react.default.memo(GroupChannelMessageList);
exports.default = _default;
//# sourceMappingURL=GroupChannelMessageList.js.map