import BackgroundGradient from "../BackgroundGradient/backgroundGradient";
import Resistor from "../Resistor/resistor";
import {useEffect, useMemo, useRef, useState} from "react";
import {FullSizeContainer} from "../../styled/objects/containers";
import {Main} from "../Main/styled";
import {calculateResistorSize, checkIsFullScreen, getBaseConfig, updateConfig} from "../../utils/helpers";
import useWindowSize from "../../hooks/useWindowSize";
import * as resistorConfig from "../../consts/resistorConfig";


const App = () => {
    const windowSize = useWindowSize();
    const isFullScreen = checkIsFullScreen(windowSize.width);
    const resistorSize = useMemo(() => calculateResistorSize(windowSize, isFullScreen), [windowSize, isFullScreen]);
    const baseConfig = useMemo(() => getBaseConfig(resistorConfig.FORE_BAND, resistorSize.width, resistorSize.height), [resistorSize.width, resistorSize.height]);
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

        bandsEndTranslateY[bandId] = current.translateY;
        current.bandId = null;
    }


    return (
        <Main
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <FullSizeContainer as="svg">
                <BackgroundGradient/>
                <Resistor {...resistorSize} config={config}/>
            </FullSizeContainer>
        </Main>
    );
}

export default App;
