import { FlatList as RNFlatList, ScrollView as RNScrollView, SectionList as RNSectionList } from 'react-native';
import { enhanceScrollViewWithBidirectional } from './enhanceScrollView';
const ScrollView = enhanceScrollViewWithBidirectional(RNScrollView);
const FlatList = enhanceScrollViewWithBidirectional(RNFlatList);
const SectionList = enhanceScrollViewWithBidirectional(RNSectionList);
export { enhanceScrollView, enhanceScrollViewWithBidirectional } from './enhanceScrollView';
export { useBiDirectional } from './useBiDirectional';
export { ScrollViewEnhancerView } from './native';
export { ScrollView, FlatList, SectionList };
//# sourceMappingURL=index.js.map