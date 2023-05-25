import React, { Ref } from 'react';
import { FlatList, FlatListProps } from 'react-native';
import { SendbirdFileMessage, SendbirdGroupChannel, SendbirdMessage, SendbirdOpenChannel, SendbirdUserMessage } from '@sendbird/uikit-utils';
import type { UserProfileContextType } from '../../contexts/UserProfileCtx';
import type { CommonComponent } from '../../types';
type HandleableMessage = SendbirdUserMessage | SendbirdFileMessage;
export type ChannelMessageListProps<T extends SendbirdGroupChannel | SendbirdOpenChannel> = {
    enableMessageGrouping: boolean;
    currentUserId?: string;
    channel: T;
    messages: SendbirdMessage[];
    newMessages: SendbirdMessage[];
    searchItem?: {
        startingPoint: number;
    };
    scrolledAwayFromBottom: boolean;
    onScrolledAwayFromBottom: (value: boolean) => void;
    onTopReached: () => void;
    onBottomReached: () => void;
    hasNext: () => boolean;
    onPressNewMessagesButton: (animated?: boolean) => void;
    onPressScrollToBottomButton: (animated?: boolean) => void;
    onEditMessage: (message: HandleableMessage) => void;
    onDeleteMessage: (message: HandleableMessage) => Promise<void>;
    onResendFailedMessage: (failedMessage: HandleableMessage) => Promise<void>;
    onPressMessageAvatar:(sender:Sender) => void;
    onPressMediaMessage?: (message: SendbirdFileMessage, deleteMessage: () => Promise<void>, uri: string) => void;
    renderMessage: (props: {
        focused: boolean;
        message: SendbirdMessage;
        prevMessage?: SendbirdMessage;
        nextMessage?: SendbirdMessage;
        onPress?: () => void;
        onLongPress?: () => void;
        onPressMessageAvatar:(sender:Sender) => void;
        channel: T;
        currentUserId?: ChannelMessageListProps<T>['currentUserId'];
        enableMessageGrouping: ChannelMessageListProps<T>['enableMessageGrouping'];
    }) => React.ReactElement | null;
    renderNewMessagesButton: null | CommonComponent<{
        visible: boolean;
        onPress: () => void;
        newMessages: SendbirdMessage[];
    }>;
    renderScrollToBottomButton: null | CommonComponent<{
        visible: boolean;
        onPress: () => void;
    }>;
    flatListProps?: Omit<FlatListProps<SendbirdMessage>, 'data' | 'renderItem'>;
    /** @deprecated Please use `onPressMediaMessage` instead **/
    onPressImageMessage?: (message: SendbirdFileMessage, uri: string) => void;
} & {
    ref?: Ref<FlatList<SendbirdMessage>> | undefined;
};
declare const _default: <T extends import("@sendbird/chat/openChannel").OpenChannel | import("@sendbird/chat/groupChannel").GroupChannel>({ searchItem, hasNext, channel, onEditMessage, onDeleteMessage, onResendFailedMessage, onPressMediaMessage, currentUserId, renderNewMessagesButton, renderScrollToBottomButton, renderMessage, messages, newMessages, enableMessageGrouping, onScrolledAwayFromBottom, scrolledAwayFromBottom, onBottomReached, onTopReached, flatListProps, onPressNewMessagesButton, onPressScrollToBottomButton, onPressImageMessage, }: ChannelMessageListProps<T>, ref: React.ForwardedRef<FlatList<SendbirdMessage>>) => JSX.Element;
export default _default;
