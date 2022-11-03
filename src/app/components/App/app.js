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

    const updateConfigInRange = () => {
        const {current} = dragData;
        const {bandId, translateY, bandsEndTranslateY, bandsReverse} = current;
        const configClone = [...config];
        const band = config[bandId]
        const baseBand = baseConfig[bandId]
        const reversedBand = reversedConfig[bandId];
        const isReverse = bandsReverse[bandId] ?? false;


        if (isReverse) {
            if (band[band.length - 1].pathData.y > baseBand[0].pathData.y) {
                configClone[bandId] = baseBand;
                setConfig(configClone);
                bandsEndTranslateY[bandId] = 0
                bandsReverse[bandId] = false;
            } else if(band[0].pathData.y < reversedBand[0].pathData.y){
                configClone[bandId] = reversedBand;
                setConfig(configClone);
                bandsEndTranslateY[bandId] = 0
                bandsReverse[bandId] = true;
            }
            else {
                bandsEndTranslateY[bandId] = translateY;
            }
        } else {
            if (band[band.length - 1].pathData.y < reversedBand[0].pathData.y) {
                configClone[bandId] = reversedBand;
                setConfig(configClone);
                bandsEndTranslateY[bandId] = 0
                bandsReverse[bandId] = true;
            } else if (band[0].pathData.y > baseBand[0].pathData.y) {
                configClone[bandId] = baseBand;
                setConfig(configClone);
                bandsEndTranslateY[bandId] = 0
                bandsReverse[bandId] = false;
            } else {
                bandsEndTranslateY[bandId] = translateY;
            }
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
        const {bandId} = current;
        if (!bandId) return;

        updateConfigInRange();
        setCursor(cursorTypes.AUTO);
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
