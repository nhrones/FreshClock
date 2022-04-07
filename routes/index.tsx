/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h, Head } from "../client_deps.ts";
import Canvas from "../islands/Canvas.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh-Dice.</title>
        {/* Suppress browser request for favicon.ico */}
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="data:image/x-icon;,"
        />
        <link rel="stylesheet" href="./style.css" />
      </Head>
      <div>
        <Canvas width={1024} height={300} />
        <div>
          <label for="gravity" id="gravity-value">Gravity: 50%</label>
          <input
            type="range"
            name="gravity"
            id="gravity"
            value="50"
            min="1"
            max="100"
          />
        </div>
        <div>
          <label for="bounce" id="bounce-value">Bounce: 50%</label>
          <input
            type="range"
            name="bounce"
            id="bounce"
            value="50"
            min="1"
            max="100"
          />
        </div>
        <div>
          <label for="velocity" id="velocity-value">Velocity: 50%</label>
          <input
            type="range"
            name="velocity"
            id="velocity"
            value="50"
            min="1"
            max="100"
          />
        </div>
        <div>
          <label for="contrail" id="contrail-value">Con-Trail: 50%</label>
          <input
            type="range"
            name="contrail"
            id="contrail"
            value="50"
            min="0"
            max="100"
          />
        </div>
      </div>
      <a href='https://github.com/nhrones/FreshClock'>see the code </a>
    </>
  );
}
