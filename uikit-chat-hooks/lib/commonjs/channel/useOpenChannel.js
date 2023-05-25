"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useOpenChannel = void 0;
var _react = require("react");
var _uikitUtils = require("@sendbird/uikit-utils");
const useOpenChannel = (sdk, channelUrl) => {
  const [channel, setChannel] = (0, _react.useState)();
  const [loading, setLoading] = (0, _react.useState)(true);
  const [error, setError] = (0, _react.useState)();
  (0, _uikitUtils.useAsyncEffect)(async () => {
    try {
      setChannel(await sdk.openChannel.getChannel(channelUrl));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    channel,
    loading,
    error
  };
};
exports.useOpenChannel = useOpenChannel;
//# sourceMappingURL=useOpenChannel.js.map