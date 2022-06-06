import {useCallback} from "react";
import Snap from "snapsvg-cjs";

function App() {
    const snapRef = useCallback(node => {
        if (node !== null) {
            const paper = Snap(node);

            const style = {
                fill: '#387',
                stroke: '#222',
                strokeWidth: 5,
            }
            // const path = paper
            //     .path("M 300,50 L 500,300,700,250,600,100,500,150z")
            //     .attr(style)
            //     .drag()
            //
            // const circle = paper
            //     .circle(150, 150, 100)
            //     .attr(style)
            //     .drag()

            // const rect = paper
            //     .rect(300, 50, 300, 200)
            //     .attr(style);

            const path = paper
                .path("")
                .attr({
                    stroke: '#222',
                    fill: 'transparent',
                    strokeWidth: 3
                })


            paper.click((e) => {
                console.log(e.target.tagName)
                if (e.target.tagName !== 'circle') {
                    paper
                        .circle(e.offsetX, e.offsetY, 15)
                        .attr(style)
                        .drag()



                    const pathString = path.attr('d')
                    const coords = `${e.offsetX},${e.offsetY}`
                    const d = pathString ? `${pathString} L ${coords}` : `M ${coords}`
                    console.log(d)
                    path.attr({d})
                }

            })
        }
    }, []);

    return (
        <div>
            <svg width="800" height="400" ref={snapRef}></svg>
        </div>
    );
}

export default App;
