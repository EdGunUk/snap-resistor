import Rectangle from '../Rectangle/rectangle';

const Band = ({ id, data }) => {
    return (
        <g data-band-id={id}>
            {data.map((data) => (
                <Rectangle key={data.id} {...data} />
            ))}
        </g>
    );
};

export default Band;
