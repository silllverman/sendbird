import React from 'react';
import Icon from '../../components/Icon';
type Props = {
    customCover?: React.ReactElement;
    coverUrl: string;
    title: string;
    titleCaption: string;
    titleCaptionLeft?: React.ReactElement;
    bodyIcon?: keyof typeof Icon.Assets;
    body: string;
    memberCount?: number;
    badgeCount: number;
    maxBadgeCount?: number;
    frozen?: boolean;
    notificationOff?: boolean;
    broadcast?: boolean;
    mentioned?: boolean;
    mentionTrigger?: string;
};
declare const GroupChannelPreview: ({ customCover, coverUrl, memberCount, badgeCount, maxBadgeCount, body, bodyIcon, title, titleCaption, titleCaptionLeft, frozen, notificationOff, broadcast, mentioned, mentionTrigger, }: Props) => JSX.Element;
export default GroupChannelPreview;
