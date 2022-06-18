import { useCallback } from "react";
import Snap from "snapsvg-cjs";

function App() {
    const snapRef = useCallback(node => {
        if (node !== null) {
            const paper = Snap(node);

            const style = ({
                fill: '#387',
                stroke: '#fff',
                strokeWidth: 5,
            });

            const path = paper
                .path("")
                .attr({
                    stroke: '#387',
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

            const onSircleStart = function (e) {
                path.stop().animate({ opacity: .2 }, 200, window.mina.easeinout);
                
            }

            const onSircleEnd = function (e) {
                path.stop().animate({ opacity: 1 }, 200, window.mina.easeinout);
            }

            const onSircleMouseOver = function (e) {
                this.stop().animate({ r: 20 }, 1000, window.mina.elastic);
               
            }

            const onSircleMouseOut = function (e) {
                this.stop().animate({ r: 15 }, 300, window.mina.easeinout);
            }

            const onPaperClick = function (e) {
                if (e.target.tagName !== 'circle') {
                    paper
                        .circle(e.clientX, e.clientY, 15)
                        .attr(style)
                        .data('i', coordsArray.length)
                        .mouseover(onSircleMouseOver)
                        .drag(onSircleDrag, onSircleStart, onSircleEnd)
                        .mouseout(onSircleMouseOut)


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
