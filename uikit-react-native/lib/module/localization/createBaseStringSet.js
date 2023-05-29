import { getDateSeparatorFormat, getGroupChannelLastMessage, getGroupChannelPreviewTime, getGroupChannelTitle, getMessagePreviewBody, getMessagePreviewTime, getMessagePreviewTitle, getMessageTimeFormat, getOpenChannelParticipants, getOpenChannelTitle } from '@sendbird/uikit-utils';
/**
 * Create string set
 * You can create localized String set, you should provide locale for date and string as a parameters
 *
 * @param {StringSetCreateOptions.dateLocale} dateLocale Date locale (from date-fns)
 * @param {StringSetCreateOptions.overrides} [overrides] Localized strings
 * */
export const createBaseStringSet = _ref => {
  var _overrides$LABELS, _overrides$LABELS2, _overrides$GROUP_CHAN, _overrides$OPEN_CHANN, _overrides$GROUP_CHAN2, _overrides$GROUP_CHAN3, _overrides$GROUP_CHAN4, _overrides$GROUP_CHAN5, _overrides$GROUP_CHAN6, _overrides$GROUP_CHAN7, _overrides$GROUP_CHAN8, _overrides$GROUP_CHAN9, _overrides$GROUP_CHAN10, _overrides$GROUP_CHAN11, _overrides$GROUP_CHAN12, _overrides$GROUP_CHAN13, _overrides$GROUP_CHAN14, _overrides$GROUP_CHAN15, _overrides$GROUP_CHAN16, _overrides$GROUP_CHAN17, _overrides$GROUP_CHAN18, _overrides$PLACEHOLDE;
  let {
    dateLocale,
    overrides
  } = _ref;
  const USER_NO_NAME = (overrides === null || overrides === void 0 ? void 0 : (_overrides$LABELS = overrides.LABELS) === null || _overrides$LABELS === void 0 ? void 0 : _overrides$LABELS.USER_NO_NAME) ?? 'Satoshi';
  const CHANNEL_NO_MEMBERS = (overrides === null || overrides === void 0 ? void 0 : (_overrides$LABELS2 = overrides.LABELS) === null || _overrides$LABELS2 === void 0 ? void 0 : _overrides$LABELS2.CHANNEL_NO_MEMBERS) ?? 'Satoshi';
  return {
    OPEN_CHANNEL: {
      HEADER_TITLE: channel => getOpenChannelTitle(channel),
      HEADER_SUBTITLE: channel => getOpenChannelParticipants(channel),
      LIST_DATE_SEPARATOR: (date, locale) => getDateSeparatorFormat(date, locale ?? dateLocale),
      MESSAGE_BUBBLE_TIME: (message, locale) => getMessageTimeFormat(new Date(message.createdAt), locale ?? dateLocale),
      MESSAGE_BUBBLE_FILE_TITLE: message => message.name,
      MESSAGE_BUBBLE_EDITED_POSTFIX: ' (edited)',
      MESSAGE_BUBBLE_UNKNOWN_TITLE: () => '(Unknown message type)',
      MESSAGE_BUBBLE_UNKNOWN_DESC: () => 'Cannot read this message.',
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_LIST_FROZEN **/
      LIST_BANNER_FROZEN: 'Channel is frozen',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.OPEN_CHANNEL)
    },
    OPEN_CHANNEL_PARTICIPANTS: {
      HEADER_TITLE: 'Participants',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.OPEN_CHANNEL_PARTICIPANTS)
    },
    OPEN_CHANNEL_SETTINGS: {
      HEADER_TITLE: 'Channel information',
      HEADER_RIGHT: 'Edit',
      INFO_URL: 'URL',
      MENU_MODERATION: 'Moderation',
      MENU_PARTICIPANTS: 'Participants',
      MENU_DELETE_CHANNEL: 'Delete channel',
      DIALOG_CHANNEL_DELETE_CONFIRM_TITLE: 'Delete channel?',
      DIALOG_CHANNEL_DELETE_CONFIRM_OK: 'Delete',
      DIALOG_CHANNEL_DELETE_CONFIRM_CANCEL: 'Cancel',
      DIALOG_CHANGE_NAME: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_TITLE: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_PLACEHOLDER: 'Enter name',
      DIALOG_CHANGE_NAME_PROMPT_OK: 'Save',
      DIALOG_CHANGE_NAME_PROMPT_CANCEL: 'Cancel',
      DIALOG_CHANGE_IMAGE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_TITLE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_CAMERA: 'Take photo',
      DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY: 'Choose photo',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.OPEN_CHANNEL_SETTINGS)
    },
    OPEN_CHANNEL_LIST: {
      HEADER_TITLE: 'Channels',
      CHANNEL_PREVIEW_TITLE: channel => getOpenChannelTitle(channel),
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.OPEN_CHANNEL_LIST)
    },
    OPEN_CHANNEL_CREATE: {
      HEADER_TITLE: 'New channel',
      HEADER_RIGHT: 'Create',
      PLACEHOLDER: 'Enter channel name',
      DIALOG_IMAGE_MENU_REMOVE: 'Remove photo',
      DIALOG_IMAGE_MENU_CAMERA: 'Take photo',
      DIALOG_IMAGE_MENU_PHOTO_LIBRARY: 'Choose photo',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.OPEN_CHANNEL_CREATE)
    },
    OPEN_CHANNEL_MODERATION: {
      HEADER_TITLE: 'Moderation',
      MENU_OPERATORS: 'Operators',
      MENU_MUTED_PARTICIPANTS: 'Muted participants',
      MENU_BANNED_USERS: 'Banned users',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.OPEN_CHANNEL_MODERATION)
    },
    OPEN_CHANNEL_BANNED_USERS: {
      HEADER_TITLE: 'Banned users',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.OPEN_CHANNEL_BANNED_USERS)
    },
    OPEN_CHANNEL_MUTED_PARTICIPANTS: {
      HEADER_TITLE: 'Muted participants',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.OPEN_CHANNEL_MUTED_PARTICIPANTS)
    },
    OPEN_CHANNEL_OPERATORS: {
      HEADER_TITLE: 'Operators',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.OPEN_CHANNEL_OPERATORS)
    },
    OPEN_CHANNEL_REGISTER_OPERATOR: {
      HEADER_TITLE: 'Set as operators',
      HEADER_RIGHT: _ref2 => {
        let {
          selectedUsers
        } = _ref2;
        const len = selectedUsers.length;
        if (len === 0) return 'Add';
        return `Add (${len})`;
      },
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.OPEN_CHANNEL_REGISTER_OPERATOR)
    },
    GROUP_CHANNEL: {
      HEADER_TITLE: (uid, channel) => getGroupChannelTitle(uid, channel, USER_NO_NAME, CHANNEL_NO_MEMBERS),
      LIST_DATE_SEPARATOR: (date, locale) => getDateSeparatorFormat(date, locale ?? dateLocale),
      LIST_BUTTON_NEW_MSG: newMessages => `${newMessages.length} new messages`,
      MESSAGE_BUBBLE_TIME: (message, locale) => getMessageTimeFormat(new Date(message.createdAt), locale ?? dateLocale),
      MESSAGE_BUBBLE_FILE_TITLE: message => message.name,
      MESSAGE_BUBBLE_EDITED_POSTFIX: ' (edited)',
      MESSAGE_BUBBLE_UNKNOWN_TITLE: () => '(Unknown message type)',
      MESSAGE_BUBBLE_UNKNOWN_DESC: () => 'Cannot read this message.',
      MENTION_LIMITED: mentionLimit => `You can have up to ${mentionLimit} mentions per message.`,
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_LIST_FROZEN **/
      LIST_BANNER_FROZEN: 'Channel is frozen',
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_COPY **/
      DIALOG_MESSAGE_COPY: 'Copy',
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_EDIT **/
      DIALOG_MESSAGE_EDIT: 'Edit',
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_SAVE **/
      DIALOG_MESSAGE_SAVE: 'Save',
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_DELETE **/
      DIALOG_MESSAGE_DELETE: 'Delete',
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE **/
      DIALOG_MESSAGE_DELETE_CONFIRM_TITLE: 'Delete message?',
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_OK **/
      DIALOG_MESSAGE_DELETE_CONFIRM_OK: 'Delete',
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL **/
      DIALOG_MESSAGE_DELETE_CONFIRM_CANCEL: 'Cancel',
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_FAILED_RETRY **/
      DIALOG_MESSAGE_FAILED_RETRY: 'Retry',
      /** @deprecated Please use LABELS.CHANNEL_MESSAGE_FAILED_REMOVE **/
      DIALOG_MESSAGE_FAILED_REMOVE: 'Remove',
      /** @deprecated Please use LABELS.CHANNEL_INPUT_ATTACHMENT_CAMERA **/
      DIALOG_ATTACHMENT_CAMERA: 'Camera',
      /** @deprecated Please use LABELS.CHANNEL_INPUT_ATTACHMENT_PHOTO_LIBRARY **/
      DIALOG_ATTACHMENT_PHOTO_LIBRARY: 'Photo library',
      /** @deprecated Please use LABELS.CHANNEL_INPUT_ATTACHMENT_FILES **/
      DIALOG_ATTACHMENT_FILES: 'Files',
      /** @deprecated Please use LABELS.CHANNEL_INPUT_PLACEHOLDER_ACTIVE **/
      INPUT_PLACEHOLDER_ACTIVE: 'Enter message',
      /** @deprecated Please use LABELS.CHANNEL_INPUT_PLACEHOLDER_DISABLED **/
      INPUT_PLACEHOLDER_DISABLED: 'Chat not available in this channel.',
      /** @deprecated Please use LABELS.CHANNEL_INPUT_PLACEHOLDER_MUTED **/
      INPUT_PLACEHOLDER_MUTED: "You're muted by the operator.",
      /** @deprecated Please use LABELS.CHANNEL_INPUT_EDIT_OK **/
      INPUT_EDIT_OK: 'Save',
      /** @deprecated Please use LABELS.CHANNEL_INPUT_EDIT_CANCEL **/
      INPUT_EDIT_CANCEL: 'Cancel',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL)
    },
    GROUP_CHANNEL_SETTINGS: {
      HEADER_TITLE: 'Channel information',
      HEADER_RIGHT: 'Edit',
      MENU_MODERATION: 'Moderation',
      MENU_MEMBERS: 'Members',
      MENU_SEARCH: 'Search in channel',
      MENU_LEAVE_CHANNEL: 'Leave channel',
      MENU_NOTIFICATION: 'Notifications',
      MENU_NOTIFICATION_LABEL_ON: 'On',
      MENU_NOTIFICATION_LABEL_OFF: 'Off',
      MENU_NOTIFICATION_LABEL_MENTION_ONLY: 'Mentions only',
      DIALOG_CHANGE_NAME: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_TITLE: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_PLACEHOLDER: 'Enter name',
      DIALOG_CHANGE_NAME_PROMPT_OK: 'Save',
      DIALOG_CHANGE_NAME_PROMPT_CANCEL: 'Cancel',
      DIALOG_CHANGE_IMAGE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_TITLE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_CAMERA: 'Take photo',
      DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY: 'Choose photo',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_SETTINGS)
    },
    GROUP_CHANNEL_NOTIFICATIONS: {
      HEADER_TITLE: 'Notifications',
      MENU_NOTIFICATIONS: 'Notifications',
      MENU_NOTIFICATIONS_DESC: 'Turn on push notifications if you wish to be notified when messages are delivered to this channel.',
      MENU_NOTIFICATIONS_OPTION_ALL: 'All new messages',
      MENU_NOTIFICATIONS_OPTION_MENTION_ONLY: 'Mentions only',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_NOTIFICATIONS)
    },
    GROUP_CHANNEL_MODERATION: {
      HEADER_TITLE: 'Moderation',
      MENU_OPERATORS: 'Operators',
      MENU_MUTED_MEMBERS: 'Muted members',
      MENU_BANNED_USERS: 'Banned users',
      MENU_FREEZE_CHANNEL: 'Freeze channel',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_MODERATION)
    },
    GROUP_CHANNEL_OPERATORS: {
      HEADER_TITLE: 'Operators',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_OPERATORS)
    },
    GROUP_CHANNEL_REGISTER_OPERATOR: {
      HEADER_TITLE: 'Set as operators',
      HEADER_RIGHT: _ref3 => {
        let {
          selectedUsers
        } = _ref3;
        const len = selectedUsers.length;
        if (len === 0) return 'Add';
        return `Add (${len})`;
      },
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_OPERATORS)
    },
    GROUP_CHANNEL_MUTED_MEMBERS: {
      HEADER_TITLE: 'Muted members',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_MUTED_MEMBERS)
    },
    GROUP_CHANNEL_BANNED_USERS: {
      HEADER_TITLE: 'Banned users',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_BANNED_USERS)
    },
    GROUP_CHANNEL_LIST: {
      HEADER_TITLE: 'Channels',
      CHANNEL_PREVIEW_TITLE: (currentUserId, channel) => getGroupChannelTitle(currentUserId, channel, USER_NO_NAME, CHANNEL_NO_MEMBERS),
      CHANNEL_PREVIEW_TITLE_CAPTION: (channel, locale) => getGroupChannelPreviewTime(channel, locale ?? dateLocale),
      CHANNEL_PREVIEW_BODY: channel => getGroupChannelLastMessage(channel),
      TYPE_SELECTOR_HEADER_TITLE: 'Channel type',
      TYPE_SELECTOR_GROUP: 'Group',
      TYPE_SELECTOR_SUPER_GROUP: 'Super group',
      TYPE_SELECTOR_BROADCAST: 'Broadcast',
      DIALOG_CHANNEL_TITLE: (currentUserId, channel) => getGroupChannelTitle(currentUserId, channel, USER_NO_NAME, CHANNEL_NO_MEMBERS),
      DIALOG_CHANNEL_NOTIFICATION: channel => {
        if (!channel) return '';
        if (channel.myPushTriggerOption === 'off') return 'Turn on notifications';
        return 'Turn off notifications';
      },
      DIALOG_CHANNEL_LEAVE: 'Leave channel',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_LIST)
    },
    GROUP_CHANNEL_MEMBERS: {
      HEADER_TITLE: 'Members',
      /** @deprecated Please use LABELS.USER_BAR_ME_POSTFIX **/
      USER_BAR_ME_POSTFIX: ' (You)',
      /** @deprecated Please use LABELS.USER_BAR_OPERATOR **/
      USER_BAR_OPERATOR: 'Operator',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_MEMBERS)
    },
    GROUP_CHANNEL_CREATE: {
      HEADER_TITLE: 'New channel',
      HEADER_RIGHT: _ref4 => {
        let {
          selectedUsers
        } = _ref4;
        const len = selectedUsers.length;
        if (len === 0) return 'Create';
        return `Create (${len})`;
      },
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_CREATE)
    },
    GROUP_CHANNEL_INVITE: {
      HEADER_TITLE: 'Invite users',
      HEADER_RIGHT: _ref5 => {
        let {
          selectedUsers
        } = _ref5;
        const len = selectedUsers.length;
        if (len === 0) return 'Invite';
        return `Invite (${len})`;
      },
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.GROUP_CHANNEL_INVITE)
    },
    MESSAGE_SEARCH: {
      HEADER_INPUT_PLACEHOLDER: 'Search',
      HEADER_RIGHT: 'Search',
      SEARCH_RESULT_ITEM_TITLE: message => getMessagePreviewTitle(message),
      SEARCH_RESULT_ITEM_BODY: message => getMessagePreviewBody(message),
      SEARCH_RESULT_ITEM_TITLE_CAPTION: (message, locale) => {
        return getMessagePreviewTime(message.createdAt, locale ?? dateLocale);
      }
    },
    LABELS: {
      PERMISSION_APP_NAME: 'Application',
      PERMISSION_CAMERA: 'camera',
      PERMISSION_DEVICE_STORAGE: 'device storage',
      USER_NO_NAME,
      CHANNEL_NO_MEMBERS,
      TYPING_INDICATOR_TYPINGS: function (users) {
        let NO_NAME = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : USER_NO_NAME;
        const userNames = users.map(u => u.nickname || NO_NAME);
        if (userNames.length === 0) return;
        if (userNames.length === 1) return `${userNames[0]} is typing...`;
        if (users.length === 2) return `${userNames.join(' and ')} are typing...`;
        return 'Several people are typing...';
      },
      USER_BAR_ME_POSTFIX: ' (You)',
      USER_BAR_OPERATOR: 'Operator',
      REGISTER_AS_OPERATOR: 'Register as operator',
      UNREGISTER_OPERATOR: 'Unregister operator',
      MUTE: 'Mute',
      UNMUTE: 'Unmute',
      BAN: 'Ban',
      UNBAN: 'Unban',
      // Deprecation backward
      CHANNEL_MESSAGE_LIST_FROZEN: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN === void 0 ? void 0 : _overrides$GROUP_CHAN.LIST_BANNER_FROZEN) ?? (overrides === null || overrides === void 0 ? void 0 : (_overrides$OPEN_CHANN = overrides.OPEN_CHANNEL) === null || _overrides$OPEN_CHANN === void 0 ? void 0 : _overrides$OPEN_CHANN.LIST_BANNER_FROZEN) ?? 'Channel is frozen',
      CHANNEL_MESSAGE_COPY: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN2 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN2 === void 0 ? void 0 : _overrides$GROUP_CHAN2.DIALOG_MESSAGE_COPY) ?? 'Copy',
      CHANNEL_MESSAGE_EDIT: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN3 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN3 === void 0 ? void 0 : _overrides$GROUP_CHAN3.DIALOG_MESSAGE_EDIT) ?? 'Edit',
      CHANNEL_MESSAGE_SAVE: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN4 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN4 === void 0 ? void 0 : _overrides$GROUP_CHAN4.DIALOG_MESSAGE_SAVE) ?? 'Save',
      CHANNEL_MESSAGE_DELETE: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN5 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN5 === void 0 ? void 0 : _overrides$GROUP_CHAN5.DIALOG_MESSAGE_DELETE) ?? 'Delete',
      CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN6 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN6 === void 0 ? void 0 : _overrides$GROUP_CHAN6.DIALOG_MESSAGE_DELETE_CONFIRM_TITLE) ?? 'Delete message?',
      CHANNEL_MESSAGE_DELETE_CONFIRM_OK: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN7 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN7 === void 0 ? void 0 : _overrides$GROUP_CHAN7.DIALOG_MESSAGE_DELETE_CONFIRM_OK) ?? 'Delete',
      CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN8 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN8 === void 0 ? void 0 : _overrides$GROUP_CHAN8.DIALOG_MESSAGE_DELETE_CONFIRM_CANCEL) ?? 'Cancel',
      CHANNEL_MESSAGE_FAILED_RETRY: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN9 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN9 === void 0 ? void 0 : _overrides$GROUP_CHAN9.DIALOG_MESSAGE_FAILED_RETRY) ?? 'Retry',
      CHANNEL_MESSAGE_FAILED_REMOVE: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN10 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN10 === void 0 ? void 0 : _overrides$GROUP_CHAN10.DIALOG_MESSAGE_FAILED_REMOVE) ?? 'Remove',
      CHANNEL_INPUT_ATTACHMENT_CAMERA: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN11 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN11 === void 0 ? void 0 : _overrides$GROUP_CHAN11.DIALOG_ATTACHMENT_CAMERA) ?? 'Camera',
      CHANNEL_INPUT_ATTACHMENT_PHOTO_LIBRARY: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN12 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN12 === void 0 ? void 0 : _overrides$GROUP_CHAN12.DIALOG_ATTACHMENT_PHOTO_LIBRARY) ?? 'Photo library',
      CHANNEL_INPUT_ATTACHMENT_FILES: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN13 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN13 === void 0 ? void 0 : _overrides$GROUP_CHAN13.DIALOG_ATTACHMENT_FILES) ?? 'Files',
      CHANNEL_INPUT_PLACEHOLDER_ACTIVE: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN14 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN14 === void 0 ? void 0 : _overrides$GROUP_CHAN14.INPUT_PLACEHOLDER_ACTIVE) ?? 'Enter message',
      CHANNEL_INPUT_PLACEHOLDER_DISABLED: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN15 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN15 === void 0 ? void 0 : _overrides$GROUP_CHAN15.INPUT_PLACEHOLDER_DISABLED) ?? 'Chat not available in this channel.',
      CHANNEL_INPUT_PLACEHOLDER_MUTED: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN16 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN16 === void 0 ? void 0 : _overrides$GROUP_CHAN16.INPUT_PLACEHOLDER_MUTED) ?? "You're muted by the operator.",
      CHANNEL_INPUT_EDIT_OK: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN17 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN17 === void 0 ? void 0 : _overrides$GROUP_CHAN17.INPUT_EDIT_OK) ?? 'Save',
      CHANNEL_INPUT_EDIT_CANCEL: (overrides === null || overrides === void 0 ? void 0 : (_overrides$GROUP_CHAN18 = overrides.GROUP_CHANNEL) === null || _overrides$GROUP_CHAN18 === void 0 ? void 0 : _overrides$GROUP_CHAN18.INPUT_EDIT_CANCEL) ?? 'Cancel',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.LABELS)
    },
    FILE_VIEWER: {
      TITLE: message => {
        var _message$sender;
        return ((_message$sender = message.sender) === null || _message$sender === void 0 ? void 0 : _message$sender.nickname) || USER_NO_NAME;
      },
      SUBTITLE: message => getMessageTimeFormat(new Date(message.createdAt), dateLocale)
    },
    PLACEHOLDER: {
      NO_BANNED_USERS: 'No banned users',
      NO_USERS: 'No users',
      NO_CHANNELS: 'No channels',
      NO_MESSAGES: 'No messages',
      NO_MUTED_MEMBERS: 'No muted members',
      NO_MUTED_PARTICIPANTS: 'No muted participants',
      NO_RESULTS_FOUND: 'No results found',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.PLACEHOLDER),
      ERROR: {
        MESSAGE: 'Something went wrong',
        RETRY_LABEL: 'Retry',
        ...(overrides === null || overrides === void 0 ? void 0 : (_overrides$PLACEHOLDE = overrides.PLACEHOLDER) === null || _overrides$PLACEHOLDE === void 0 ? void 0 : _overrides$PLACEHOLDE.ERROR)
      }
    },
    DIALOG: {
      ALERT_DEFAULT_OK: 'OK',
      ALERT_PERMISSIONS_TITLE: 'Allow access?',
      ALERT_PERMISSIONS_MESSAGE: function (permission) {
        let appName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Application';
        return `${appName} need permission to access your ${permission}.`;
      },
      ALERT_PERMISSIONS_OK: 'Go to settings',
      PROMPT_DEFAULT_OK: 'Submit',
      PROMPT_DEFAULT_CANCEL: 'Cancel',
      PROMPT_DEFAULT_PLACEHOLDER: 'Enter',
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.DIALOG)
    },
    TOAST: {
      COPY_OK: 'Copied',
      DOWNLOAD_START: 'Downloading...',
      DOWNLOAD_OK: 'File saved',
      DOWNLOAD_ERROR: "Couldn't download file.",
      OPEN_CAMERA_ERROR: "Couldn't open camera.",
      OPEN_FILES_ERROR: "Couldn't open files.",
      OPEN_PHOTO_LIBRARY_ERROR: "Couldn't open photo library.",
      DELETE_MSG_ERROR: "Couldn't delete message.",
      RESEND_MSG_ERROR: "Couldn't send message.",
      SEND_MSG_ERROR: "Couldn't send message.",
      UPDATE_MSG_ERROR: "Couldn't edit message.",
      TURN_ON_NOTIFICATIONS_ERROR: "Couldn't turn on notifications.",
      TURN_OFF_NOTIFICATIONS_ERROR: "Couldn't turn off notifications.",
      LEAVE_CHANNEL_ERROR: "Couldn't leave channel.",
      UNKNOWN_ERROR: 'Something went wrong.',
      GET_CHANNEL_ERROR: "Couldn't retrieve channel.",
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.TOAST)
    },
    PROFILE_CARD: {
      BUTTON_MESSAGE: 'Message',
      BODY_LABEL: 'User ID',
      BODY: user => user.userId,
      ...(overrides === null || overrides === void 0 ? void 0 : overrides.PROFILE_CARD)
    }
  };
};
//# sourceMappingURL=createBaseStringSet.js.map