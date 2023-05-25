import React, { useEffect, useRef, useState } from 'react';
import { getAvailableUriFromFileMessage } from '@sendbird/uikit-utils';
import Box from '../../components/Box';
import Icon from '../../components/Icon';
import ImageWithPlaceholder from '../../components/ImageWithPlaceholder';
import PressBox from '../../components/PressBox';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
const VideoFileMessage = props => {
  const {
    colors,
    palette
  } = useUIKitTheme();
  const {
    onPress,
    onLongPress,
    ...rest
  } = props;
  const uri = getAvailableUriFromFileMessage(props.message);
  const {
    thumbnail,
    loading
  } = useRetry(() => props.fetchThumbnailFromVideoSource(uri));
  return /*#__PURE__*/React.createElement(MessageContainer, rest, /*#__PURE__*/React.createElement(PressBox, {
    style: styles.container,
    activeOpacity: 0.8,
    onPress: onPress,
    onLongPress: onLongPress
  }, /*#__PURE__*/React.createElement(Box, {
    borderRadius: 8,
    overflow: 'hidden',
    style: styles.container
  }, loading ? /*#__PURE__*/React.createElement(Box, {
    backgroundColor: colors.onBackground04,
    style: {
      width: '100%',
      height: '100%'
    }
  }) : /*#__PURE__*/React.createElement(ImageWithPlaceholder, {
    source: {
      uri: thumbnail ?? 'invalid-image'
    },
    width: '100%',
    height: '100%'
  }), (loading || thumbnail !== null) && /*#__PURE__*/React.createElement(Box, {
    style: styles.iconContainer,
    alignItems: 'center',
    justifyContent: 'center'
  }, /*#__PURE__*/React.createElement(Icon, {
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
  const [state, setState] = useState({
    thumbnail: null,
    loading: true
  });
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef();
  const fetchThumbnail = useRef(fetch);
  fetchThumbnail.current = fetch;
  useEffect(() => {
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
const styles = createStyleSheet({
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
export default VideoFileMessage;
//# sourceMappingURL=Message.file.video.js.map