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

export const calculateRectangleWidth = (resistorSize, bandCount) => {
    const spacesSize = (bandCount - 1) * sizes.SPASE_BETWEEN_COLORED_RECTANGLE_X_AXIOS;

    return (resistorSize - spacesSize) / bandCount;
}

export const calculateRectangleXCoords = (squareSize, index) => {
    return (squareSize + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_X_AXIOS) * index;
}

export const calculateSelectionRectangleYCoords = () => {
    const resistorYCenter = sizes.RESISTOR_HEIGHT / 2;
    const rectangleYCenter = sizes.RECTANGLE_HEIGHT / 2;

    return {
        top: resistorYCenter - rectangleYCenter,
        center: resistorYCenter,
        bottom: resistorYCenter + rectangleYCenter
    }
}

export const calculatePath = (pathData) => {
    const {x, y, width, height, shrinkTop, shrinkBottom} = pathData;
    const XP0 = x + shrinkBottom;
    const YP0 = y;
    const XP1 = x + width - shrinkBottom;
    const YP1 = y;
    const XP2 = x + width - shrinkTop;
    const YP2 = y + height;
    const XP3 = x + shrinkTop;
    const YP3 = y + height;
    // return `M${x} ${y} l${width} ${0} l${0} ${-height} l${-width} ${0} z`;
    return `M${XP0} ${YP0} L${XP1} ${YP1} ${XP2} ${YP2} ${XP3} ${YP3} Z`;
}

export const getBaseConfig = (config, resistorWidth) => {
    const width = calculateRectangleWidth(resistorWidth, config.length);
    const halfWidth = width / 2;
    const {
        top: selectionRectangleTop,
        bottom: selectionRectangleBottom
    } = calculateSelectionRectangleYCoords();

    // TODO get center on every item for smooth scroll
    return config.map((band, index) => {
        const x = calculateRectangleXCoords(width, index);
        let y = selectionRectangleTop;

        return band.map((rectangle) => {
            const distanceToSelectionRectangleTop = Math.abs(selectionRectangleTop - y);
            const shrinkHeightValue = distanceToSelectionRectangleTop * sizes.HEIGHT_SHRINK_COEFFICIENT;
            const shrinkTopValue = Math.pow(distanceToSelectionRectangleTop * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const shrinkTop = shrinkTopValue >= halfWidth ? halfWidth : shrinkTopValue;
            const height = shrinkHeightValue >= sizes.RECTANGLE_HEIGHT ? 0 : sizes.RECTANGLE_HEIGHT - shrinkHeightValue;
            const distanceToSelectionRectangleBottom = Math.abs(selectionRectangleBottom - (y + height));
            const shrinkBottomValue = Math.pow((distanceToSelectionRectangleBottom) * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const shrinkBottom = shrinkBottomValue >= halfWidth ? halfWidth : shrinkBottomValue
            const pathData = {x, y, width, height, shrinkTop, shrinkBottom};
            const id = uniqid();

            y += height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS;

            return {
                ...rectangle,
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
        const {
            top: selectionRectangleTop,
            bottom: selectionRectangleBottom
        } = calculateSelectionRectangleYCoords();
        const baseBand = baseConfig[bandId];
        const [firstBand, secondBand, middleIndex] = divideArr(baseBand);
        const offset = baseBand[middleIndex].pathData.y + translateY;
        let firstBandY = offset;
        let secondBandY = offset;

        const updatedFirstBand = firstBand.reverse().map((rectangle) => {
            const {x, width} = rectangle.pathData;
            const halfWidth = width / 2;
            const distanceToSelectionRectangleTop = Math.abs(selectionRectangleTop + sizes.RECTANGLE_HEIGHT - firstBandY);
            const shrinkHeightValue = distanceToSelectionRectangleTop * sizes.HEIGHT_SHRINK_COEFFICIENT;
            const shrinkTopValue = Math.pow(distanceToSelectionRectangleTop * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const shrinkTop = shrinkTopValue >= halfWidth ? halfWidth : shrinkTopValue;
            const height = shrinkHeightValue >= sizes.RECTANGLE_HEIGHT ? 0 : sizes.RECTANGLE_HEIGHT - shrinkHeightValue;
            const distanceToSelectionRectangleBottom = Math.abs((selectionRectangleBottom + sizes.RECTANGLE_HEIGHT) - (firstBandY + height));
            const shrinkBottomValue = Math.pow((distanceToSelectionRectangleBottom) * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const shrinkBottom = shrinkBottomValue >= halfWidth ? halfWidth : shrinkBottomValue;

            firstBandY -= (height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS);

            const pathData = {x, y: firstBandY, width, height, shrinkTop, shrinkBottom};

            return {
                ...rectangle,
                pathData,
            }
        })

        const updatedSecondBand = secondBand.map((rectangle) => {
            const {x, width} = rectangle.pathData;
            const halfWidth = width / 2;
            const distanceToSelectionRectangleTop = Math.abs(selectionRectangleTop - secondBandY);
            const shrinkHeightValue = distanceToSelectionRectangleTop * sizes.HEIGHT_SHRINK_COEFFICIENT;
            const shrinkTopValue = Math.pow(distanceToSelectionRectangleTop * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const shrinkTop = shrinkTopValue >= halfWidth ? halfWidth : shrinkTopValue;
            const height = shrinkHeightValue >= sizes.RECTANGLE_HEIGHT ? 0 : sizes.RECTANGLE_HEIGHT - shrinkHeightValue;
            const distanceToSelectionRectangleBottom = Math.abs(selectionRectangleBottom - (secondBandY + height));
            const shrinkBottomValue = Math.pow((distanceToSelectionRectangleBottom) * sizes.WIDTH_SHRINK_COEFFICIENT, 2);
            const shrinkBottom = shrinkBottomValue >= halfWidth ? halfWidth : shrinkBottomValue
            const pathData = {x, y: secondBandY, width, height, shrinkTop, shrinkBottom};

            secondBandY += height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS;

            return {
                ...rectangle,
                pathData,
            }
        })

        configClone[bandId] = [...updatedFirstBand, ...updatedSecondBand]

        return configClone
    }

    return config.map((band, index) => {
        const baseBand = baseConfig[index];

        return band.map((rectangle, index) => {
            const {x, width} = baseBand[index].pathData;
            const {y, height, shrinkTop, shrinkBottom} = rectangle.pathData;
            const pathData = {x, y, width, height, shrinkTop, shrinkBottom};

            return {
                ...rectangle,
                pathData
            };
        })
    })
}