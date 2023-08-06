# Mouser.js
- A featherweight js library to enable full control of a dom cursor element instead of the native cursor (or alongside it).
- Built for websites that need wild mouse cursor effects

## Usage
1. Import/paste in the JS class
2. Load in the necessary styling
3. Instantiate:
```
let mouser = new Mouser({
    svg_shapes: `
        <svg class="shape pointer" x="0px" y="0px" viewBox="0 0 100 100"><path d="M33.7268 20.3457L66.4727 51.0755L39.7612 64.8451L33.7268 20.3457Z" /></svg>
        <svg class="shape dot" x="0px" y="0px" viewBox="0 0 100 100"><circle cx="50" cy="50" r="18.6"/></svg>
<svg class="shape ring" x="0px" y="0px" viewBox="0 0 100 100"><path d="M50,11c-21.6,0-39,17.5-39,39s17.5,39,39,39s39-17.5,39-39S71.6,11,50,11z M50,86.8c-20.3,0-36.8-16.5-36.8-36.8 S29.7,13.2,50,13.2S86.8,29.7,86.8,50S70.3,86.8,50,86.8z"/></svg>
        <svg class="shape play" x="0px" y="0px" viewBox="0 0 100 100"><polygon points="29.2,27 29.2,73 78.8,50 "/></svg>
        <svg class="shape pause" x="0px" y="0px" viewBox="0 0 100 100"><rect x="28" y="31.4" width="15.6" height="37.2"/><rect x="56.4" y="31.4" width="15.6" height="37.2"/></svg>
        <svg class="shape arrow" x="0px" y="0px" viewBox="0 0 100 100"><polygon points="77.5,37.5 56.5,58.5 56.5,16.4 43.5,16.4 43.5,58.5 22.5,37.5 13.2,46.8 50,83.6 86.8,46.8 "/></svg>
        <svg class="shape angle" x="0px" y="0px" viewBox="0 0 100 100"><polygon points="86.8,36.3 77.5,27 50,54.4 22.5,27 13.2,36.3 50,73 "/></svg>
        <svg class="shape plus" x="0px" y="0px" viewBox="0 0 100 100"><polygon points="86.7,44.7 55.3,44.7 55.3,13.3 44.7,13.3 44.7,44.7 13.3,44.7 13.3,55.3 44.7,55.3 44.7,86.7 55.3,86.7 55.3,55.3 86.7,55.3 "/></svg>        
    `,
})
```

## Properties
- svg_shapes: here, you put in any svg shapes you want, following the above format, with 'shape {shapename}' class.

## Presets
- All visual control is done using manual methods below, but saving and loading presets makes everything easier, so you can quickly change between you for instnace 'normal' and 'clicked' presets. Preset are for instance: { color:'red', shape:'dot', native_cursor:false, delay:500, scale:1 }

## Methods
- mouser.save_preset('preset_name', {...})
- mouser.load_preset('preset_name')
- mouser.set_shape('shape_name')
- mouser.set_color(color)
- mouser.set_stroke(stroke)
- mouser.set_invert(invert)
- mouser.set_mode(mode)
- mouser.set_rotation(rotation)
- mouser.set_scale(scale)
- mouser.set_delay(delay)
- mouser.set_visible(visible)
- mouser.set_native_cursor(visible)
- mouser.set_visible(visible)
