import { useRef } from 'react';

const useDragData = () => {
    const dragData = useRef({
        bandId: null,
        bandsData: [],
    });

    const getDragData = (bandId) => {
        const { current } = dragData;
        if (!bandId) return { bandId: current.bandId };

        const bandData = current.bandsData[bandId] ?? {};

        return {
            isReverse: bandData.isReverse ?? false,
            startClientY: bandData.startClientY ?? 0,
            translateY: bandData.translateY ?? 0,
            endTranslateY: bandData.endTranslateY ?? 0,
        };
    };

    const setDragData = (bandId, props) => {
        const { current } = dragData;

        current.bandId = bandId;

        if (bandId !== null && typeof props === 'object') {
            current.bandsData[bandId] = {
                ...current.bandsData[bandId],
                ...props,
            };
        }
    };

    return {
        getDragData,
        setDragData,
    };
};

export default useDragData;
