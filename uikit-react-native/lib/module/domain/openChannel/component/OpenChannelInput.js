import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { getOpenChannelChatAvailableState, useUniqHandlerId } from '@sendbird/uikit-utils';
import ChannelInput from '../../../components/ChannelInput';
import { UNKNOWN_USER_ID } from '../../../constants';
import { useSendbirdChat } from '../../../hooks/useContext';
import { OpenChannelContexts } from '../module/moduleContext';
const OpenChannelInput = props => {
  const {
    sdk,
    currentUser
  } = useSendbirdChat();
  const {
    channel,
    messageToEdit,
    setMessageToEdit,
    keyboardAvoidOffset = 0
  } = useContext(OpenChannelContexts.Fragment);
  const [chatAvailableState, setChatAvailableState] = useState({
    frozen: false,
    muted: false,
    disabled: false
  });
  const updateChatAvailableState = useCallback(baseChannel => {
    if (baseChannel.isOpenChannel()) {
      const userId = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId) ?? UNKNOWN_USER_ID;
      getOpenChannelChatAvailableState(baseChannel, userId).then(setChatAvailableState);
    }
  }, [currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId]);
  useEffect(() => {
    updateChatAvailableState(channel);
  }, [channel, updateChatAvailableState]);
  const handlerId = useUniqHandlerId('OpenChannelInput');
  useChannelHandler(sdk, handlerId, {
    onChannelFrozen(channel) {
      updateChatAvailableState(channel);
    },
    onChannelUnfrozen(channel) {
      updateChatAvailableState(channel);
    },
    onUserMuted(channel) {
      updateChatAvailableState(channel);
    },
    onUserUnmuted(channel) {
      updateChatAvailableState(channel);
    },
    onOperatorUpdated(channel) {
      updateChatAvailableState(channel);
    }
  }, 'open');
  return /*#__PURE__*/React.createElement(ChannelInput, {
    channel: channel,
    messageToEdit: messageToEdit,
    setMessageToEdit: setMessageToEdit,
    inputMuted: chatAvailableState.muted,
    inputFrozen: channel.isFrozen,
    inputDisabled: chatAvailableState.disabled,
    keyboardAvoidOffset: keyboardAvoidOffset,
    shouldRenderInput: props.shouldRenderInput,
    onPressSendUserMessage: props.onPressSendUserMessage,
    onPressSendFileMessage: props.onPressSendFileMessage,
    onPressUpdateUserMessage: props.onPressUpdateUserMessage,
    onPressUpdateFileMessage: props.onPressUpdateFileMessage
  });
};
export default /*#__PURE__*/React.memo(OpenChannelInput);
//# sourceMappingURL=OpenChannelInput.js.map