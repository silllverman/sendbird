import React from 'react';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
declare const _default: React.MemoExoticComponent<(props: Pick<import("../../../components/ChannelMessageList").ChannelMessageListProps<import("@sendbird/chat/groupChannel").GroupChannel>, "channel" | "onTopReached" | "onBottomReached" | "onScrolledAwayFromBottom" | "currentUserId" | "enableMessageGrouping" | "searchItem" | "hasNext" | "onDeleteMessage" | "onResendFailedMessage" | "onPressMediaMessage" | "renderNewMessagesButton" | "renderScrollToBottomButton" | "renderMessage" | "messages" | "newMessages" | "scrolledAwayFromBottom" | "flatListProps" | "onPressImageMessage"> & {
    onResetMessageList: (callback?: (() => void) | undefined) => void;
    newMessagesFromMembers: SendbirdMessage[];
    nextMessages: SendbirdMessage[];
}) => JSX.Element>;
export default _default;
