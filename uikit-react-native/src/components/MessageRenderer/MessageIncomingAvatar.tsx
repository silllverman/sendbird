import React from 'react';
import { Pressable, View } from 'react-native';

import { Avatar, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

import { useUserProfile } from '../../hooks/useContext';
import { Sender } from '@sendbird/chat/message';

type Props = {
  message: SendbirdMessage;
  grouping: boolean;
  onPressAvatar:(sender: Sender) => void
};
const MessageIncomingAvatar = ({ message, grouping,onPressAvatar }: Props) => {
  const { show } = useUserProfile();
  if (grouping) return <View style={styles.avatar} />;
  return (
    <View style={styles.avatar}>
      {(message.isFileMessage() || message.isUserMessage()) && (
        <Pressable onPress={() => onPressAvatar(message.sender)}>
          <Avatar size={26} uri={message.sender?.profileUrl} />
        </Pressable>
      )}
    </View>
  );
};

const styles = createStyleSheet({
  avatar: {
    width: 26,
    marginRight: 12,
  },
});

export default MessageIncomingAvatar;
