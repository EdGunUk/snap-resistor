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

export const divideArr = (arr) => {
    const middleIndex = Math.ceil(arr.length / 2);
    const firstPart = [...arr].splice(0, middleIndex);
    const secondPart = [...arr].splice(-middleIndex);

    return [firstPart, secondPart, middleIndex];
}

export const calculateRectangleSize = (resistorSize, spaceSize, count) => {
    const spacesSize = (count - 1) * spaceSize;

    return (resistorSize - spacesSize) / count;
}

export const calculateRectangleCoords = (squareSize, spaceSize, index) => {
    return (squareSize + spaceSize) * index;
}

export const calculateYSelectionRectangle = () => {
    return (sizes.RESISTOR_HEIGHT - sizes.RECTANGLE_HEIGHT) / 2;
}
export const calculatePathData = ({x, y, width, height}, widthShrinkValue, prevWidthShrinkValue) => {
    // return `M${x} ${y} l${x} ${0} l${0} ${-height} l${-width} ${0} z`;
    return `M${x + prevWidthShrinkValue} ${y} L${x + width - prevWidthShrinkValue} ${y} ${x + width - widthShrinkValue} ${y + height} ${x + widthShrinkValue} ${y + height} Z`;
}

export const getBaseConfig = (config, resistorWidth, yOffset = calculateYSelectionRectangle()) => {
    const width = calculateRectangleSize(resistorWidth, sizes.SPASE_BETWEEN_COLORED_RECTANGLE_X_AXIOS, config.length);
    const ySelectionRectangle = calculateYSelectionRectangle();
    const baseHeight = sizes.RECTANGLE_HEIGHT;

    return config.map((band, index) => {
        const x = calculateRectangleCoords(width, sizes.SPASE_BETWEEN_COLORED_RECTANGLE_X_AXIOS, index);
        let y = yOffset;

        return band.map((rectangle) => {
            const distanceToSelectionRectangle = y - ySelectionRectangle;
            const heightShrinkValue = Math.abs(distanceToSelectionRectangle * sizes.HEIGHT_SHRINK_COEFFICIENT);
            const xShrinkValue = Math.pow(distanceToSelectionRectangle * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const height = baseHeight - heightShrinkValue;
            const x1ShrinkValue = Math.pow((distanceToSelectionRectangle - height) * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const coords = {x, y, width, height};
            const pathData = calculatePathData(coords, xShrinkValue, x1ShrinkValue);
            const id = uniqid();

            y += height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS;

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
        const ySelectionRectangle = calculateYSelectionRectangle();
        const baseHeight = sizes.RECTANGLE_HEIGHT;
        const currentBand = baseConfig[bandId];
        const [firstPartBand, secondPartBand, middleIndex] = divideArr(currentBand);
        let firstPartY = currentBand[middleIndex].y + translateY;
        let secondPartY = firstPartY;

        const updatedFirstPartBand = firstPartBand.reverse().map((rectangle) => {
            const {x, width} = rectangle;
            const distanceToSelectionRectangle = firstPartY - ySelectionRectangle - baseHeight;
            const heightShrinkValue = Math.abs(distanceToSelectionRectangle * sizes.HEIGHT_SHRINK_COEFFICIENT);
            const xShrinkValue = Math.pow(distanceToSelectionRectangle * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const height = baseHeight - heightShrinkValue;
            const x1ShrinkValue = Math.pow((distanceToSelectionRectangle - height) * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            firstPartY -= (height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS);
            const coords = {x, y: firstPartY, width, height};
            const pathData = calculatePathData(coords, xShrinkValue, x1ShrinkValue);

            return {
                ...rectangle,
                ...coords,
                pathData,
            }
        })


        const updatedSecondPartBand = secondPartBand.map((rectangle) => {
            const {x, width} = rectangle;
            const distanceToSelectionRectangle = secondPartY - ySelectionRectangle;
            const heightShrinkValue = Math.abs(distanceToSelectionRectangle * sizes.HEIGHT_SHRINK_COEFFICIENT);
            const xShrinkValue = Math.pow(distanceToSelectionRectangle * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const height = baseHeight - heightShrinkValue;
            const x1ShrinkValue = Math.pow((distanceToSelectionRectangle - height) * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const coords = {x, y: secondPartY, width, height};
            const pathData = calculatePathData(coords, xShrinkValue, x1ShrinkValue);

            secondPartY += height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS;

            return {
                ...rectangle,
                ...coords,
                pathData,
            }

        })

        configClone[bandId] = [...updatedFirstPartBand, ...updatedSecondPartBand]

        return configClone
    }

    return config.map((band, index) => {
        const baseBand = baseConfig[index];

        return band.map((rectangle, index) => {
            const {x, width} = baseBand[index];
            const coords = {x, y: rectangle.y, width, height: rectangle.height};
            const pathData = calculatePathData(coords);

            return {
                ...rectangle,
                ...coords,
                pathData,
            };
        })
    })
}