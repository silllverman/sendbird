"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _uikitUtils = require("@sendbird/uikit-utils");
var _Box = _interopRequireDefault(require("../../components/Box"));
var _Icon = _interopRequireDefault(require("../../components/Icon"));
var _ImageWithPlaceholder = _interopRequireDefault(require("../../components/ImageWithPlaceholder"));
var _PressBox = _interopRequireDefault(require("../../components/PressBox"));
var _createStyleSheet = _interopRequireDefault(require("../../styles/createStyleSheet"));
var _useUIKitTheme = _interopRequireDefault(require("../../theme/useUIKitTheme"));
var _MessageContainer = _interopRequireDefault(require("./MessageContainer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const VideoFileMessage = props => {
  const {
    colors,
    palette
  } = (0, _useUIKitTheme.default)();
  const {
    onPress,
    onLongPress,
    ...rest
  } = props;
  const uri = (0, _uikitUtils.getAvailableUriFromFileMessage)(props.message);
  const {
    thumbnail,
    loading
  } = useRetry(() => props.fetchThumbnailFromVideoSource(uri));
  return /*#__PURE__*/_react.default.createElement(_MessageContainer.default, rest, /*#__PURE__*/_react.default.createElement(_PressBox.default, {
    style: styles.container,
    activeOpacity: 0.8,
    onPress: onPress,
    onLongPress: onLongPress
  }, /*#__PURE__*/_react.default.createElement(_Box.default, {
    borderRadius: 8,
    overflow: 'hidden',
    style: styles.container
  }, loading ? /*#__PURE__*/_react.default.createElement(_Box.default, {
    backgroundColor: colors.onBackground04,
    style: {
      width: '100%',
      height: '100%'
    }
  }) : /*#__PURE__*/_react.default.createElement(_ImageWithPlaceholder.default, {
    source: {
      uri: thumbnail ?? 'invalid-image'
    },
    width: '100%',
    height: '100%'
  }), (loading || thumbnail !== null) && /*#__PURE__*/_react.default.createElement(_Box.default, {
    style: styles.iconContainer,
    alignItems: 'center',
    justifyContent: 'center'
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: 'play',
    size: 28,
    color: palette.onBackgroundLight02,
    containerStyle: [styles.playIcon, {
      backgroundColor: palette.onBackgroundDark01
    }]
  })))));
};
const useRetry = function (fetch) {
  let retryCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  const [state, setState] = (0, _react.useState)({
    thumbnail: null,
    loading: true
  });
  const retryCountRef = (0, _react.useRef)(0);
  const retryTimeoutRef = (0, _react.useRef)();
  const fetchThumbnail = (0, _react.useRef)(fetch);
  fetchThumbnail.current = fetch;
  (0, _react.useEffect)(() => {
    if (!state.thumbnail) {
      const reloadReservation = () => {
        if (retryCountRef.current < retryCount) {
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++;
            reloadReservation();
            fetchThumbnail.current().then(result => {
              setState({
                loading: false,
                thumbnail: (result === null || result === void 0 ? void 0 : result.path) ?? null
              });
            });
          }, retryCountRef.current * 5000);
        }
      };
      return reloadReservation();
    } else {
      return clearTimeout(retryTimeoutRef.current);
    }
  }, [state.thumbnail]);
  return state;
};
const styles = (0, _createStyleSheet.default)({
  container: {
    maxWidth: 296,
    height: 196
  },
  iconContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  playIcon: {
    padding: 10,
    borderRadius: 50
  }
});
var _default = VideoFileMessage;
exports.default = _default;
//# sourceMappingURL=Message.file.video.js.map