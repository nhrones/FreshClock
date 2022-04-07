/** @jsx h */
import { h, useEffect, useRef, IS_BROWSER } from "../client_deps.ts";
import { initClock } from '../app/clock.ts'

export default function Canvas(props: CanvasProps) {

    /** Create a variable pointing to useRef(null)
        We'll be able to access a reference to the canvas element 
        in the DOM. We can then access its 2D drawing context.
        Once the canvas element has been rendered to DOM, 
        we can then refer to it as canvasElement.current in code.
    */
    const canvasElement = useRef(null);
    // So, a call to useRef will return a mutable object. 
    // This means that we can alter the value of its .current 
    // property without unexpected behavior or side effects. 
    // As a matter of fact, we can alter that value and it will 
    // not cause a rerender of our component.
    // Also, useRef will give you the same ref object on every render.

    // This step is the trickiest part of using the HTML canvas 
    // with Preact. The solution is the `useEffect` hook.
    // Here, `canvasElement.current` refers to the <canvas> dom element.
    // It's `null` until Preact actually renders the canvas element.
    useEffect(() => {
        if (canvasElement.current) { // required to silence type checker
            initClock(canvasElement.current as HTMLCanvasElement)
        }
    },[]); 
    // to make this useRef behave like a `componentdidmount` method
    // we've passed an empty array. This will only execute once: 
    // (after Canvas component has been added to the DOM as an HTMLCanvasElement) 

    // we'll return a simple HtmlCanvas tag with size atributes 
    return <canvas ref={canvasElement}
        height={props.height}
        width={props.width}
        disabled={!IS_BROWSER}
    />;
}

export type CanvasProps = {
    height: number;
    width: number;
};