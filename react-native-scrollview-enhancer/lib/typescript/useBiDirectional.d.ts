/**
 * Original Code
 * @link https://github.com/facebook/react-native/blob/main/packages/virtualized-lists/Lists/VirtualizedList.js
 */
import type { VirtualizedListProps } from 'react-native';
import { ComponentType } from 'react';
import type { EnhancedScrollViewProps } from './types';
export declare function useBiDirectional<P extends Partial<VirtualizedListProps<any> & EnhancedScrollViewProps> = {}>(Component: ComponentType<P>, props: P, ref?: any): {
    renderScrollView: () => JSX.Element;
};
//# sourceMappingURL=useBiDirectional.d.ts.map