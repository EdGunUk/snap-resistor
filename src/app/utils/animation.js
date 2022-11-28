export const recalculateRange = ({ value, from, to }) => {
    // const { value, inMin, inMax, outMin, outMax } = props;
    // return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

    return from + value * (to - from);
};

export const animate = ({ from, to, draw, duration, easing, callback }) => {
    const start = performance.now();
    let isContinue = true;

    const animate = (time) => {
        if (!isContinue) return;

        const timeFraction = (time - start) / duration;
        let timeFractionInRange = timeFraction < 0 ? 0 : timeFraction;

        if (timeFractionInRange > 1) timeFractionInRange = 1;

        const progress = easing(timeFractionInRange);
        const progressInRange = recalculateRange({ value: progress, from, to });

        draw(progressInRange);

        if (timeFractionInRange === 1) callback?.();

        if (timeFractionInRange < 1) requestAnimationFrame(animate);
    };

    const stop = () => {
        isContinue = false;
    };

    requestAnimationFrame(animate);

    return { stop };
};

export const linear = (timeFraction) => timeFraction;
