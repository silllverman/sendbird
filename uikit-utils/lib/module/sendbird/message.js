import { MessageSearchOrder } from '@sendbird/chat/message';
import { getFileExtension, getFileType } from '../shared/file';
import { getMessageTimeFormat } from '../ui-format/common';
export function isNewMessage(msg, currentUserId) {
  const myMessage = isMyMessage(msg, currentUserId);
  if (myMessage) return false;
  if (msg.isAdminMessage()) return false;
  return msg.updatedAt === 0;
}
export function isSendableMessage(msg) {
  return msg !== undefined && msg !== null && 'sendingStatus' in msg;
}
export function isMyMessage(msg) {
  var _msg$sender;
  let currentUserId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '##__USER_ID_IS_NOT_PROVIDED__##';
  if (!isSendableMessage(msg)) return false;
  return 'sender' in msg && ((_msg$sender = msg.sender) === null || _msg$sender === void 0 ? void 0 : _msg$sender.userId) === currentUserId || msg.sendingStatus === 'pending' || msg.sendingStatus === 'failed' || msg.sendingStatus === 'canceled';
}
export function messageKeyExtractor(message) {
  return getMessageUniqId(message);
}

// |-------------------|-------------------|-----------------|-------------------|
// |   sending status  |       reqId       |    messageId    |     createdAt     |
// |-------------------|-------------------|-----------------|-------------------|
// |     pending       |    timestamp(A)   |        0        |    timestamp(B)   |
// |     canceled      |    timestamp(A)   |        0        |         ?         |
// |     failed        |    timestamp(A)   |        0        |         ?         |
// |     succeeded     | timestamp(A) / '' |    id from DB   |    timestamp(C)   |
// |-------------------|-------------------|-----------------|-------------------|
export function messageComparator(a, b) {
  let aStatusOffset = 0;
  let bStatusOffset = 0;
  if (isSendableMessage(a) && a.sendingStatus !== 'succeeded') aStatusOffset = 999999;
  if (isSendableMessage(b) && b.sendingStatus !== 'succeeded') bStatusOffset = 999999;
  return b.createdAt + bStatusOffset - (a.createdAt + aStatusOffset);
}
export function hasSameSender(a, b) {
  var _a$sender, _b$sender;
  if (!a || !b) return false;
  if ('sender' in a && 'sender' in b) return ((_a$sender = a.sender) === null || _a$sender === void 0 ? void 0 : _a$sender.userId) === ((_b$sender = b.sender) === null || _b$sender === void 0 ? void 0 : _b$sender.userId);
  return false;
}
export function calcMessageGrouping(groupEnabled, curr, prev, next) {
  const getPrev = () => {
    if (!groupEnabled) return false;
    if (!prev) return false;
    if (curr.isAdminMessage()) return false;
    if (!hasSameSender(curr, prev)) return false;
    if (getMessageTimeFormat(new Date(curr.createdAt)) !== getMessageTimeFormat(new Date(prev.createdAt))) return false;
    return true;
  };
  const getNext = () => {
    if (!groupEnabled) return false;
    if (!next) return false;
    if (curr.isAdminMessage()) return false;
    if (!hasSameSender(curr, next)) return false;
    if (getMessageTimeFormat(new Date(curr.createdAt)) !== getMessageTimeFormat(new Date(next.createdAt))) return false;
    return true;
  };
  return {
    groupWithPrev: getPrev(),
    groupWithNext: getNext()
  };
}
export function getMessageUniqId(msg) {
  if (msg.isUserMessage() || msg.isFileMessage()) {
    if (msg.sendingStatus === 'succeeded') return String(msg.messageId);
    return msg.reqId;
  }
  return String(msg.messageId);
}
export function getAvailableUriFromFileMessage(message) {
  if (!message.url && message.messageParams.file && 'uri' in message.messageParams.file) {
    return message.messageParams.file.uri;
  }
  return message.url;
}
export function isSendbirdNotification(dataPayload) {
  if (!dataPayload) return false;
  return Boolean(dataPayload['sendbird']);
}
export function parseSendbirdNotification(dataPayload) {
  return typeof dataPayload.sendbird === 'string' ? JSON.parse(dataPayload.sendbird) : dataPayload.sendbird;
}
export function shouldRenderReaction(channel, reactionEnabled) {
  if (channel.isOpenChannel()) {
    return false;
  }
  if (channel.isGroupChannel()) {
    if (channel.isBroadcast) return false;
    if (channel.isSuper) return false;
  }
  return reactionEnabled;
}
export function getReactionCount(reaction) {
  return reaction.userIds.length;
}
export function getFileTypeFromMessage(message) {
  return getFileType(message.type || getFileExtension(message.name));
}
export function getMessageType(message) {
  if (message.isAdminMessage()) {
    return 'admin';
  }
  if (message.isUserMessage()) {
    if (message.ogMetaData) {
      return 'user.opengraph';
    }
    return 'user';
  }
  if (message.isFileMessage()) {
    const fileType = getFileTypeFromMessage(message);
    switch (fileType) {
      case 'image':
      case 'video':
        {
          return `file.${fileType}`;
        }
      case 'audio':
        {
          return `file.${fileType}`;
        }
      default:
        {
          return 'file';
        }
    }
  }
  return 'unknown';
}
export function getDefaultMessageSearchQueryParams(channel, keyword) {
  return {
    keyword,
    channelUrl: channel.url,
    messageTimestampFrom: Math.max(channel.joinedAt, channel.invitedAt),
    order: MessageSearchOrder.TIMESTAMP
  };
}
//# sourceMappingURL=message.js.map