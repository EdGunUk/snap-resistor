import * as sizes from "../consts/sizes";
import uniqid from 'uniqid';

export const calculateResistorSize = (windowSize, isFullWidth, isFullHeight) => {
    const {width, height} = windowSize;

    return {
        x: isFullWidth ? 0 : (width - sizes.RESISTOR_WIDTH) / 2,
        y: isFullHeight ? 0 : (height - sizes.RESISTOR_HEIGHT) / 2,
        width: isFullWidth ? width : sizes.RESISTOR_WIDTH,
        height: isFullHeight ? height : sizes.RESISTOR_HEIGHT
    };
}

export const calculateResistorValue = (props) => {
    const mappedProps = Object.fromEntries(Object.entries(props).map(([key, value]) => [key, (value === null) ? value : value.toString()]));
    const {firstBandValue, secondBandValue, thirdBandValue, multiplierValue} = mappedProps;
    const totalBandValue = (thirdBandValue === null) ? firstBandValue + secondBandValue : firstBandValue + secondBandValue + "." + thirdBandValue;

    return totalBandValue * multiplierValue;
}

export const calculateRectangleSize = (resistorSize, spaceSize, count) => {
    const spacesSize = (count - 1) * spaceSize;

    return (resistorSize - spacesSize) / count;
}

export const calculateRectangleCoords = (squareSize, spaceSize, index) => {
    return (squareSize + spaceSize) * index;
}

export const updateConfig = (config, resistorWidth, resistorHeight) => {
    const width = calculateRectangleSize(resistorWidth, sizes.SPASE_BETWEEN_COLORED_SQUARE_X_AXIOS, config.length);
    const height = calculateRectangleSize(resistorHeight, sizes.SPASE_BETWEEN_COLORED_SQUARE_Y_AXIOS, sizes.COUNT_COLORED_SQUARE_X_AXIOS);

    return config.map((band, index) => {
        const x = calculateRectangleCoords(width, sizes.SPASE_BETWEEN_COLORED_SQUARE_X_AXIOS, index);

        return band.map((rectangle, index) => {
            const y = calculateRectangleCoords(height, sizes.SPASE_BETWEEN_COLORED_SQUARE_Y_AXIOS, index);

            return {
                x,
                y,
                width,
                height,
                id: uniqid(),
                ...rectangle,
            }
        })
    })
}