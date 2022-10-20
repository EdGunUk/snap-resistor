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

export const divideArr = (arr) => {
    const middleIndex = Math.ceil(arr.length / 2);
    const firstPart = [...arr].splice(0, middleIndex);
    const secondPart = [...arr].splice(-middleIndex);

    return [firstPart, secondPart, middleIndex];
}

export const calculateRectangleWidth = (resistorSize, count) => {
    const spacesSize = (count - 1) * sizes.SPASE_BETWEEN_COLORED_RECTANGLE_X_AXIOS;

    return (resistorSize - spacesSize) / count;
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

export const calculateOpacity = (pathData) => {
    const {y, height} = pathData;
    const {center: selectionRectangleCenter} = calculateSelectionRectangleYCoords();
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

export const getBaseConfig = (config, resistorWidth) => {
    const deformationConfig = getDeformationConfig(config.length);
    const width = calculateRectangleWidth(resistorWidth, config.length);
    const halfWidth = width / 2;
    const {
        top: selectionRectangleTop,
        bottom: selectionRectangleBottom
    } = calculateSelectionRectangleYCoords();

    // TODO get center on every item for smooth scroll
    return config.map((band, index) => {
        const [deformationLeft, deformationRight] = deformationConfig[index]
        const x = calculateRectangleXCoords(width, index);
        let y = selectionRectangleTop;

        return band.map((rectangle) => {
            const {color} = rectangle;
            const distanceToSelectionRectangleTop = Math.abs(selectionRectangleTop - y);
            const shrinkHeightValue = distanceToSelectionRectangleTop * sizes.HEIGHT_SHRINK_COEFFICIENT;
            const deformationTopValue = Math.pow(distanceToSelectionRectangleTop * sizes.DEFORMATION_COEFFICIENT, 2);
            const deformationTop = deformationTopValue >= halfWidth ? halfWidth : deformationTopValue;
            const height = shrinkHeightValue >= sizes.RECTANGLE_HEIGHT ? 0 : sizes.RECTANGLE_HEIGHT - shrinkHeightValue;
            const distanceToSelectionRectangleBottom = Math.abs(selectionRectangleBottom - (y + height));
            const deformationBottomValue = Math.pow((distanceToSelectionRectangleBottom) * sizes.DEFORMATION_COEFFICIENT, 2);
            const deformationBottom = deformationBottomValue >= halfWidth ? halfWidth : deformationBottomValue;

            const pathData = {
                x,
                y,
                width,
                height,
                deformationTop,
                deformationBottom,
                deformationLeft,
                deformationRight
            };

            y += height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS;

            const opacity = calculateOpacity(pathData)
            const fill = convertHexToRGBA(color, opacity)
            const id = uniqid();

            return {
                ...rectangle,
                pathData,
                fill,
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

        const updatedFirstBand = firstBand.reverse().map((rectangle, index) => {
            const {color, pathData: {x, width, deformationLeft, deformationRight}} = rectangle;
            const halfWidth = width / 2;
            const distanceToSelectionRectangleTop = Math.abs(selectionRectangleTop + sizes.RECTANGLE_HEIGHT - firstBandY);
            const shrinkHeightValue = distanceToSelectionRectangleTop * sizes.HEIGHT_SHRINK_COEFFICIENT;
            const deformationTopValue = Math.pow(distanceToSelectionRectangleTop * sizes.DEFORMATION_COEFFICIENT, 2);
            const deformationTop = deformationTopValue >= halfWidth ? halfWidth : deformationTopValue;
            const height = shrinkHeightValue >= sizes.RECTANGLE_HEIGHT ? 0 : sizes.RECTANGLE_HEIGHT - shrinkHeightValue;
            const distanceToSelectionRectangleBottom = Math.abs((selectionRectangleBottom + sizes.RECTANGLE_HEIGHT) - (firstBandY + height));
            const deformationBottomValue = Math.pow((distanceToSelectionRectangleBottom) * sizes.DEFORMATION_COEFFICIENT, 2);
            const deformationBottom = deformationBottomValue >= halfWidth ? halfWidth : deformationBottomValue;

            firstBandY -= (height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS);

            const pathData = {
                x,
                y: firstBandY,
                width,
                height,
                deformationTop,
                deformationBottom,
                deformationLeft,
                deformationRight
            };

            const opacity = calculateOpacity(pathData);
            const fill = convertHexToRGBA(color, opacity);

            return {
                ...rectangle,
                pathData,
                fill,
            }
        })

        const updatedSecondBand = secondBand.map((rectangle, index) => {
            const {color, pathData: {x, width, deformationLeft, deformationRight}} = rectangle;
            const halfWidth = width / 2;
            const distanceToSelectionRectangleTop = Math.abs(selectionRectangleTop - secondBandY);
            const shrinkHeightValue = distanceToSelectionRectangleTop * sizes.HEIGHT_SHRINK_COEFFICIENT;
            const deformationTopValue = Math.pow(distanceToSelectionRectangleTop * sizes.DEFORMATION_COEFFICIENT, 2);
            const deformationTop = deformationTopValue >= halfWidth ? halfWidth : deformationTopValue;
            const height = shrinkHeightValue >= sizes.RECTANGLE_HEIGHT ? 0 : sizes.RECTANGLE_HEIGHT - shrinkHeightValue;
            const distanceToSelectionRectangleBottom = Math.abs(selectionRectangleBottom - (secondBandY + height));
            const deformationBottomValue = Math.pow(distanceToSelectionRectangleBottom * sizes.DEFORMATION_COEFFICIENT, 2);
            const deformationBottom = deformationBottomValue >= halfWidth ? halfWidth : deformationBottomValue;

            const pathData = {
                x,
                y: secondBandY,
                width,
                height,
                deformationTop,
                deformationBottom,
                deformationLeft,
                deformationRight
            };

            secondBandY += height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS;

            const opacity = calculateOpacity(pathData);
            const fill = convertHexToRGBA(color, opacity)

            return {
                ...rectangle,
                pathData,
                fill,
            }
        })

        configClone[bandId] = [...updatedFirstBand, ...updatedSecondBand]

        return configClone
    }

    return config.map((band, index) => {
        const baseBand = baseConfig[index];

        return band.map((rectangle, index) => {
            const {x, width} = baseBand[index].pathData;
            const {
                y,
                height,
                deformationTop,
                deformationBottom,
                deformationLeft,
                deformationRight
            } = rectangle.pathData;

            const pathData = {
                x,
                y,
                width,
                height,
                deformationTop,
                deformationBottom,
                deformationLeft,
                deformationRight
            };

            return {
                ...rectangle,
                pathData
            };
        })
    })
}