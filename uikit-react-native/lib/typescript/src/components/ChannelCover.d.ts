import type { StyleProp, ViewStyle } from 'react-native';
import { SendbirdBaseChannel } from '@sendbird/uikit-utils';
type Props = {
    channel: SendbirdBaseChannel;
    size: number;
    containerStyle?: StyleProp<ViewStyle>;
};
declare const ChannelCover: ({ channel, ...avatarProps }: Props) => JSX.Element;
export default ChannelCover;
