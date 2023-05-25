import { Platform } from 'react-native';
const pkgVersion = require('react-native/package.json').version;
const [major, minor, patch] = pkgVersion.split('.').map(it => Number(it));
const parsedVersion = {
  major,
  minor,
  patch
};
let _warningCalled = false;
export function warningOnHorizontalScroll(props) {
  if (props.horizontal && Platform.OS === 'android' && !_warningCalled) {
    _warningCalled = true;
    console.warn('ScrollViewEnhancerView does not support horizontal direction');
  }
}
export function getRNVersion() {
  return parsedVersion;
}
//# sourceMappingURL=utils.js.map