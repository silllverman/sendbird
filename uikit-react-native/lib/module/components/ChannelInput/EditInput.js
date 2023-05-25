import React, { forwardRef } from 'react';
import { Platform, View } from 'react-native';
import { MentionType } from '@sendbird/chat/message';
import { Button, TextInput, createStyleSheet, useToast } from '@sendbird/uikit-react-native-foundation';
import { useLocalization, useSendbirdChat } from '../../hooks/useContext';
const EditInput = /*#__PURE__*/forwardRef(function EditInput(_ref, ref) {
  let {
    text,
    onChangeText,
    messageToEdit,
    setMessageToEdit,
    onPressUpdateUserMessage,
    onUpdateUserMessage,
    onSelectionChange,
    autoFocus,
    mentionedUsers,
    inputDisabled
  } = _ref;
  const {
    mentionManager
  } = useSendbirdChat();
  const {
    STRINGS
  } = useLocalization();
  const toast = useToast();
  const onPressCancel = () => {
    setMessageToEdit();
    onChangeText('');
  };
  const onPressSave = () => {
    if (messageToEdit.isUserMessage()) {
      const mentionType = MentionType.USERS;
      const mentionedUserIds = mentionedUsers.map(it => it.user.userId);
      const mentionedMessageTemplate = mentionManager.textToMentionedMessageTemplate(text, mentionedUsers);
      if (onPressUpdateUserMessage) {
        onPressUpdateUserMessage(messageToEdit, {
          message: text,
          mentionType,
          mentionedUserIds,
          mentionedMessageTemplate
        }).catch(onFailureToUpdate);
      } else if (onUpdateUserMessage) {
        onUpdateUserMessage(text, messageToEdit, {
          type: MentionType.USERS,
          userIds: mentionedUserIds,
          messageTemplate: mentionedMessageTemplate
        }).catch(onFailureToUpdate);
      }
    }
    setMessageToEdit();
    onChangeText('');
  };
  const onFailureToUpdate = () => toast.show(STRINGS.TOAST.UPDATE_MSG_ERROR, 'error');
  return /*#__PURE__*/React.createElement(View, {
    style: styles.editInputContainer
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.inputWrapper
  }, /*#__PURE__*/React.createElement(TextInput, {
    ref: ref,
    multiline: true,
    disableFullscreenUI: true,
    editable: !inputDisabled,
    autoFocus: autoFocus,
    onChangeText: onChangeText,
    style: styles.input,
    placeholder: STRINGS.LABELS.CHANNEL_INPUT_PLACEHOLDER_ACTIVE,
    onSelectionChange: onSelectionChange
  }, mentionManager.textToMentionedComponents(text, mentionedUsers))), /*#__PURE__*/React.createElement(View, {
    style: {
      marginTop: 8,
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: 'text',
    onPress: onPressCancel
  }, STRINGS.LABELS.CHANNEL_INPUT_EDIT_CANCEL), /*#__PURE__*/React.createElement(View, {
    style: styles.space
  }), /*#__PURE__*/React.createElement(Button, {
    variant: 'contained',
    onPress: onPressSave
  }, STRINGS.LABELS.CHANNEL_INPUT_EDIT_OK)));
});
const styles = createStyleSheet({
  editInputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    marginRight: 4,
    minHeight: 36,
    maxHeight: 36 * Platform.select({
      ios: 2.5,
      default: 2
    }),
    borderRadius: 20
  },
  inputWrapper: {
    flexDirection: 'row'
  },
  space: {
    flex: 1
  }
});
export default EditInput;
//# sourceMappingURL=EditInput.js.map