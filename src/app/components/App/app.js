import BackgroundGradient from "../BackgroundGradient/backgroundGradient";
import Resistor from "../Resistor/resistor";
import {useEffect, useMemo, useRef, useState} from "react";
import {Main} from "../Main/styled";
import {calculateResistorWidth, getBaseConfig, updateConfig} from "../../utils/helpers";
import useWindowSize from "../../hooks/useWindowSize";
import * as resistorConfigs from "../../consts/resistorConfigs";
import * as cursorTypes from "../../consts/cursorTypes";
import * as sizes from "../../consts/sizes";


const App = () => {
    const windowSize = useWindowSize();
    const resistorHeight = sizes.RESISTOR_HEIGHT;
    const resistorWidth = useMemo(() => calculateResistorWidth(windowSize.width), [windowSize.width]);
    const baseConfig = useMemo(() => getBaseConfig(resistorConfigs.FORE_BAND, resistorWidth), [resistorWidth]);
    const reversedConfig = useMemo(() => getBaseConfig(resistorConfigs.FORE_BAND, resistorWidth, true), [resistorWidth]);
    const [cursor, setCursor] = useState(cursorTypes.AUTO);
    const [config, setConfig] = useState(baseConfig);
    const dragData = useRef({
        bandId: null,
        translateY: 0,
        startClientY: 0,
        bandsEndTranslateY: [],
        bandsReverse: []
    });

    useEffect(() => {
        setConfig((config) => updateConfig({baseConfig, config}));
    }, [baseConfig])

    const updateConfigInRange = (props) => {
        const {dragData, config, baseConfig, reversedConfig} = props;
        const {bandId, translateY, bandsReverse} = dragData.current;
        const configClone = [...config];
        const band = config[bandId]
        const baseBand = baseConfig[bandId]
        const reversedBand = reversedConfig[bandId];
        const isReverse = bandsReverse[bandId] ?? false;
        const bottomIndex = isReverse ? band.length - 1 : 0;
        const topIndex = isReverse ? 0 : band.length - 1;
        const isOutOfBottomRange = band[bottomIndex].pathData.y > baseBand[0].pathData.y;
        const isOutOfTopRange = band[topIndex].pathData.y < reversedBand[0].pathData.y;

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

        return {
            config: configClone,
            translateY,
            isReverse,
        }
    }


    const handlePointerDown = (e) => {
        const band = e.target.closest('g[data-band-id]');
        if (!band) return;

        const {current} = dragData;
        setCursor(cursorTypes.NS_RESIZE);
        current.startClientY = e.clientY;
        current.bandId = band.getAttribute('data-band-id');
    }

    const handlePointerMove = (e) => {
        const {current} = dragData;
        const {bandId, startClientY, bandsEndTranslateY, bandsReverse} = current;
        if (!bandId) return;

        const isReverse = bandsReverse[bandId] ?? false;
        const endTranslateY = bandsEndTranslateY[bandId] ?? 0;
        const translateY = e.clientY - startClientY + endTranslateY;

        setConfig((config) => updateConfig({
            config,
            baseConfig: isReverse ? reversedConfig : baseConfig,
            bandId,
            translateY,
            isReverse
        }));
        current.translateY = translateY;
    }

    const handlePointerUp = () => {
        const {current} = dragData;
        const {bandId, bandsEndTranslateY, bandsReverse} = current;
        if (!bandId) return;

        const updatedConfigInRange = updateConfigInRange({dragData, config, baseConfig, reversedConfig});

        setCursor(cursorTypes.AUTO);
        setConfig(updatedConfigInRange.config);
        bandsEndTranslateY[bandId] = updatedConfigInRange.translateY;
        bandsReverse[bandId] = updatedConfigInRange.isReverse;
        current.bandId = null;
    }

    return (
        <Main
            cursor={cursor}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <BackgroundGradient/>
            <Resistor height={resistorHeight} width={resistorWidth} config={config}/>
        </Main>
    );
}

export default App;
