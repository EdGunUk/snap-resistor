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

export const calculateResistorValue = (props) => {
    const mappedProps = Object.fromEntries(Object.entries(props).map(([key, value]) => [key, (value === null) ? value : value.toString()]));
    const {firstBandValue, secondBandValue, thirdBandValue, multiplierValue} = mappedProps;
    const totalBandValue = (thirdBandValue === null) ? firstBandValue + secondBandValue : firstBandValue + secondBandValue + "." + thirdBandValue;

    return totalBandValue * multiplierValue;
}

export const calculateResistorWidth = (windowWidth) => {
    return windowWidth <= sizes.RESISTOR_WIDTH ? windowWidth : sizes.RESISTOR_WIDTH;
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

export const calculateOpacity = (pathData, selectionRectangleYCoords) => {
    const {y, height} = pathData;
    const {center: selectionRectangleCenter} = selectionRectangleYCoords;
    const distanceToSelectionRectangleCenter = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleCenter, y + height / 2);
    const opacityValue = distanceToSelectionRectangleCenter * opacity.OPACITY_COEFFICIENT;

    return opacityValue >= opacity.MAX_OPACITY_VALUE ? opacity.MIN_OPACITY_VALUE : opacity.MAX_OPACITY_VALUE - opacityValue
}

export const getClosestRectangleIndex = (currentBand) => {
    const {center: selectionRectangleCenter} = calculateSelectionRectangleYCoords();
    let closestDistance = null;
    let closestIndex = null;

    currentBand.forEach((rectangle, index) => {
        const {pathData: {y, height}} = rectangle;
        const distanceToSelectionRectangleCenter = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleCenter, y + height / 2);
        if (closestDistance !== null && closestDistance <= distanceToSelectionRectangleCenter) return;

        closestDistance = distanceToSelectionRectangleCenter;
        closestIndex = index;
    })

    return closestIndex;
}

export const updateConfigInRange = (props) => {
    const {dragData, config, baseConfig, reversedConfig} = props;
    const {bandId, translateY, bandsReverse} = dragData.current;
    const configClone = [...config];
    const band = config[bandId]
    const baseBand = baseConfig[bandId]
    const reversedBand = reversedConfig[bandId];
    const isReverse = bandsReverse[bandId] ?? false;
    const topIndex = isReverse ? 0 : band.length - 1;
    const bottomIndex = isReverse ? band.length - 1 : 0;
    const isOutOfTopRange = band[topIndex].pathData.y < reversedBand[0].pathData.y;
    const isOutOfBottomRange = band[bottomIndex].pathData.y > baseBand[0].pathData.y;

    if (isOutOfBottomRange) {
        configClone[bandId] = baseBand;

        return {
            config: configClone,
            translateY: 0,
            isReverse: false
        }
    }

    if (isOutOfTopRange) {
        configClone[bandId] = reversedBand;

        return {
            config: configClone,
            translateY: 0,
            isReverse: true
        }
    }

    const normalizedTranslateY = normalizeTranslateY(props);
    const updatedConfig = updateConfig({
        config,
        baseConfig: isReverse ? reversedConfig : baseConfig,
        bandId,
        translateY: normalizedTranslateY,
        isReverse
    })

    return {
        config: updatedConfig,
        translateY: normalizedTranslateY,
        isReverse,
    }
}

export const normalizeTranslateY = (props) => {
    const {dragData, config, baseConfig, reversedConfig} = props;
    const {bandId, translateY, bandsReverse} = dragData.current;
    const band = config[bandId]
    const isReverse = bandsReverse[bandId] ?? false;
    const initialConfig = isReverse ? reversedConfig : baseConfig;
    const initialBand = initialConfig[bandId];
    const closestRectangleIndex = getClosestRectangleIndex(band);
    const {top: selectionRectangleTop} = calculateSelectionRectangleYCoords();

    let y = band[closestRectangleIndex].pathData.y;
    let normalizedTranslateY = translateY;

    const isIncreaseTranslateY = y < selectionRectangleTop
    const multiplier = isIncreaseTranslateY ? 1 : -1;


    while (isIncreaseTranslateY ? y < selectionRectangleTop : y > selectionRectangleTop) {
        normalizedTranslateY += sizes.NORMALIZE_TRANSLATE_Y_STEP * multiplier;
        const updatedBand = updateBand(initialBand, normalizedTranslateY, isReverse);

        y = updatedBand[closestRectangleIndex].pathData.y;
    }

    return normalizedTranslateY;
}

export const calculatePathData = (pathData, selectionRectangleYCoords, isReverse) => {
    const {y, width} = pathData;
    const halfWidth = width / 2;
    const {
        top: selectionRectangleTop,
        center: selectionRectangleCenter,
        bottom: selectionRectangleBottom
    } = selectionRectangleYCoords;

    if (isReverse) {
        const distanceToSelectionRectangleBottom = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleBottom, y);
        let height = calculateRectangleHeight(distanceToSelectionRectangleBottom);
        let newY = y - height;
        const distanceToSelectionRectangleTop = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleTop, newY);

        if (newY > selectionRectangleCenter) {
            height = calculateRectangleHeight(distanceToSelectionRectangleTop);
            newY = y - height
        }

        const deformationBottom = calculateRectangleDeformation(distanceToSelectionRectangleBottom, halfWidth);
        const deformationTop = calculateRectangleDeformation(distanceToSelectionRectangleTop, halfWidth);

        return {
            ...pathData,
            deformationBottom,
            deformationTop,
            height,
            y: newY
        }
    }

    const distanceToSelectionRectangleTop = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleTop, y);
    let height = calculateRectangleHeight(distanceToSelectionRectangleTop);
    const newY = y + height;
    const distanceToSelectionRectangleBottom = calculatedDistanceToSelectionRectangleYCoord(selectionRectangleBottom, newY);

    if (newY < selectionRectangleCenter) {
        height = calculateRectangleHeight(distanceToSelectionRectangleBottom);
    }

    const deformationBottom = calculateRectangleDeformation(distanceToSelectionRectangleBottom, halfWidth);
    const deformationTop = calculateRectangleDeformation(distanceToSelectionRectangleTop, halfWidth);

    return {
        ...pathData,
        deformationBottom,
        deformationTop,
        height,
    }
}

export const updateBand = (band, translateY, isReverse) => {
    if (band.length === 0) return band;

    const selectionRectangleYCoords = calculateSelectionRectangleYCoords();
    const firstItemPathData = band[0].pathData;
    let y = firstItemPathData.y + translateY;
    let multiplier = 1;

    if (isReverse) {
        y = firstItemPathData.y + firstItemPathData.height + translateY;
        multiplier = -1;
    }

    return band.map((rectangle) => {
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

export const getBaseBand = (band, initialPathData, isReverse) => {
    if (band.length === 0) return band;

    const bandClone = [...band];
    const selectionRectangleYCoords = calculateSelectionRectangleYCoords();
    const {top: selectionRectangleTop, bottom: selectionRectangleBottom} = selectionRectangleYCoords;
    let y = selectionRectangleTop;
    let multiplier = 1;

    if (isReverse) {
        y = selectionRectangleBottom;
        bandClone.reverse();
        multiplier = -1;
    }

    return bandClone.map((rectangle) => {
        const {color} = rectangle;
        const pathData = calculatePathData({...initialPathData, y}, selectionRectangleYCoords, isReverse);
        const opacity = calculateOpacity(pathData, selectionRectangleYCoords);
        const fill = convertHexToRGBA(color, opacity);
        const id = uniqid();

        y += (pathData.height + sizes.SPASE_BETWEEN_COLORED_RECTANGLE_Y_AXIOS) * multiplier;

        return {
            ...rectangle,
            pathData,
            fill,
            id
        }
    })
}

export const updateConfig = (props) => {
    const {baseConfig, config, bandId, translateY, isReverse} = props;
    const isNeedUpdateCurrentBand = 'bandId' in props && 'translateY' in props;

    if (isNeedUpdateCurrentBand) {
        const configClone = [...config];
        const baseBand = baseConfig[bandId];

        configClone[bandId] = updateBand(baseBand, translateY, isReverse);

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

export const getBaseConfig = (config, resistorWidth, isReverse) => {
    const deformationConfig = getDeformationConfig(config.length);
    const width = calculateRectangleWidth(config.length, resistorWidth);

    return config.map((band, index) => {
        const x = calculateRectangleXCoords(index, width);
        const [deformationLeft, deformationRight] = deformationConfig[index]
        const initialPathData = {
            x,
            width,
            deformationLeft,
            deformationRight
        };

        return getBaseBand(band, initialPathData, isReverse);
    })
}