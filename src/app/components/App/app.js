import { useEffect, useMemo, useRef, useState } from 'react';

import * as cursorTypes from '../../consts/cursorTypes';
import * as resistorConfigs from '../../consts/resistorConfigs';
import * as sizes from '../../consts/sizes';
import useWindowSize from '../../hooks/useWindowSize';
import { calculateResistorWidth, getBaseConfig, updateConfig, updateConfigInRange } from '../../utils/resistor';
import BackgroundGradient from '../BackgroundGradient/backgroundGradient';
import { Main } from '../Main/styled';
import Resistor from '../Resistor/resistor';

const App = () => {
    const windowSize = useWindowSize();
    const resistorHeight = sizes.RESISTOR_HEIGHT;
    const resistorWidth = useMemo(() => calculateResistorWidth(windowSize.width), [windowSize.width]);
    const baseConfig = useMemo(() => getBaseConfig(resistorConfigs.FORE_BAND, resistorWidth), [resistorWidth]);
    const reversedConfig = useMemo(
        () => getBaseConfig(resistorConfigs.FORE_BAND, resistorWidth, true),
        [resistorWidth]
    );
    const [cursor, setCursor] = useState(cursorTypes.AUTO);
    const [config, setConfig] = useState(baseConfig);
    const dragData = useRef({
        bandId: null,
        translateY: 0,
        startClientY: 0,
        bandsEndTranslateY: [],
        bandsReverse: [],
    });

    useEffect(() => {
        setConfig((config) => updateConfig({ baseConfig, config }));
    }, [baseConfig]);

    const handlePointerDown = (e) => {
        const band = e.target.closest('g[data-band-id]');
        if (!band) return;

        const { current } = dragData;
        setCursor(cursorTypes.NS_RESIZE);
        current.startClientY = e.clientY;
        current.bandId = band.getAttribute('data-band-id');
    };

    const handlePointerMove = (e) => {
        const { current } = dragData;
        const { bandId, startClientY, bandsEndTranslateY, bandsReverse } = current;
        if (!bandId) return;

        const isReverse = bandsReverse[bandId] ?? false;
        const endTranslateY = bandsEndTranslateY[bandId] ?? 0;
        const prevTranslateY = current.translateY;
        const translateY = e.clientY - startClientY + endTranslateY;

        console.log(translateY, prevTranslateY, endTranslateY);

        setConfig((config) =>
            updateConfig({
                config,
                baseConfig,
                reversedConfig,
                bandId,
                translateY,
                isReverse,
            })
        );
        current.translateY = translateY;
    };

    const handlePointerUp = () => {
        const { current } = dragData;
        const { bandId, translateY, bandsEndTranslateY, bandsReverse } = current;
        if (!bandId) return;

        const isReverse = bandsReverse[bandId] ?? false;

        const updatedConfigInRange = updateConfigInRange({
            config,
            baseConfig,
            reversedConfig,
            bandId,
            translateY,
            isReverse,
        });

        setCursor(cursorTypes.AUTO);
        setConfig(updatedConfigInRange.config);
        current.translateY = updatedConfigInRange.translateY;
        bandsEndTranslateY[bandId] = updatedConfigInRange.translateY;
        bandsReverse[bandId] = updatedConfigInRange.isReverse;
        current.bandId = null;
    };

    return (
        <Main
            cursor={cursor}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <BackgroundGradient />
            <Resistor height={resistorHeight} width={resistorWidth} config={config} />
        </Main>
    );
};

export default App;
