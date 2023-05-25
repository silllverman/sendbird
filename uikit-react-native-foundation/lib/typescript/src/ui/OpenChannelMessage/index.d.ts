import type React from 'react';
import type { SendbirdMessage, SendbirdOpenChannel } from '@sendbird/uikit-utils';
export type OpenChannelMessageProps<T extends SendbirdMessage, AdditionalProps = unknown> = {
    channel: SendbirdOpenChannel;
    message: T;
    strings?: {
        senderName?: string;
        sentDate?: string;
        edited?: string;
        fileName?: string;
        unknownTitle?: string;
        unknownDescription?: string;
    };
    children?: React.ReactNode;
    grouped?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    onPressAvatar?: () => void;
    onPressURL?: () => void;
} & AdditionalProps;
declare const OpenChannelMessage: {
    User: (props: {
        channel: SendbirdOpenChannel;
        message: import("@sendbird/chat/message").UserMessage;
        strings?: {
            senderName?: string | undefined;
            sentDate?: string | undefined;
            edited?: string | undefined;
            fileName?: string | undefined;
            unknownTitle?: string | undefined;
            unknownDescription?: string | undefined;
        } | undefined;
        children?: React.ReactNode;
        grouped?: boolean | undefined;
        onPress?: (() => void) | undefined;
        onLongPress?: (() => void) | undefined;
        onPressAvatar?: (() => void) | undefined;
        onPressURL?: (() => void) | undefined;
    }) => JSX.Element;
    OpenGraphUser: (props: {
        channel: SendbirdOpenChannel;
        message: import("@sendbird/chat/message").UserMessage;
        strings?: {
            senderName?: string | undefined;
            sentDate?: string | undefined;
            edited?: string | undefined;
            fileName?: string | undefined;
            unknownTitle?: string | undefined;
            unknownDescription?: string | undefined;
        } | undefined;
        children?: React.ReactNode;
        grouped?: boolean | undefined;
        onPress?: (() => void) | undefined;
        onLongPress?: (() => void) | undefined;
        onPressAvatar?: (() => void) | undefined;
        onPressURL?: (() => void) | undefined;
    }) => JSX.Element;
    File: (props: {
        channel: SendbirdOpenChannel;
        message: import("@sendbird/chat/message").FileMessage;
        strings?: {
            senderName?: string | undefined;
            sentDate?: string | undefined;
            edited?: string | undefined;
            fileName?: string | undefined;
            unknownTitle?: string | undefined;
            unknownDescription?: string | undefined;
        } | undefined;
        children?: React.ReactNode;
        grouped?: boolean | undefined;
        onPress?: (() => void) | undefined;
        onLongPress?: (() => void) | undefined;
        onPressAvatar?: (() => void) | undefined;
        onPressURL?: (() => void) | undefined;
    }) => JSX.Element;
    ImageFile: (props: {
        channel: SendbirdOpenChannel;
        message: import("@sendbird/chat/message").FileMessage;
        strings?: {
            senderName?: string | undefined;
            sentDate?: string | undefined;
            edited?: string | undefined;
            fileName?: string | undefined;
            unknownTitle?: string | undefined;
            unknownDescription?: string | undefined;
        } | undefined;
        children?: React.ReactNode;
        grouped?: boolean | undefined;
        onPress?: (() => void) | undefined;
        onLongPress?: (() => void) | undefined;
        onPressAvatar?: (() => void) | undefined;
        onPressURL?: (() => void) | undefined;
    }) => JSX.Element;
    VideoFile: (props: OpenChannelMessageProps<import("@sendbird/chat/message").FileMessage, {
        fetchThumbnailFromVideoSource: (uri: string) => Promise<{
            path: string;
        } | null>;
    }>) => JSX.Element;
    Admin: (props: {
        channel: SendbirdOpenChannel;
        message: import("@sendbird/chat/message").AdminMessage;
        strings?: {
            senderName?: string | undefined;
            sentDate?: string | undefined;
            edited?: string | undefined;
            fileName?: string | undefined;
            unknownTitle?: string | undefined;
            unknownDescription?: string | undefined;
        } | undefined;
        children?: React.ReactNode;
        grouped?: boolean | undefined;
        onPress?: (() => void) | undefined;
        onLongPress?: (() => void) | undefined;
        onPressAvatar?: (() => void) | undefined;
        onPressURL?: (() => void) | undefined;
    }) => JSX.Element;
    Unknown: (props: {
        channel: SendbirdOpenChannel;
        message: SendbirdMessage;
        strings?: {
            senderName?: string | undefined;
            sentDate?: string | undefined;
            edited?: string | undefined;
            fileName?: string | undefined;
            unknownTitle?: string | undefined;
            unknownDescription?: string | undefined;
        } | undefined;
        children?: React.ReactNode;
        grouped?: boolean | undefined;
        onPress?: (() => void) | undefined;
        onLongPress?: (() => void) | undefined;
        onPressAvatar?: (() => void) | undefined;
        onPressURL?: (() => void) | undefined;
    }) => JSX.Element;
};
export default OpenChannelMessage;
