/** @jsx h */
import { h, useEffect, useRef, IS_BROWSER } from "../client_deps.ts";
import { initClock } from '../app/clock.ts'
export type CanvasProps = { height: number, width: number };

/** Our Preact Canvas component */
export default function Canvas(props: CanvasProps) {
    
    const canvasElement = useRef(null);
    
    useEffect(() => {
        if (canvasElement.current) { // required to silence type checker
            initClock(canvasElement.current as HTMLCanvasElement)
        }
    },[]); 
     
    return <canvas 
        ref={canvasElement} 
        height={props.height} 
        width={props.width} 
        disabled={!IS_BROWSER}
    />;
}

