import React from 'react';
import { SendbirdBaseChannel, SendbirdFileMessage, SendbirdFileMessageCreateParams, SendbirdFileMessageUpdateParams, SendbirdMember, SendbirdUserMessage, SendbirdUserMessageCreateParams, SendbirdUserMessageUpdateParams } from '@sendbird/uikit-utils';
import type { FileType } from '../../platform/types';
import type { MentionedUser, Range } from '../../types';
type UserMessageMentionParams = Required<{
    messageTemplate: SendbirdUserMessageCreateParams['mentionedMessageTemplate'];
    userIds: SendbirdUserMessageCreateParams['mentionedUserIds'];
    type: SendbirdUserMessageCreateParams['mentionType'];
}>;
export type SuggestedMentionListProps = {
    text: string;
    selection: Range;
    topInset: number;
    bottomInset: number;
    inputHeight: number;
    onPressToMention: (user: SendbirdMember, searchStringRange: Range) => void;
    mentionedUsers: MentionedUser[];
};
export type ChannelInputProps = {
    channel: SendbirdBaseChannel;
    shouldRenderInput: boolean;
    keyboardAvoidOffset: number;
    onPressSendUserMessage: (params: SendbirdUserMessageCreateParams) => Promise<void>;
    onPressSendFileMessage: (params: SendbirdFileMessageCreateParams) => Promise<void>;
    onPressUpdateUserMessage: (message: SendbirdUserMessage, params: SendbirdUserMessageUpdateParams) => Promise<void>;
    onPressUpdateFileMessage: (message: SendbirdFileMessage, params: SendbirdFileMessageUpdateParams) => Promise<void>;
    inputFrozen: boolean;
    inputMuted: boolean;
    inputDisabled: boolean;
    messageToEdit: undefined | SendbirdUserMessage | SendbirdFileMessage;
    setMessageToEdit: (message?: undefined | SendbirdUserMessage | SendbirdFileMessage) => void;
    SuggestedMentionList?: (props: SuggestedMentionListProps) => JSX.Element | null;
    /** @deprecated Please use `onPressSendUserMessage` **/
    onSendFileMessage?: (file: FileType) => Promise<void>;
    /** @deprecated Please use `onPressSendFileMessage` **/
    onSendUserMessage?: (text: string, mention?: UserMessageMentionParams) => Promise<void>;
    /** @deprecated Please use `onPressUpdateUserMessage` **/
    onUpdateFileMessage?: (editedFile: FileType, message: SendbirdFileMessage) => Promise<void>;
    /** @deprecated Please use `onPressUpdateFileMessage` **/
    onUpdateUserMessage?: (editedText: string, message: SendbirdUserMessage, mention?: UserMessageMentionParams) => Promise<void>;
};
declare const _default: React.MemoExoticComponent<(props: ChannelInputProps) => JSX.Element>;
export default _default;
