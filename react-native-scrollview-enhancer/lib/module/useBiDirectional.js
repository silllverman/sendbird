function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * Original Code
 * @link https://github.com/facebook/react-native/blob/main/packages/virtualized-lists/Lists/VirtualizedList.js
 */

import React, { useRef } from 'react';
import { deferred } from './deferred';
const ON_EDGE_REACHED_EPSILON = 0.001;
const DEFAULT_LAZY_FETCH_MS = 250;
const DEFAULT_EDGE_REACHED_THRESHOLD = 2;
function getDistanceFrom(offset, visibleLength, contentLength) {
  let distanceFromStart = offset;
  let distanceFromEnd = contentLength - visibleLength - offset;

  // Especially when oERT is zero it's necessary to 'floor' very small distance values to be 0
  // since debouncing causes us to not fire this event for every single "pixel" we scroll and can thus
  // be at the edge of the list with a distance approximating 0 but not quite there.
  if (distanceFromStart < ON_EDGE_REACHED_EPSILON) distanceFromStart = 0;
  if (distanceFromEnd < ON_EDGE_REACHED_EPSILON) distanceFromEnd = 0;
  return {
    distanceFromStart,
    distanceFromEnd
  };
}
function onEdgeReachedThresholdOrDefault(visibleLength, onEdgeReachedThreshold) {
  if (typeof onEdgeReachedThreshold === 'number') {
    return onEdgeReachedThreshold * visibleLength;
  }
  return DEFAULT_EDGE_REACHED_THRESHOLD;
}
export function useBiDirectional(Component, props, ref) {
  const innerRef = useRef();
  const scrollRef = () => ref || innerRef;
  const scrollMetrics = useRef({
    offset: 0,
    visibleLength: -1,
    contentLength: -1,
    timestamp: 0
  });
  const inProgressCall = useRef(Promise.resolve());
  const isHorizontal = props.horizontal ?? false;
  const sentEndForContentLength = useRef(new Map());
  const sentStartForContentLength = useRef(new Map());
  function updateScrollMetrics(metrics) {
    if (typeof metrics.offset === 'number') {
      scrollMetrics.current.offset = metrics.offset;
    }
    if (typeof metrics.visibleLength === 'number') {
      scrollMetrics.current.visibleLength = metrics.visibleLength;
    }
    if (typeof metrics.contentLength === 'number') {
      scrollMetrics.current.contentLength = metrics.contentLength;
    }
    if (typeof metrics.timestamp === 'number') {
      scrollMetrics.current.timestamp = metrics.timestamp;
    }
  }
  async function lazyOnEndReached(distanceFromEnd) {
    var _props$onEndReached;
    const p = deferred();
    const response = (_props$onEndReached = props.onEndReached) === null || _props$onEndReached === void 0 ? void 0 : _props$onEndReached.call(props, {
      distanceFromEnd
    });
    const resolveLazily = () => setTimeout(() => p.resolve(), DEFAULT_LAZY_FETCH_MS);

    // @ts-ignore
    if (response instanceof Promise) {
      response.then(resolveLazily).catch(p.reject);
    } else {
      resolveLazily();
    }
    return p.promise;
  }
  async function lazyOnStartReached(distanceFromStart) {
    var _props$onStartReached;
    const p = deferred();
    const response = (_props$onStartReached = props.onStartReached) === null || _props$onStartReached === void 0 ? void 0 : _props$onStartReached.call(props, {
      distanceFromStart
    });
    const resolveLazily = () => setTimeout(() => p.resolve(), DEFAULT_LAZY_FETCH_MS);

    // @ts-ignore
    if (response instanceof Promise) {
      response.then(resolveLazily).catch(p.reject);
    } else {
      resolveLazily();
    }
    return p.promise;
  }
  function maybeCallOnEdgeReached(offset, visibleLength, contentLength) {
    if (visibleLength < 0 || contentLength < 0) return;
    const {
      onEndReached,
      onStartReached
    } = props;
    const {
      distanceFromStart,
      distanceFromEnd
    } = getDistanceFrom(offset, visibleLength, contentLength);
    const startThreshold = onEdgeReachedThresholdOrDefault(visibleLength, props.onStartReachedThreshold);
    const endThreshold = onEdgeReachedThresholdOrDefault(visibleLength, props.onEndReachedThreshold);
    const isWithinStartThreshold = distanceFromStart <= startThreshold;
    const isWithinEndThreshold = distanceFromEnd <= endThreshold;

    // First check if the user just scrolled within the end threshold
    // and call onEndReached only once for a given content length,
    // and only if onStartReached is not being executed
    if (onEndReached && isWithinEndThreshold && !sentEndForContentLength.current.has(contentLength)) {
      sentEndForContentLength.current.set(contentLength, true);
      inProgressCall.current = inProgressCall.current.catch(() => {
        sentEndForContentLength.current.delete(contentLength);
      }).finally(() => lazyOnEndReached(distanceFromEnd));
    }
    // Next check if the user just scrolled within the start threshold
    // and call onStartReached only once for a given content length,
    // and only if onEndReached is not being executed
    else if (onStartReached != null && isWithinStartThreshold && !sentStartForContentLength.current.has(contentLength)) {
      // On initial mount when using initialScrollIndex the offset will be 0 initially
      // and will trigger an unexpected onStartReached. To avoid this we can use
      // timestamp to differentiate between the initial scroll metrics and when we actually
      // received the first scroll event.
      if (!props.initialScrollIndex || scrollMetrics.current.timestamp !== 0) {
        sentStartForContentLength.current.set(contentLength, true);
        inProgressCall.current = inProgressCall.current.catch(() => {
          sentStartForContentLength.current.delete(contentLength);
        }).finally(() => lazyOnStartReached(distanceFromEnd));
      }
    }
    // NOTE: Changed to Map to handle multiple requests on the same content length
    // If the user scrolls away from the start or end and back again,
    // cause onStartReached or onEndReached to be triggered again
    else {
      // if (!isWithinEndThreshold) {
      //   sentEndForContentLength.current = 0;
      // }
      // if (!isWithinStartThreshold) {
      //   sentStartForContentLength.current = 0;
      // }
    }
  }
  function onScroll(e) {
    var _props$onScroll;
    (_props$onScroll = props.onScroll) === null || _props$onScroll === void 0 ? void 0 : _props$onScroll.call(props, e);
    const {
      contentOffset,
      contentSize,
      layoutMeasurement
    } = e.nativeEvent;
    const offset = isHorizontal ? contentOffset.x : contentOffset.y;
    const visibleLength = isHorizontal ? layoutMeasurement.width : layoutMeasurement.height;
    const contentLength = isHorizontal ? contentSize.width : contentSize.height;
    maybeCallOnEdgeReached(offset, visibleLength, contentLength);
    updateScrollMetrics({
      offset,
      visibleLength,
      contentLength,
      timestamp: e.timeStamp
    });
  }
  function onContentSizeChange(w, h) {
    var _props$onContentSizeC;
    (_props$onContentSizeC = props.onContentSizeChange) === null || _props$onContentSizeC === void 0 ? void 0 : _props$onContentSizeC.call(props, w, h);
    updateScrollMetrics({
      contentLength: isHorizontal ? w : h
    });
  }
  function onLayout(e) {
    var _props$onLayout;
    (_props$onLayout = props.onLayout) === null || _props$onLayout === void 0 ? void 0 : _props$onLayout.call(props, e);
    if (scrollMetrics.current.visibleLength === -1) {
      updateScrollMetrics({
        visibleLength: isHorizontal ? e.nativeEvent.layout.width : e.nativeEvent.layout.height
      });
      maybeCallOnEdgeReached(scrollMetrics.current.offset, scrollMetrics.current.visibleLength, scrollMetrics.current.contentLength);
    }
  }
  function renderScrollView() {
    return /*#__PURE__*/React.createElement(Component, _extends({}, props, {
      ref: scrollRef(),
      onScroll: onScroll,
      onLayout: onLayout,
      onContentSizeChange: onContentSizeChange,
      onEndReached: null
    }));
  }
  return {
    renderScrollView
  };
}
//# sourceMappingURL=useBiDirectional.js.map