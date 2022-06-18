import { logRoles } from "@testing-library/react";
import { useCallback } from "react";
import Snap from "snapsvg-cjs";

function App() {
    const snapRef = useCallback(node => {
        if (node !== null) {
            const paper = Snap(node);

            const style = ({
                fill: '#387',
                stroke: '#222',
                strokeWidth: 5,
            });

            const path = paper
                .path("")
                .attr({
                    stroke: '#222',
                    fill: 'transparent',
                    strokeWidth: 3
                })

            let coordsArray = [];

            const updatePath = function (x, y, index) {
                const coord = `${x},${y}`;

                if (index !== undefined) {
                    coordsArray[index] = coord;
                } else {
                    coordsArray.push(coord)
                }


                const [firstCoord, ...restCoords] = coordsArray;
                let d = `M ${firstCoord}`;

                for (const coord of restCoords) {
                    d = `${d} L ${coord}`
                }

                path.attr({ d });
            }

            const onSircleDrag = function (dx, dy, x, y) {
                this.attr({ cx: x, cy: y });
                const index = this.data('i');

                updatePath(x, y, index);
            }

            const onPaperClick = function (e) {
                if (e.target.tagName !== 'circle') {
                    paper
                        .circle(e.clientX, e.clientY, 15)
                        .attr(style)
                        .data('i', coordsArray.length)
                        .drag(onSircleDrag)


                    updatePath(e.clientX, e.clientY);
                }
            }

            paper.click(onPaperClick);
        }
    }, []);

    return (
        <div>
            <svg width="100vw" height="100vh" ref={snapRef}></svg>
        </div>
    );
}

export default App;
