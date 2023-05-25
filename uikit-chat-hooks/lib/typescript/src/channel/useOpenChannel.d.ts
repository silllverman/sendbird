import { SendbirdChatSDK } from '@sendbird/uikit-utils';
export declare const useOpenChannel: (sdk: SendbirdChatSDK, channelUrl: string) => {
    channel: import("@sendbird/chat/openChannel").OpenChannel | undefined;
    loading: boolean;
    error: unknown;
};
