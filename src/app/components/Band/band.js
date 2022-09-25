import Rectangle from "../Rectangle/rectangle";

const Band = ({data}) => {
    return (
        <g>
            {data.map((data) => {
                const {id} = data;

                return <Rectangle key={id} {...data}/>
            })}
        </g>
    );
}

export default Band;
