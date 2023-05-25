import { useState } from 'react';
import { useAsyncEffect } from '@sendbird/uikit-utils';
export const useOpenChannel = (sdk, channelUrl) => {
  const [channel, setChannel] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useAsyncEffect(async () => {
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
//# sourceMappingURL=useOpenChannel.js.map