import React from 'react';
import { Dimensions, I18nManager, Pressable } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated';

import { HorizontalWheelPickerItemWrapperProps } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Animated item wrapper component
 * Handles opacity and scale animations based on scroll position
 */
function HorizontalWheelPickerItemComponent<T>({
    item,
    index,
    isSelected,
    itemWidth,
    scrollX,
    screenWidth = SCREEN_WIDTH,
    visibleItems,
    animationConfig,
    renderItem,
    onPress,
    itemContainerStyle,
}: HorizontalWheelPickerItemWrapperProps<T>) {
    const itemPosition = index * itemWidth + itemWidth / 2;
    const centerPosition = screenWidth / 2;

    const animatedStyle = useAnimatedStyle(() => {
        const distanceFromCenter = itemPosition - (scrollX.value + centerPosition);
        const maxDistance = (visibleItems * itemWidth) / 2;
        const midDistance = maxDistance / 2;

        const opacity = interpolate(
            distanceFromCenter,
            [-maxDistance, -midDistance, 0, midDistance, maxDistance],
            animationConfig.opacityRange,
            'clamp'
        );

        const scale = interpolate(
            distanceFromCenter,
            [-maxDistance, -midDistance, 0, midDistance, maxDistance],
            animationConfig.scaleRange,
            'clamp'
        );

        return {
            opacity,
            transform: [{ scale }],
        };
    });

    return (
        <Animated.View
            style={[
                {
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: itemWidth,
                },
                animatedStyle,
                itemContainerStyle,
                I18nManager.isRTL && { transform: [{ scaleX: -1 }] },
            ]}
        >
            <Pressable onPress={onPress}>
                {renderItem({ item, index, isSelected })}
            </Pressable>
        </Animated.View>
    );
}

/**
 * Memoized version with custom comparison
 */
export const HorizontalWheelPickerItem = React.memo(
    HorizontalWheelPickerItemComponent,
    (prevProps, nextProps) => {
        return (
            prevProps.item === nextProps.item &&
            prevProps.index === nextProps.index &&
            prevProps.isSelected === nextProps.isSelected &&
            prevProps.itemWidth === nextProps.itemWidth &&
            prevProps.visibleItems === nextProps.visibleItems &&
            prevProps.renderItem === nextProps.renderItem
        );
    }
) as typeof HorizontalWheelPickerItemComponent;
