import Gui from "./api/gui";
import {useRefWithCallback} from "./hooks/useRefWithCallback";

const onMount = (node) => {
    new Gui(node,[
        {
            icon: "pin",
            action() {
                console.log('Pinning...')
            }
        },
        {
            icon: "search",
            action() {
                console.log('Opening Search...')
            }
        },
        {
            icon: "cloud",
            action() {
                console.log('Connecting to Cloud...')
            }
        },
        {
            icon: "settings",
            action() {
                console.log('Opening Settings...')
            }
        },
        {
            icon: "rewind",
            action() {
                console.log('Rewinding...')
            }
        },
        {
            icon: "preview",
            action() {
                console.log('Preview Activated')
            }
        },
        {
            icon: "delete",
            action() {
                console.log('Deleting...')
            }
        }
    ])
}

const onUnmount = () => {
    new Gui().clear()
}

function App() {
    const boardRef = useRefWithCallback(onMount, onUnmount);

    return (
        <div>
            <svg width="100vw" height="100vh" ref={boardRef}></svg>
        </div>
    );
}

export default App;
