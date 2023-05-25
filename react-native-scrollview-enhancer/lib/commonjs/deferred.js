"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deferred = void 0;
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve,
    reject
  };
};
exports.deferred = deferred;
//# sourceMappingURL=deferred.js.map