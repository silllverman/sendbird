import React, { createContext, useState } from 'react';
import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { NOOP, isDifferentChannel, useUniqHandlerId } from '@sendbird/uikit-utils';
import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
export const GroupChannelContexts = {
  Fragment: /*#__PURE__*/createContext({
    headerTitle: '',
    channel: {},
    setMessageToEdit: NOOP
  }),
  TypingIndicator: /*#__PURE__*/createContext({
    typingUsers: []
  }),
  PubSub: /*#__PURE__*/createContext({
    publish: NOOP,
    subscribe: () => NOOP
  })
};
export const GroupChannelContextsProvider = _ref => {
  let {
    children,
    channel,
    enableTypingIndicator,
    keyboardAvoidOffset = 0,
    groupChannelPubSub
  } = _ref;
  if (!channel) throw new Error('GroupChannel is not provided to GroupChannelModule');
  const handlerId = useUniqHandlerId('GroupChannelContextsProvider');
  const {
    STRINGS
  } = useLocalization();
  const {
    currentUser,
    sdk
  } = useSendbirdChat();
  const [typingUsers, setTypingUsers] = useState([]);
  const [messageToEdit, setMessageToEdit] = useState();
  useChannelHandler(sdk, handlerId, {
    onTypingStatusUpdated(eventChannel) {
      if (isDifferentChannel(channel, eventChannel)) return;
      if (!enableTypingIndicator) return;
      setTypingUsers(eventChannel.getTypingUsers());
    }
  });
  return /*#__PURE__*/React.createElement(ProviderLayout, null, /*#__PURE__*/React.createElement(GroupChannelContexts.Fragment.Provider, {
    value: {
      headerTitle: STRINGS.GROUP_CHANNEL.HEADER_TITLE((currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId) ?? '', channel),
      channel,
      messageToEdit,
      setMessageToEdit,
      keyboardAvoidOffset
    }
  }, /*#__PURE__*/React.createElement(GroupChannelContexts.TypingIndicator.Provider, {
    value: {
      typingUsers
    }
  }, /*#__PURE__*/React.createElement(GroupChannelContexts.PubSub.Provider, {
    value: groupChannelPubSub
  }, children))));
};
//# sourceMappingURL=moduleContext.js.map