/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { ctx, width, height } from './clock.ts'
import { PIXELS, createNumber, ClockNumber, MatrixWidth, MatrixHeight } from './clockNumber.ts'
import { renderDot, initializeDotPool, tickDots } from './dotPool.ts'

// a few required clock-face constants
// these are used to define the shape of
// our 4 x 7 dot matrix, for the 7-segment 'LED' numbers
export const NUMBER_SPACING = 16
export const DOT_WIDTH = 16
export const DOT_HEIGHT = 16

let hSize = 0
let vSize = 0
let i



/** The current horizontal location to render to */
let currentX = 0

/** the current vertical location to render to */
let currentY = 0

/*
 This class creates a graphic display of a digital(numeric)
 clock face.
 The face shows pairs of two, 7-segment 'LED' numeric displays for;
 hour, minute, and seconds values, each separated by a 'colon' character.
 The segments are drawn as 4 x 7 matrix of dots(circles) that immitate
 common 7-segment 'LED' numeric displays.
 
 This clock face is animated to 'explode' numbers as they change.
 Any segment(dot) that is active when a number value changes, and is not
 required to display the new value, is animated with velocity away
 from its original spot in the number.
 
 These 'free' dots become animated, will collide with each other,
 bounce off walls, and eventually fall out of view if they roll on
 the floor off either end.
 */

/** trails represents the com-trail value */
let _trails = '0.15'
export const setTrails = (value: string) => _trails = value

/** A two element array of instances of the ClockNumber class.
 * Represents the graphic display of a 2 digit 'hours' number (using a leading zero) */
let hours: ClockNumber[]

/** A two element array of instances of the ClockNumber class.
 * Represents the graphic display of a 2 digit 'minutes' number (using a leading zero) */
let minutes: ClockNumber[]

/**  A two element array of instances of the ClockNumber class.
     Represents the graphic display of a 2 digit 'seconds' number (using a leading zero) */
let seconds: ClockNumber[]

/** colon locations */
let colon1X = 0
let colon2X = 0


/** Constructs and initializes a new ClockFace */
export const buildClockFace = () => {
    console.log('building clockface')
    // init our ClockNumber array objects to empty(default) values
    hours = [createNumber(0, 0), createNumber(0, 0)]
    minutes = [createNumber(0, 0), createNumber(0, 0)]
    seconds = [createNumber(0, 0), createNumber(0, 0)]

    // initialize the dot-pool that will contain
    // and animate dots that are 'freed' from this
    // clock-face.
    initializeDotPool()
    
    console.log('fill the background image all solid black')
    // fill the background image all solid black
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)
    ctx.lineCap = "round";

    // draw number placeholders and colons onto the canvas
    createNumbers()

    // start the animation loop (tick method call)
    self.requestAnimationFrame(tick)
    console.log('tick')
}

/** Main animation loop  ...
 * requestAnimationFrame returns a timestamp here.
 *
 * This method produces a 'particle' effect using
 * a transparent fill on the canvas.
 * We would expect ~ 60 frames per second here. */
export const tick = (timestamp: number) => {

    // First, we cover the existing canvas image with a
    // partially-transparent black, effectively dimming all
    // prior dot-lines(SEE: DotPool.renderFreeDot).
    //
    // This will create a 'com-trails' effect for our moving dots.
    // After a few ticks, all prior dot.lines eventually fade to black.
    //
    // Imagine that you're coating a white surface with a spray-paint 
    // that is 95% clear with 5% black mixed in. 
    // After about 20 coats, the surface would be black. 
    // Here, we're spraying 60 times per second.

    // Below, the fourth value in 'rgba' is an opacity value   
    // from 0 to 1, where 0 is transparent and 1 is opaque.
    // This vaue is set by the contrailSlider DOM element (SEE: dom.ts)
    ctx.fillStyle = 'rgba(0, 0, 0, ' + _trails + ')'

    // spray the whole canvas with the above transparent black
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "black"

    // Render Colon #1 between the hours and minutes
    renderDot(colon1X, currentY + (2.0 * DOT_HEIGHT))
    renderDot(colon1X, currentY + (4.0 * DOT_HEIGHT))

    // Render Colon #2 between the minutes and seconds
    renderDot(colon2X, currentY + (2.0 * DOT_HEIGHT))
    renderDot(colon2X, currentY + (4.0 * DOT_HEIGHT))

    // display the graphical time value dots
    updateTime(new Date())

    // update all of the animated 'free' dots
    tickDots(timestamp)

    // request that we do this again as soon as practical (~60fps)
    self.requestAnimationFrame(tick)
}


/** Display the current time. Called on each 'tick' */
 const updateTime = (now: Date) => {

    // set the current hours display
    setDigits(pad2(now.getHours()), hours)

    // set the current minutes display
    setDigits(pad2(now.getMinutes()), minutes)

    // set the current seconds display
    setDigits(pad2(now.getSeconds()), seconds)
}


 /** Sets the static and active pixels for each of the two numeric displays    
    SEE: ClockNumber.setPixels() */
 const setDigits = (digits: string, numbers: ClockNumber[]) => {
    numbers[0].drawPixels(PIXELS[parseInt(digits[0])])
    numbers[1].drawPixels(PIXELS[parseInt(digits[1])])
}

/** * This is where we create our empty numeric displays     
      and two separating colons.    
      Called only once by the constructor for initialization. */
 const createNumbers = () => {

    // first, calculate the width of a numeric display
    //  (16 x 4 + 16) * 6 + (16 + 16) x 2
    hSize = ((DOT_WIDTH * MatrixWidth) +
        NUMBER_SPACING) * 6 +
        ((DOT_WIDTH + NUMBER_SPACING) * 2) - NUMBER_SPACING

    // Now, calculate the height of a numeric display
    vSize = DOT_HEIGHT * MatrixHeight

    // we calculate our initial 'top' value (y)
    currentY = (height - vSize) * 0.33

    // Next, initialize the horizontal position (x)
    // We will manipulate this several times as we build up the display
    currentX = (width - hSize) * 0.45

    // go build the 'hours' display 
    buildNumber(hours)

    // Set the position of the colon between the hours and minutes display
    colon1X = currentX + 8

    // calculate the horizontal position for the minutes display
    currentX += DOT_WIDTH + (2 * NUMBER_SPACING)

    // go build the 'minutes' display
    buildNumber(minutes)

    // Set the position of the colon between the minutes and seconds display
    colon2X = currentX + 8

    // calculate the horizontal position for the seconds display
    currentX += DOT_WIDTH + (2 * NUMBER_SPACING)

    // finally, build the 'seconds' display
    buildNumber(seconds)
}

/** Initialize the positions of the ClockNumber objects */
const buildNumber = (digits: ClockNumber[]) => {
    for (i = 0; i < 2; ++i) {
        digits[i] = createNumber(currentX, currentY)
        currentX += (DOT_WIDTH * MatrixWidth) + NUMBER_SPACING
    }
}


/** Convert a number to a string and add a
    leading zero to any number less than 10. */
const pad2 = (num: number) => {
    return (num < 10) ? "0" + num.toString() : num.toString()
}