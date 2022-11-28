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

        const { animateObj: prevAnimateObj } = getDragData(bandId);

        prevAnimateObj?.stop();
        setCursor(cursorTypes.NS_RESIZE);
        setDragData(bandId, { startClientY: e.clientY });
    };

    const handlePointerMove = (e) => {
        const { bandId } = getDragData();
        if (!bandId) return;

        const { isReverse, startClientY, endTranslateY } = getDragData(bandId);
        const translateY = e.clientY - startClientY + endTranslateY;

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
            // TODO: refactor updateConfigInRange func
            config,
            baseConfig,
            reversedConfig,
            bandId,
            translateY,
            isReverse,
        });

        const draw = (translateY) => {
            console.log('draw', translateY);
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

            const props = {
                translateY,
                endTranslateY: translateY,
            };

            setDragData(bandId, props, true);
        };

        const callback = () => {
            console.log('finish');
        };

        const animateObj = animate({
            from: translateY,
            to: updatedConfigInRange.translateY,
            duration: 3000,
            easing: linear,
            draw,
            callback,
        });

        const props = {
            isReverse: updatedConfigInRange.isReverse, // TODO: check why doesn't work correctly in reverse side
            animateObj,
        };

        setCursor(cursorTypes.AUTO);
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
