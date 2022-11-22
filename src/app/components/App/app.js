import { useEffect, useMemo, useState } from 'react';

import * as cursorTypes from '../../consts/cursorTypes';
import * as resistorConfigs from '../../consts/resistorConfigs';
import * as sizes from '../../consts/sizes';
import useDragData from '../../hooks/useDragData';
import useWindowSize from '../../hooks/useWindowSize';
import { animate, linear } from '../../utils/animation';
import { calculateResistorWidth, getBaseConfig, updateConfig, updateConfigInRange } from '../../utils/resistor';
import BackgroundGradient from '../BackgroundGradient/backgroundGradient';
import { Main } from '../Main/styled';
import Resistor from '../Resistor/resistor';

const App = () => {
    const windowSize = useWindowSize();
    const { getDragData, setDragData } = useDragData();
    const resistorWidth = useMemo(() => calculateResistorWidth(windowSize.width), [windowSize.width]);
    const baseConfig = useMemo(() => getBaseConfig(resistorConfigs.FORE_BAND, resistorWidth), [resistorWidth]);
    const reversedConfig = useMemo(
        () => getBaseConfig(resistorConfigs.FORE_BAND, resistorWidth, true),
        [resistorWidth]
    );
    const [cursor, setCursor] = useState(cursorTypes.AUTO);
    const [config, setConfig] = useState(baseConfig);

    useEffect(() => {
        setConfig((config) => updateConfig({ baseConfig, config }));
    }, [baseConfig]);

    const handlePointerDown = (e) => {
        const band = e.target.closest('g[data-band-id]');
        const bandId = band?.getAttribute('data-band-id');
        if (!bandId) return;

        setCursor(cursorTypes.NS_RESIZE);
        setDragData(bandId, { startClientY: e.clientY });
    };

    const handlePointerMove = (e) => {
        const { bandId } = getDragData();
        if (!bandId) return;

        // eslint-disable-next-line no-unused-vars
        const { isReverse, startClientY, translateY: prevTranslateY, endTranslateY } = getDragData(bandId);
        const translateY = e.clientY - startClientY + endTranslateY;

        // console.log(translateY, prevTranslateY);
        // animate({
        //     from: translateY,
        //     to: prevTranslateY,
        //     draw: (t) => console.log('draw', t),
        //     duration: 200,
        //     easing: linear,
        //     callback: () => console.log('finish'),
        // });

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

        setDragData(bandId, { translateY });
    };

    const handlePointerUp = () => {
        const { bandId } = getDragData();
        if (!bandId) return;

        const { isReverse, translateY } = getDragData(bandId);
        const updatedConfigInRange = updateConfigInRange({
            config,
            baseConfig,
            reversedConfig,
            bandId,
            translateY,
            isReverse,
        });

        const props = {
            isReverse: updatedConfigInRange.isReverse,
            translateY: updatedConfigInRange.translateY,
            endTranslateY: updatedConfigInRange.translateY,
        };

        console.log(translateY, updatedConfigInRange.translateY);

        animate({
            from: translateY,
            to: updatedConfigInRange.translateY,
            draw: (t) => console.log('draw', t),
            duration: 200,
            easing: linear,
            callback: () => console.log('finish'),
        });

        setCursor(cursorTypes.AUTO);
        setConfig(updatedConfigInRange.config);
        setDragData(bandId, props);
        setDragData(null);
    };

    return (
        <Main
            cursor={cursor}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <BackgroundGradient />
            <Resistor height={sizes.RESISTOR_HEIGHT} width={resistorWidth} config={config} />
        </Main>
    );
};

export default App;
