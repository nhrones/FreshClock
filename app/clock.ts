/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import * as DomEvents from './dom.ts'
import * as Clock from './clockFace.ts'
    
export let ctx: CanvasRenderingContext2D
export let thisCanvas: HTMLCanvasElement
export let width = 0
export let height = 0

/** We initialize our HTMLCanvasElement and its context2D */
export const initClock = (aCanvas: HTMLCanvasElement) => {
    thisCanvas = aCanvas
    ctx = thisCanvas.getContext("2d") as CanvasRenderingContext2D
    width = thisCanvas.clientWidth
    height = thisCanvas.clientHeight

    thisCanvas.width = width
    thisCanvas.height = height
    
    DomEvents.init()
    // build -> render -> and animate a `clock`
    Clock.buildClockFace()
}
