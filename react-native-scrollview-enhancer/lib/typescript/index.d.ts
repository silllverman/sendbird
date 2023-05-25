/// <reference types="react" />
import { FlatList as RNFlatList, ScrollView as RNScrollView, SectionList as RNSectionList } from 'react-native';
import type { EnhancedScrollViewAbstraction } from './types';
declare const ScrollView: import("react").ForwardRefExoticComponent<import("react-native").ScrollViewProps & import("./types").EnhancedScrollViewProps & import("react").RefAttributes<typeof RNScrollView>>;
declare const FlatList: typeof RNFlatList | EnhancedScrollViewAbstraction<RNFlatList<any>>;
declare const SectionList: typeof RNSectionList | EnhancedScrollViewAbstraction<RNSectionList<any, import("react-native").DefaultSectionT>>;
export { enhanceScrollView, enhanceScrollViewWithBidirectional } from './enhanceScrollView';
export { useBiDirectional } from './useBiDirectional';
export { ScrollViewEnhancerView } from './native';
export { ScrollView, FlatList, SectionList };
//# sourceMappingURL=index.d.ts.map