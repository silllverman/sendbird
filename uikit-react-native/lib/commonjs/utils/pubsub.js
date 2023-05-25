"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
var _default = pubsub;
exports.default = _default;
//# sourceMappingURL=pubsub.js.map