const pubsub = () => {
  const subscribers = new Set();
  return {
    publish: data => {
      subscribers.forEach(subscriber => subscriber(data));
    },
    subscribe: subscriber => {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    }
  };
};
export default pubsub;
//# sourceMappingURL=pubsub.js.map