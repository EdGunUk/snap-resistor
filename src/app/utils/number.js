export const addZeroes = (num, zeroes) => {
    const decLength = String(num).split('.')[1]?.length ?? 0;
    const digits = Math.max(decLength, zeroes);

    return Number(num).toFixed(digits);
};
