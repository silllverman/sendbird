import type { SendbirdFileMessage } from '@sendbird/uikit-utils';
import type { OpenChannelMessageProps } from './index';
type Props = {
    fetchThumbnailFromVideoSource: (uri: string) => Promise<{
        path: string;
    } | null>;
};
declare const VideoFileMessage: (props: OpenChannelMessageProps<SendbirdFileMessage, Props>) => JSX.Element;
export default VideoFileMessage;
