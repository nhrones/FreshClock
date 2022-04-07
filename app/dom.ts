/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { setGravityY, setRestitution, setMaxVelocity } from './dotPool.ts';
import { setTrails } from "./clockFace.ts";

export const init = () => {
    
    // gravity control
    
    const gravitySlider = document.getElementById('gravity') as HTMLInputElement;
    const gravityLable = document.getElementById('gravity-value') as HTMLLabelElement
    gravitySlider.oninput = () => {       
        gravityLable.innerHTML = `    Gravity: ${gravitySlider.value}%`;
        setGravityY(parseInt(gravitySlider.value) * 40);
    };
    
    // bounce control
    
    const bounceSlider = document.getElementById('bounce')as HTMLInputElement;
    const bounceLable = document.getElementById('bounce-value') as HTMLLabelElement
    bounceSlider.oninput = () => {
        bounceLable.innerHTML = `    Bounce:   ${bounceSlider.value}%`;
        setRestitution(parseInt(bounceSlider.value) * 0.01);
    };
    
    // velocity control
    
    const velocitySlider = document.getElementById('velocity')as HTMLInputElement;
    const velocityLable = document.getElementById('velocity-value') as HTMLLabelElement
    velocitySlider.oninput = () => {
        velocityLable.innerHTML = `    Velocity:  ${velocitySlider.value}%`;
        setMaxVelocity(parseInt(velocitySlider.value) * 50);
    };
    
    // condensation trails (con-trail)
    
    const contrailSlider = document.getElementById('contrail')as HTMLInputElement;
    const contrailLable = document.getElementById('contrail-value') as HTMLLabelElement
    contrailSlider.oninput = () => {
        contrailLable.innerHTML = `    Con-Trail:  ${contrailSlider.value}%`;
        const invert = 110 - parseInt(contrailSlider.value)
        setTrails((invert * 0.002).toFixed(2));
    };
};
