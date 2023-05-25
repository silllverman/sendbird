"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcMessageGrouping = calcMessageGrouping;
exports.getAvailableUriFromFileMessage = getAvailableUriFromFileMessage;
exports.getDefaultMessageSearchQueryParams = getDefaultMessageSearchQueryParams;
exports.getFileTypeFromMessage = getFileTypeFromMessage;
exports.getMessageType = getMessageType;
exports.getMessageUniqId = getMessageUniqId;
exports.getReactionCount = getReactionCount;
exports.hasSameSender = hasSameSender;
exports.isMyMessage = isMyMessage;
exports.isNewMessage = isNewMessage;
exports.isSendableMessage = isSendableMessage;
exports.isSendbirdNotification = isSendbirdNotification;
exports.messageComparator = messageComparator;
exports.messageKeyExtractor = messageKeyExtractor;
exports.parseSendbirdNotification = parseSendbirdNotification;
exports.shouldRenderReaction = shouldRenderReaction;
var _message = require("@sendbird/chat/message");
var _file = require("../shared/file");
var _common = require("../ui-format/common");
function isNewMessage(msg, currentUserId) {
  const myMessage = isMyMessage(msg, currentUserId);
  if (myMessage) return false;
  if (msg.isAdminMessage()) return false;
  return msg.updatedAt === 0;
}
function isSendableMessage(msg) {
  return msg !== undefined && msg !== null && 'sendingStatus' in msg;
}
function isMyMessage(msg) {
  var _msg$sender;
  let currentUserId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '##__USER_ID_IS_NOT_PROVIDED__##';
  if (!isSendableMessage(msg)) return false;
  return 'sender' in msg && ((_msg$sender = msg.sender) === null || _msg$sender === void 0 ? void 0 : _msg$sender.userId) === currentUserId || msg.sendingStatus === 'pending' || msg.sendingStatus === 'failed' || msg.sendingStatus === 'canceled';
}
function messageKeyExtractor(message) {
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
function messageComparator(a, b) {
  let aStatusOffset = 0;
  let bStatusOffset = 0;
  if (isSendableMessage(a) && a.sendingStatus !== 'succeeded') aStatusOffset = 999999;
  if (isSendableMessage(b) && b.sendingStatus !== 'succeeded') bStatusOffset = 999999;
  return b.createdAt + bStatusOffset - (a.createdAt + aStatusOffset);
}
function hasSameSender(a, b) {
  var _a$sender, _b$sender;
  if (!a || !b) return false;
  if ('sender' in a && 'sender' in b) return ((_a$sender = a.sender) === null || _a$sender === void 0 ? void 0 : _a$sender.userId) === ((_b$sender = b.sender) === null || _b$sender === void 0 ? void 0 : _b$sender.userId);
  return false;
}
function calcMessageGrouping(groupEnabled, curr, prev, next) {
  const getPrev = () => {
    if (!groupEnabled) return false;
    if (!prev) return false;
    if (curr.isAdminMessage()) return false;
    if (!hasSameSender(curr, prev)) return false;
    if ((0, _common.getMessageTimeFormat)(new Date(curr.createdAt)) !== (0, _common.getMessageTimeFormat)(new Date(prev.createdAt))) return false;
    return true;
  };
  const getNext = () => {
    if (!groupEnabled) return false;
    if (!next) return false;
    if (curr.isAdminMessage()) return false;
    if (!hasSameSender(curr, next)) return false;
    if ((0, _common.getMessageTimeFormat)(new Date(curr.createdAt)) !== (0, _common.getMessageTimeFormat)(new Date(next.createdAt))) return false;
    return true;
  };
  return {
    groupWithPrev: getPrev(),
    groupWithNext: getNext()
  };
}
function getMessageUniqId(msg) {
  if (msg.isUserMessage() || msg.isFileMessage()) {
    if (msg.sendingStatus === 'succeeded') return String(msg.messageId);
    return msg.reqId;
  }
  return String(msg.messageId);
}
function getAvailableUriFromFileMessage(message) {
  if (!message.url && message.messageParams.file && 'uri' in message.messageParams.file) {
    return message.messageParams.file.uri;
  }
  return message.url;
}
function isSendbirdNotification(dataPayload) {
  if (!dataPayload) return false;
  return Boolean(dataPayload['sendbird']);
}
function parseSendbirdNotification(dataPayload) {
  return typeof dataPayload.sendbird === 'string' ? JSON.parse(dataPayload.sendbird) : dataPayload.sendbird;
}
function shouldRenderReaction(channel, reactionEnabled) {
  if (channel.isOpenChannel()) {
    return false;
  }
  if (channel.isGroupChannel()) {
    if (channel.isBroadcast) return false;
    if (channel.isSuper) return false;
  }
  return reactionEnabled;
}
function getReactionCount(reaction) {
  return reaction.userIds.length;
}
function getFileTypeFromMessage(message) {
  return (0, _file.getFileType)(message.type || (0, _file.getFileExtension)(message.name));
}
function getMessageType(message) {
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
function getDefaultMessageSearchQueryParams(channel, keyword) {
  return {
    keyword,
    channelUrl: channel.url,
    messageTimestampFrom: Math.max(channel.joinedAt, channel.invitedAt),
    order: _message.MessageSearchOrder.TIMESTAMP
  };
}
//# sourceMappingURL=message.js.map