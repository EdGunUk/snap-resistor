import * as sizes from "../consts/sizes";
import * as opacity from "../consts/opacity";
import * as deformationTypes from "../consts/deformationTypes";
import uniqid from 'uniqid';

const convertHexToRGBA = (hexCode, opacity = 1) => {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity})`;
};

export const calculateResistorWidth = (windowWidth) => {
    return windowWidth <= sizes.RESISTOR_WIDTH ? windowWidth : sizes.RESISTOR_WIDTH;
}

export const calculateResistorValue = (props) => {
    const mappedProps = Object.fromEntries(Object.entries(props).map(([key, value]) => [key, (value === null) ? value : value.toString()]));
    const {firstBandValue, secondBandValue, thirdBandValue, multiplierValue} = mappedProps;
    const totalBandValue = (thirdBandValue === null) ? firstBandValue + secondBandValue : firstBandValue + secondBandValue + "." + thirdBandValue;

    return totalBandValue * multiplierValue;
}

export const divideBand = (band) => {
    const halfLength = band.length / 2;
    const middleIndexFirstBand = Math.floor(halfLength);
    const middleIndexSecondBand = Math.ceil(halfLength);
    const firstBand = band.slice(0, middleIndexFirstBand);
    const secondBand = band.slice(-middleIndexSecondBand);

    return [firstBand, secondBand];
}

export const calculateRectangleWidth = (count, resistorWidth) => {
    const fullSpaceWidth = (count - 1) * sizes.SPASE_BETWEEN_COLORED_RECTANGLE_X_AXIOS;

    return (resistorWidth - fullSpaceWidth) / count;
}

export const calculateRectangleXCoords = (index, rectangleWidth) => {
    return (rectangleWidth + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_X_AXIOS) * index;
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

export const calculateOpacity = (pathData, selectionRectangleYCoords) => {
    const {y, height} = pathData;
    const {center: selectionRectangleCenter} = selectionRectangleYCoords;
    const distanceToSelectionRectangleCenter = Math.abs(selectionRectangleCenter - (y + height / 2));
    const opacityValue = distanceToSelectionRectangleCenter * opacity.OPACITY_COEFFICIENT;

    return opacityValue >= opacity.MAX_OPACITY_VALUE ? opacity.MIN_OPACITY_VALUE : opacity.MAX_OPACITY_VALUE - opacityValue
}

export const getDeformationConfig = (count) => {
    const halfCount = (count - 1) / 2;
    const halfCountFloor = Math.floor(halfCount);
    const halfCountCeil = Math.ceil(halfCount);

    return Array.from({length: count}, (i, index) => {
        if (index === halfCountCeil && halfCountFloor === halfCountCeil) {
            return [deformationTypes.RIGHT, deformationTypes.LEFT]
        }

        if (index === halfCountFloor) {
            return [deformationTypes.RIGHT, deformationTypes.CENTER]
        }

        if (index === halfCountCeil) {
            return [deformationTypes.CENTER, deformationTypes.LEFT]
        }

        if (index < halfCountFloor) {
            return [deformationTypes.RIGHT, deformationTypes.RIGHT]
        }

        if (index > halfCountCeil) {
            return [deformationTypes.LEFT, deformationTypes.LEFT]
        }
    })
}

export const calculatePath = (pathData) => {
    const {
        x,
        y,
        width,
        height,
        deformationTop,
        deformationBottom,
        deformationLeft,
        deformationRight
    } = pathData;

    let XP0;
    let XP1;
    let XP2;
    let XP3;

    switch (deformationLeft) {
        case deformationTypes.RIGHT:
            XP0 = x + deformationBottom
            XP3 = x + deformationTop;
            break;
        case deformationTypes.CENTER:
            XP0 = x
            XP3 = x
            break;
        case deformationTypes.LEFT:
            XP0 = x - deformationBottom
            XP3 = x - deformationTop;
            break;
    }

    switch (deformationRight) {
        case deformationTypes.RIGHT:
            XP1 = x + width + deformationBottom;
            XP2 = x + width + deformationTop;
            break;
        case deformationTypes.CENTER:
            XP1 = x + width;
            XP2 = x + width;
            break;
        case deformationTypes.LEFT:
            XP1 = x + width - deformationBottom;
            XP2 = x + width - deformationTop;
            break;
    }

    const YP0 = y;
    const YP1 = y;
    const YP2 = y + height;
    const YP3 = y + height;

    return `M${XP0} ${YP0} L${XP1} ${YP1} ${XP2} ${YP2} ${XP3} ${YP3} Z`;
}

export const calculateRectangleHeight = (distanceToSelectionRectangleYCoord) => {
    const shrinkHeightValue = distanceToSelectionRectangleYCoord * sizes.HEIGHT_SHRINK_COEFFICIENT;

    return shrinkHeightValue >= sizes.RECTANGLE_HEIGHT ? 0 : sizes.RECTANGLE_HEIGHT - shrinkHeightValue;
}

export const calculateRectangleDeformation = (distanceToSelectionRectangleYCoord, halfWidth) => {
    const deformation = Math.pow((distanceToSelectionRectangleYCoord) * sizes.DEFORMATION_COEFFICIENT, 2);

    return deformation >= halfWidth ? halfWidth : deformation;
}

export const calculatedDistanceToSelectionRectangleYCoord = (selectionRectangleYCoord, y) => {
    return Math.abs(selectionRectangleYCoord - y);
}

export const calculatePathData = (pathData, selectionRectangleYCoords, isReverse) => {
    const {y, width} = pathData;
    const halfWidth = width / 2;
    const {top: selectionRectangleTop, bottom: selectionRectangleBottom} = selectionRectangleYCoords;

    if (isReverse) {
        const distanceToSelectionRectangleBottom = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleBottom, y);
        const height = calculateRectangleHeight(distanceToSelectionRectangleBottom);
        const newY = y - height;
        const distanceToSelectionRectangleTop = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleTop, newY);
        const deformationBottom = calculateRectangleDeformation(distanceToSelectionRectangleBottom, halfWidth);
        const deformationTop = calculateRectangleDeformation(distanceToSelectionRectangleTop, halfWidth);

        return {
            ...pathData,
            deformationBottom,
            deformationTop,
            y: newY,
            height,
        }
    }

    const distanceToSelectionRectangleTop = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleTop, y);
    const height = calculateRectangleHeight(distanceToSelectionRectangleTop);
    const newY = y + height;
    const distanceToSelectionRectangleBottom = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleBottom, newY);
    const deformationBottom = calculateRectangleDeformation(distanceToSelectionRectangleBottom, halfWidth);
    const deformationTop = calculateRectangleDeformation(distanceToSelectionRectangleTop, halfWidth);

    return {
        ...pathData,
        deformationBottom,
        deformationTop,
        height,
    }
}

export const getBaseConfig = (config, resistorWidth) => {
    const deformationConfig = getDeformationConfig(config.length);
    const width = calculateRectangleWidth(config.length, resistorWidth);
    const selectionRectangleYCoords = calculateSelectionRectangleYCoords();
    const {top: selectionRectangleTop} = selectionRectangleYCoords;

    return config.map((band, index) => {
        const [deformationLeft, deformationRight] = deformationConfig[index]
        const x = calculateRectangleXCoords(index, width);
        let y = selectionRectangleTop;

        return band.map((rectangle) => {
            const {color} = rectangle;
            const pathData = calculatePathData({
                x,
                y,
                width,
                deformationLeft,
                deformationRight
            }, selectionRectangleYCoords);
            const opacity = calculateOpacity(pathData, selectionRectangleYCoords)
            const fill = convertHexToRGBA(color, opacity)
            const id = uniqid();

            y += pathData.height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS;

            return {
                ...rectangle,
                pathData,
                fill,
                id
            }
        })
    })
}

export const updateBand = (bandPart, translateY, isReverse) => {

    if (bandPart.length === 0) {
        return bandPart;
    }

    const selectionRectangleYCoords = calculateSelectionRectangleYCoords();
    let y = bandPart[0].pathData.y + translateY;
    let multiplier = 1;

    if (isReverse) {
        bandPart.reverse();
        y = bandPart[0].pathData.y + bandPart[0].pathData.height + translateY;
        multiplier = -1;
    }

    return bandPart.map((rectangle) => {
        const {color, pathData: prevPathData} = rectangle;
        const pathData = calculatePathData({...prevPathData, y}, selectionRectangleYCoords, isReverse);
        const opacity = calculateOpacity(pathData, selectionRectangleYCoords);
        const fill = convertHexToRGBA(color, opacity);

        y += (pathData.height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS) * multiplier;

        return {
            ...rectangle,
            pathData,
            fill,
        }
    })
}

export const getClosestRectangleIndex = (baseBand, currentBand) => {
    const {top: selectionRectangleTop} = calculateSelectionRectangleYCoords();
    let closestDistance = null;
    let closestColor = null; //TODO change to index

    currentBand.forEach((rectangle) => {
        const {color, pathData: {y}} = rectangle;
        const currentDistance = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleTop, y);

        if (closestDistance !== null && closestDistance <= currentDistance) return;

        closestDistance = currentDistance;
        closestColor = color;
    })

    return baseBand.findIndex((rectangle) => rectangle.color === closestColor);
}

export const updateConfig = (props) => {
    const {baseConfig, config, bandId, translateY} = props;
    const isNeedUpdateCurrentBand = 'bandId' in props && 'translateY' in props;

    if (isNeedUpdateCurrentBand) {
        const configClone = [...config];
        const baseBand = baseConfig[bandId];
        const currentBand = configClone[bandId];
        const index = getClosestRectangleIndex(baseBand, currentBand);
        const [firstBand, secondBand] = divideBand(baseBand);
        const updatedFirstBand = updateBand(firstBand, translateY, true);
        const updatedSecondBand = updateBand(secondBand, translateY);

        configClone[bandId] = [...updatedFirstBand, ...updatedSecondBand];

        return configClone;
    }

    return config.map((band, index) => {
        const baseBand = baseConfig[index];

        return band.map((rectangle, index) => {
            const {x, width} = baseBand[index].pathData;
            const pathData = {
                ...rectangle.pathData,
                width,
                x,
            };

            return {
                ...rectangle,
                pathData
            };
        })
    })
}