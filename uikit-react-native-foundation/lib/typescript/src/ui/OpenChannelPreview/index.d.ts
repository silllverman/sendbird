import React from 'react';
type Props = {
    customCover?: React.ReactElement;
    coverUrl: string;
    title: string;
    participantsCount?: number;
    frozen?: boolean;
};
declare const OpenChannelPreview: ({ customCover, coverUrl, participantsCount, title, frozen }: Props) => JSX.Element;
export default OpenChannelPreview;
