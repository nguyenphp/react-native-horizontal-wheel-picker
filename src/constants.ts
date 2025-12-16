import { HorizontalWheelPickerAnimationConfig } from './types';

/**
 * Default item width in pixels
 */
export const DEFAULT_ITEM_WIDTH = 60;

/**
 * Default height of the picker container
 */
export const DEFAULT_HEIGHT = 60;

/**
 * Default padding at the start and end of the list
 */
export const DEFAULT_LIST_PADDING = 10;

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: Required<HorizontalWheelPickerAnimationConfig> = {
    opacityRange: [0.3, 0.6, 1, 0.6, 0.3],
    scaleRange: [0.8, 0.9, 1, 0.9, 0.8],
};

/**
 * Default deceleration rate
 */
export const DEFAULT_DECELERATION_RATE = 'fast' as const;

/**
 * Default number of items to render initially
 */
export const DEFAULT_INITIAL_NUM_TO_RENDER = 15;
