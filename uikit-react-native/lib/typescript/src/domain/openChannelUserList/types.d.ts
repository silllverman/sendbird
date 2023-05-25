import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';
import type { SendbirdOpenChannel, SendbirdParticipant, SendbirdUser } from '@sendbird/uikit-utils';
import type { CommonComponent } from '../../types';
import type { UserListProps } from '../userList/types';
export interface OpenChannelParticipantsProps {
    Fragment: {
        channel: SendbirdOpenChannel;
        onPressHeaderLeft: () => void;
        renderUser?: UserListProps<SendbirdParticipant>['List']['renderUser'];
        queryCreator?: UseUserListOptions<SendbirdUser | SendbirdParticipant>['queryCreator'];
        sortComparator?: UseUserListOptions<SendbirdUser | SendbirdParticipant>['sortComparator'];
    };
}
export type OpenChannelParticipantsFragment = CommonComponent<OpenChannelParticipantsProps['Fragment']>;
export interface OpenChannelRegisterOperatorProps {
    Fragment: {
        channel: SendbirdOpenChannel;
        onPressHeaderLeft: () => void;
        onPressHeaderRight: (channel: SendbirdOpenChannel) => void;
        renderUser?: UserListProps<SendbirdParticipant>['List']['renderUser'];
        queryCreator?: UseUserListOptions<SendbirdUser | SendbirdParticipant>['queryCreator'];
        sortComparator?: UseUserListOptions<SendbirdUser | SendbirdParticipant>['sortComparator'];
    };
}
export type OpenChannelRegisterOperatorFragment = CommonComponent<OpenChannelRegisterOperatorProps['Fragment']>;
