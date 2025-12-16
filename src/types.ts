import { ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

/**
 * Information passed to the renderItem function
 */
export interface HorizontalWheelPickerItemInfo<T> {
    item: T;
    index: number;
    isSelected: boolean;
}

/**
 * Animation configuration for the wheel picker
 */
export interface HorizontalWheelPickerAnimationConfig {
    /**
     * Opacity values at different positions relative to center
     * [far-left, mid-left, center, mid-right, far-right]
     * @default [0.3, 0.6, 1, 0.6, 0.3]
     */
    opacityRange?: [number, number, number, number, number];

    /**
     * Scale values at different positions relative to center
     * [far-left, mid-left, center, mid-right, far-right]
     * @default [0.8, 0.9, 1, 0.9, 0.8]
     */
    scaleRange?: [number, number, number, number, number];
}

/**
 * Main props for the WheelPicker component
 */
export interface HorizontalWheelPickerProps<T> {
    /**
     * Array of data items to display
     */
    data: T[];

    /**
     * Render function for each item
     */
    renderItem: (info: HorizontalWheelPickerItemInfo<T>) => React.ReactElement;

    /**
     * Function to extract a unique key for each item
     */
    keyExtractor: (item: T, index: number) => string;

    /**
     * Width of each item in pixels
     * @default 60
     */
    itemWidth?: number;

    /**
     * Initial selected index (uncontrolled mode)
     * @default 0
     */
    initialIndex?: number;

    /**
     * Selected index (controlled mode)
     * When provided, the component becomes controlled
     */
    selectedIndex?: number;

    /**
     * Callback when an item is selected
     */
    onSelect?: (item: T, index: number) => void;

    /**
     * Animation configuration
     */
    animationConfig?: HorizontalWheelPickerAnimationConfig;

    /**
     * Container style
     */
    containerStyle?: ViewStyle;

    /**
     * Content container style (for the FlatList)
     */
    contentContainerStyle?: ViewStyle;

    /**
     * Style for each item wrapper
     */
    itemContainerStyle?: ViewStyle;

    /**
     * Whether to snap to items
     * @default true
     */
    snapToItem?: boolean;

    /**
     * Deceleration rate for scroll momentum
     * @default 'fast'
     */
    decelerationRate?: number | 'fast' | 'normal';

    /**
     * Number of items to render initially
     * @default 15
     */
    initialNumToRender?: number;

    /**
     * Whether to show horizontal scroll indicator
     * @default false
     */
    showsScrollIndicator?: boolean;

    /**
     * Gap width at the start and end of the list
     * @default 10
     */
    listPadding?: number;

    /**
     * Height of the picker container
     * @default 60
     */
    height?: number;
}

/**
 * Internal props for the animated item wrapper
 */
export interface HorizontalWheelPickerItemWrapperProps<T> {
    item: T;
    index: number;
    isSelected: boolean;
    itemWidth: number;
    scrollX: SharedValue<number>;
    screenWidth: number;
    visibleItems: number;
    animationConfig: Required<HorizontalWheelPickerAnimationConfig>;
    renderItem: (info: HorizontalWheelPickerItemInfo<T>) => React.ReactElement;
    onPress: () => void;
    itemContainerStyle?: ViewStyle;
}

/**
 * Ref methods exposed by the WheelPicker
 */
export interface HorizontalWheelPickerRef {
    scrollToIndex: (index: number, animated?: boolean) => void;
    getSelectedIndex: () => number;
}
