import * as sizes from "../consts/sizes";
import uniqid from 'uniqid';

export const checkIsFullWidth = (width) => {
    return width <= sizes.RESISTOR_WIDTH;
}

export const calculateResistorWidth = (windowWidth) => {
    const isFullWidth = checkIsFullWidth(windowWidth);

    return isFullWidth ? windowWidth : sizes.RESISTOR_WIDTH;

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

export const calculateYSelectionBand = () => {
    return (sizes.RESISTOR_HEIGHT - sizes.RECTANGLE_HEIGHT) / 2;
}
export const calculatePathData = ({x, y, width, height}) => {
    // return `M${x} ${y} l${width} ${0} l${0} ${-height} l${-width} ${0} z`;
    return `M${x} ${y} L${x + width} ${y} ${x + width} ${y + height} ${x} ${y + height} Z`;
}

export const getBaseConfig = (config, resistorWidth) => {
    const width = calculateRectangleSize(resistorWidth, sizes.SPASE_BETWEEN_COLORED_RECTANGLE_X_AXIOS, config.length);
    const ySelectionBand = calculateYSelectionBand();
    const height = sizes.RECTANGLE_HEIGHT;

    return config.map((band, index) => {
        const x = calculateRectangleCoords(width, sizes.SPASE_BETWEEN_COLORED_RECTANGLE_X_AXIOS, index);

        return band.map((rectangle, index) => {
            const y = calculateRectangleCoords(height, sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS, index);
            const coords = {x, y, width, height};
            const pathData = calculatePathData(coords);
            const id = uniqid();

            return {
                ...rectangle,
                ...coords,
                pathData,
                id
            }
        })
    })
}

export const updateConfig = (props) => {
    const {baseConfig, config, bandId, translateY} = props;
    const isNeedUpdateCurrentBand = 'bandId' in props && 'translateY' in props;

    if (isNeedUpdateCurrentBand) {
        const configClone = [...config];

        configClone[bandId] = baseConfig[bandId].map((rectangle) => {
            const {x, y, width, height} = rectangle;
            const coords = {x, y: y + translateY, width, height};
            const pathData = calculatePathData(coords);

            return {
                ...rectangle,
                ...coords,
                pathData,
            };
        });

        return configClone
    }

    return config.map((band, index) => {
        const baseBand = baseConfig[index];

        return band.map((rectangle, index) => {
            const {x, width, height} = baseBand[index];
            const coords = {x, y: rectangle.y, width, height};
            const pathData = calculatePathData(coords);

            return {
                ...rectangle,
                ...coords,
                pathData,
            };
        })
    })
}