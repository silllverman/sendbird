import React from 'react';
import type { EnhancedScrollViewProps, GetProps, ScrollViewEnhancerProps } from './types';
export declare const enhanceScrollView: <T extends React.ComponentType<P>, P extends ScrollViewEnhancerProps = GetProps<T>>(ScrollViewComponent: T) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & Pick<EnhancedScrollViewProps, "maintainVisibleContentPosition">> & React.RefAttributes<T>>;
export declare const enhanceScrollViewWithBidirectional: <T extends React.ComponentType<P>, P extends ScrollViewEnhancerProps = GetProps<T>>(ScrollViewComponent: T) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & EnhancedScrollViewProps> & React.RefAttributes<T>>;
//# sourceMappingURL=enhanceScrollView.d.ts.map