import { useLayoutEffect } from 'react';

import * as colors from '../../styled/settings/colors';
import { Container, Rect, Stop } from './styled';

const BackgroundGradient = () => {
    useLayoutEffect(() => {
        const meta = document.querySelector('meta[name=theme-color]');
        meta.setAttribute('content', colors.LIGHT_SILVER);
    }, []);

    return (
        <Container as="svg">
            <radialGradient id="gradient" r="100%">
                <Stop stopColor={colors.WHITE} offset="0%" />
                <Stop stopColor={colors.LIGHT_SILVER} offset="50%" />
            </radialGradient>
            <Rect as="rect" x="0" y="0" />
        </Container>
    );
};

export default BackgroundGradient;
