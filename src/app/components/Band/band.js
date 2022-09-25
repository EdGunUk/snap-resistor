import {useRef, useState} from "react";
import Rectangle from "../Rectangle/rectangle";
import {Group} from "./styled";

const Band = ({id, data}) => {
    const [translateY, setTranslateY] = useState(0);
    const dragData = useRef({
        toggle: false,
        startClientY: 0,
        endTranslateY: 0,
    });

    const handlePointerDown = (e) => {
        const {current} = dragData;

        current.toggle = true;
        current.startClientY = e.clientY;
    }

    const handlePointerMove = (e) => {
        const {toggle, startClientY, endTranslateY} = dragData.current;

        if (toggle) {
            setTranslateY(e.clientY - startClientY + endTranslateY);
        }
    }

    const handlePointerUp = () => {
        const {current} = dragData;

        current.toggle = false;
        current.endTranslateY = translateY;
    }

    return (
        <Group
            data-band-id={id}
            translateY={translateY}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {data.map((data) => {
                const {id} = data;

                return <Rectangle key={id} {...data}/>
            })}
        </Group>
    );
}

export default Band;
