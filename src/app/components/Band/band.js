import Rectangle from "../Rectangle/rectangle";
import {Group} from "./styled";

const Band = ({id, data}) => {
    return (
        <Group data-band-id={id}>
            {data.map((data) => {
                const {id} = data;

                return <Rectangle key={id} {...data}/>
            })}
        </Group>
    );
}

export default Band;
