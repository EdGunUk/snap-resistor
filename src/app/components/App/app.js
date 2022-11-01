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
    const [cursor, setCursor] = useState(cursorTypes.AUTO);
    const [config, setConfig] = useState(baseConfig);
    const dragData = useRef({
        bandId: null,
        translateY: 0,
        startClientY: 0,
        bandsEndTranslateY: [],
    });

    useEffect(() => {
        setConfig((config) => updateConfig({baseConfig, config}));
    }, [baseConfig])

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
        const {bandId, startClientY, bandsEndTranslateY} = current;
        if (!bandId) return;

        const endTranslateY = bandsEndTranslateY[bandId] ?? 0;
        const translateY = e.clientY - startClientY + endTranslateY;

        setConfig((config) => updateConfig({baseConfig, config, bandId, translateY}));
        current.translateY = translateY;
    }

    const handlePointerUp = () => {
        const {current} = dragData;
        const {bandId, bandsEndTranslateY} = current;
        if (!bandId) return;

        setCursor(cursorTypes.AUTO);
        bandsEndTranslateY[bandId] = current.translateY;
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
