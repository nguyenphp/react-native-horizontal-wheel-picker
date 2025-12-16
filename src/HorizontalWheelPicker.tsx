import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Dimensions,
    FlatList,
    FlatListProps,
    StyleSheet,
    View,
} from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';

import {
    DEFAULT_ANIMATION_CONFIG,
    DEFAULT_DECELERATION_RATE,
    DEFAULT_HEIGHT,
    DEFAULT_INITIAL_NUM_TO_RENDER,
    DEFAULT_ITEM_WIDTH,
    DEFAULT_LIST_PADDING,
} from './constants';
import { HorizontalWheelPickerItem } from './HorizontalWheelPickerItem';
import { HorizontalWheelPickerProps, HorizontalWheelPickerRef } from './types';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<any>>(FlatList);

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * HorizontalWheelPicker - A customizable horizontal wheel picker component
 * 
 * @example
 * ```tsx
 * <HorizontalWheelPicker
 *   data={['Option 1', 'Option 2', 'Option 3']}
 *   renderItem={({ item, isSelected }) => (
 *     <Text style={{ color: isSelected ? 'blue' : 'gray' }}>{item}</Text>
 *   )}
 *   keyExtractor={(item) => item}
 *   onSelect={(item, index) => console.log('Selected:', item)}
 * />
 * ```
 */
function HorizontalWheelPickerComponent<T>(
    {
        data,
        renderItem,
        keyExtractor,
        itemWidth = DEFAULT_ITEM_WIDTH,
        initialIndex = 0,
        selectedIndex: controlledIndex,
        onSelect,
        animationConfig,
        containerStyle,
        contentContainerStyle,
        itemContainerStyle,
        snapToItem = true,
        decelerationRate = DEFAULT_DECELERATION_RATE,
        initialNumToRender = DEFAULT_INITIAL_NUM_TO_RENDER,
        showsScrollIndicator = false,
        listPadding = DEFAULT_LIST_PADDING,
        height = DEFAULT_HEIGHT,
    }: HorizontalWheelPickerProps<T>,
    ref: React.ForwardedRef<HorizontalWheelPickerRef>
) {
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useSharedValue(0);

    // Internal state for uncontrolled mode
    const [internalIndex, setInternalIndex] = useState(initialIndex);

    // Use controlled index if provided, otherwise use internal state
    const currentIndex = controlledIndex ?? internalIndex;

    // Merge animation config with defaults
    const mergedAnimationConfig = useMemo(
        () => ({
            ...DEFAULT_ANIMATION_CONFIG,
            ...animationConfig,
        }),
        [animationConfig]
    );

    // Calculate visible items based on screen width
    const visibleItems = useMemo(
        () => Math.floor(SCREEN_WIDTH / itemWidth),
        [itemWidth]
    );

    // Calculate initial scroll offset to center the selected item
    const initialScrollOffset = useMemo(() => {
        const centerPosition = SCREEN_WIDTH / 2;
        const itemCenterPosition = initialIndex * itemWidth + itemWidth / 2;
        const offset = itemCenterPosition - centerPosition;
        return Math.max(0, offset);
    }, [initialIndex, itemWidth]);

    // Memoized getItemLayout for performance
    const getItemLayout = useCallback(
        (_data: any, index: number) => ({
            length: itemWidth,
            offset: itemWidth * index,
            index,
        }),
        [itemWidth]
    );

    // Handle item selection
    const handleSelect = useCallback(
        (item: T, index: number) => {
            // Update internal state for uncontrolled mode
            if (controlledIndex === undefined) {
                setInternalIndex(index);
            }

            // Scroll to the selected item
            flatListRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5,
            });

            // Call external callback
            onSelect?.(item, index);
        },
        [controlledIndex, onSelect]
    );

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        scrollToIndex: (index: number, animated = true) => {
            flatListRef.current?.scrollToIndex({
                index,
                animated,
                viewPosition: 0.5,
            });
        },
        getSelectedIndex: () => currentIndex,
    }));

    // Scroll handler for animation
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    // Render each item
    const renderAnimatedItem = useCallback(
        ({ item, index }: { item: T; index: number }) => {
            const isSelected = index === currentIndex;

            return (
                <HorizontalWheelPickerItem
                    item={item}
                    index={index}
                    isSelected={isSelected}
                    itemWidth={itemWidth}
                    scrollX={scrollX}
                    screenWidth={SCREEN_WIDTH}
                    visibleItems={visibleItems}
                    animationConfig={mergedAnimationConfig}
                    renderItem={renderItem}
                    onPress={() => handleSelect(item, index)}
                    itemContainerStyle={itemContainerStyle}
                />
            );
        },
        [
            currentIndex,
            itemWidth,
            scrollX,
            visibleItems,
            mergedAnimationConfig,
            renderItem,
            handleSelect,
            itemContainerStyle,
        ]
    );

    // Gap component for list padding
    const ListGap = useMemo(
        () => <View style={{ width: listPadding }} />,
        [listPadding]
    );

    return (
        <View style={[styles.container, { height }, containerStyle]}>
            <AnimatedFlatList
                ref={flatListRef}
                data={data}
                renderItem={renderAnimatedItem}
                keyExtractor={keyExtractor}
                horizontal
                showsHorizontalScrollIndicator={showsScrollIndicator}
                ListHeaderComponent={ListGap}
                ListFooterComponent={ListGap}
                contentContainerStyle={[styles.content, contentContainerStyle]}
                snapToInterval={snapToItem ? itemWidth : undefined}
                decelerationRate={decelerationRate}
                contentOffset={{ x: initialScrollOffset, y: 0 }}
                initialNumToRender={initialNumToRender}
                maxToRenderPerBatch={initialNumToRender}
                windowSize={initialNumToRender}
                getItemLayout={getItemLayout}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                removeClippedSubviews
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    content: {
        alignItems: 'center',
    },
});

/**
 * Forwarded ref version of HorizontalWheelPicker
 */
export const HorizontalWheelPicker = forwardRef(HorizontalWheelPickerComponent) as <T>(
    props: HorizontalWheelPickerProps<T> & { ref?: React.ForwardedRef<HorizontalWheelPickerRef> }
) => React.ReactElement;
