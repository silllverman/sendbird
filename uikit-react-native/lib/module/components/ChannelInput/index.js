function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { replace, useIIFE } from '@sendbird/uikit-utils';
import { useSendbirdChat } from '../../hooks/useContext';
import useMentionTextInput from '../../hooks/useMentionTextInput';
import EditInput from './EditInput';
import SendInput from './SendInput';
const AUTO_FOCUS = Platform.select({
  ios: false,
  android: true,
  default: false
});
const KEYBOARD_AVOID_VIEW_BEHAVIOR = Platform.select({
  ios: 'padding',
  default: undefined
});

// FIXME(iOS): Dynamic style does not work properly when typing the CJK. (https://github.com/facebook/react-native/issues/26107)
//  To workaround temporarily, change the key for re-mount the component.
//  -> This will affect to keyboard blur when add/remove first mentioned user.
const GET_INPUT_KEY = shouldReset => shouldReset ? 'uikit-input-clear' : 'uikit-input';

// TODO: Refactor 'Edit' mode to clearly
const ChannelInput = props => {
  const {
    channel,
    keyboardAvoidOffset,
    messageToEdit,
    setMessageToEdit
  } = props;
  const {
    top,
    left,
    right,
    bottom
  } = useSafeAreaInsets();
  const {
    colors
  } = useUIKitTheme();
  const {
    features,
    mentionManager
  } = useSendbirdChat();
  const {
    selection,
    onSelectionChange,
    textInputRef,
    text,
    onChangeText,
    mentionedUsers
  } = useMentionTextInput({
    messageToEdit
  });
  const inputMode = useIIFE(() => {
    if (!messageToEdit) return 'send';
    if (messageToEdit.isFileMessage()) return 'send';
    return 'edit';
  });
  const mentionAvailable = features.userMentionEnabled && channel.isGroupChannel() && !channel.isBroadcast;
  const inputKeyToRemount = GET_INPUT_KEY(mentionAvailable ? mentionedUsers.length === 0 : false);
  const [inputHeight, setInputHeight] = useState(styles.inputDefault.height);
  useTypingTrigger(text, channel);
  useTextPersistenceOnDisabled(text, onChangeText, props.inputDisabled);
  useAutoFocusOnEditMode(textInputRef, messageToEdit);
  const onPressToMention = (user, searchStringRange) => {
    const mentionedMessageText = mentionManager.asMentionedMessageText(user, true);
    const range = {
      start: searchStringRange.start,
      end: searchStringRange.start + mentionedMessageText.length - 1
    };
    onChangeText(replace(text, searchStringRange.start, searchStringRange.end, mentionedMessageText), {
      user,
      range
    });
  };
  if (!props.shouldRenderInput) {
    return /*#__PURE__*/React.createElement(SafeAreaBottom, {
      height: bottom
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KeyboardAvoidingView, {
    keyboardVerticalOffset: -bottom + keyboardAvoidOffset,
    behavior: KEYBOARD_AVOID_VIEW_BEHAVIOR
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      paddingLeft: left,
      paddingRight: right,
      backgroundColor: colors.background
    }
  }, /*#__PURE__*/React.createElement(View, {
    onLayout: e => setInputHeight(e.nativeEvent.layout.height),
    style: styles.inputContainer
  }, inputMode === 'send' && /*#__PURE__*/React.createElement(SendInput, _extends({}, props, {
    key: inputKeyToRemount,
    ref: textInputRef,
    text: text,
    onChangeText: onChangeText,
    onSelectionChange: onSelectionChange,
    mentionedUsers: mentionedUsers
  })), inputMode === 'edit' && messageToEdit && /*#__PURE__*/React.createElement(EditInput, _extends({}, props, {
    key: inputKeyToRemount,
    ref: textInputRef,
    text: text,
    onChangeText: onChangeText,
    autoFocus: AUTO_FOCUS,
    onSelectionChange: onSelectionChange,
    messageToEdit: messageToEdit,
    mentionedUsers: mentionedUsers,
    setMessageToEdit: setMessageToEdit
  }))), /*#__PURE__*/React.createElement(SafeAreaBottom, {
    height: bottom
  }))), mentionAvailable && props.SuggestedMentionList && /*#__PURE__*/React.createElement(props.SuggestedMentionList, {
    text: text,
    selection: selection,
    inputHeight: inputHeight,
    topInset: top,
    bottomInset: bottom,
    onPressToMention: onPressToMention,
    mentionedUsers: mentionedUsers
  }));
};
const useTypingTrigger = (text, channel) => {
  if (channel.isGroupChannel()) {
    useEffect(() => {
      if (text.length === 0) channel.endTyping();else channel.startTyping();
    }, [text]);
  }
};
const useTextPersistenceOnDisabled = (text, setText, chatDisabled) => {
  const textTmpRef = useRef('');
  useEffect(() => {
    if (chatDisabled) {
      textTmpRef.current = text;
      setText('');
    } else {
      setText(textTmpRef.current);
    }
  }, [chatDisabled]);
};
const useAutoFocusOnEditMode = (textInputRef, messageToEdit) => {
  useEffect(() => {
    if (messageToEdit !== null && messageToEdit !== void 0 && messageToEdit.isUserMessage()) {
      if (!AUTO_FOCUS) setTimeout(() => {
        var _textInputRef$current;
        return (_textInputRef$current = textInputRef.current) === null || _textInputRef$current === void 0 ? void 0 : _textInputRef$current.focus();
      }, 500);
    }
  }, [messageToEdit]);
};
const SafeAreaBottom = _ref => {
  let {
    height
  } = _ref;
  return /*#__PURE__*/React.createElement(View, {
    style: {
      height
    }
  });
};
const styles = createStyleSheet({
  inputContainer: {
    justifyContent: 'center',
    width: '100%'
  },
  inputDefault: {
    height: 56
  }
});
export default /*#__PURE__*/React.memo(ChannelInput);
//# sourceMappingURL=index.js.map