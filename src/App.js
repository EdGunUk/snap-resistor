import {useCallback} from "react";
import Snap from "snapsvg-cjs";

function App() {
    const snapRef = useCallback(node => {
                if (node !== null) {
                    const paper = Snap(node);

                    const getAttr = (index) => ({
                        fill: '#387',
                        stroke: '#222',
                        strokeWidth: 5,
                        'data-index': index
                    });
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

                    let index = 0;
                    paper.click((e) => {
                        if (e.target.tagName !== 'circle') {
                            paper
                                .circle(e.offsetX, e.offsetY, 15)
                                .attr(getAttr(index++))
                                .drag()
                                .mousemove((e) => {
                                    console.log(e.target.cx.baseVal.value, e.target.cy.baseVal.value);
                                    console.log(`${e.offsetX},${e.offsetY}`);
                                    const index = e.target.dataset.index;
                                    const pathString = path.attr('d');
                                    const pathPoint = pathString.match(/(?<=(?:L|M)\s)\d+,\d+/g);
                                    pathPoint[index] = `${e.target.cx.baseVal.value},${e.target.cy.baseVal.value}`;
                                    const d = `M ${pathPoint.join(' L ')}`;
                                    path.attr({d})
                                })


                            const pathString = path.attr('d')
                            const coords = `${e.offsetX},${e.offsetY}`
                            const d = pathString ? `${pathString} L ${coords}` : `M ${coords}`;
                            path.attr({d})

                        }

                    })
                }
            }
            ,
            []
        )
    ;

    return (
        <div>
            <svg width="800" height="400" ref={snapRef}></svg>
        </div>
    );
}

export default App;
