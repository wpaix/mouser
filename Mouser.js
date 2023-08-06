class Mouser {

    constructor(input) {
      this.uid = 'uid'+parseInt(Math.random()*99999)
      this.mouseX = 0; this.mouseY = 0
      this.xp = 0; this.yp = 0
      this.delay = 0
      this.move_event_throttle = 10
      this.pristine = true
      this.raf_id = undefined
      this.is_visible = false
      this.presets = {
        default:{},
        current:{},
      }
      this.svg_shapes = input.svg_shapes
  
      this.inject_html()
      this.el = document.querySelector('.mouser.'+this.uid)
  
      this.raf_id = requestAnimationFrame(()=>{ this.render() })
      
      if(input) {
        this.save_preset('default', input)
        this.load_preset('default')
      }

      this.listen()      
      //document.trigger('mousemove')
      
    }
  
  //------------------------------------------------------------------------------

    onMouseDown(e) {
      
      this.el.classList.add('clicked')

      let c = this.el.querySelector('.click-indicator')
      c.classList.remove('anim')
      setTimeout(()=>{ c.classList.add('anim') },0)
      setTimeout(()=>{ c.classList.remove('anim') },400)
      
    }

  //------------------------------------------------------------------------------

    onMouseUp(e) {
      this.el.classList.remove('clicked')
    }

  //------------------------------------------------------------------------------

    onMouseMove(e) {
      let doc = document.documentElement
    
      var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
    
      this.mouseX = e.pageX - 2 // -2 is to correct for native browser placement offset and can be removed if not needed
      this.mouseY = e.pageY - 2 // -2 is to correct for native browser placement offset and can be removed if not needed
      this.mouseY -= top
    
      if( this.pristine ) {
        this.xp = this.mouseX
        this.yp = this.mouseY
        this.pristine = false
    
        this.el.classList.remove('hide')
        this.el.classList.add('initialised')
    
      }
    }

  //------------------------------------------------------------------------------
  
  inject_html() {
    let html = '<div class="mouser '+this.uid+'"><div class="click-indicator"></div><div class="scaler"><div class="rotator">'
        html += (this.svg_shapes) ? this.svg_shapes : ''        
        html += '</div></div></div>'
    document.body.innerHTML += html
  }
  
  //------------------------------------------------------------------------------
  
  render() {
    if( this.pristine ) return this.raf_id = requestAnimationFrame(()=>{ this.render() })
  
    let new_xp, new_yp
  
    if( this.delay ) {
      new_xp = this.xp + ((this.mouseX - this.xp)/this.delay)
      new_yp = this.yp + ((this.mouseY - this.yp)/this.delay)
    } else {
      new_xp = this.xp + ((this.mouseX - this.xp))
      new_yp = this.yp + ((this.mouseY - this.yp))
    }
  
    let update = false
    let min_diff = .1
    if( Math.abs(this.xp - new_xp) > min_diff ) update = true
    if( Math.abs(this.yp - new_yp) > min_diff ) update = true
  
    this.xp = new_xp
    this.yp = new_yp
  
    if(update) this.el.style.transform = 'translate('+this.xp+'px,'+this.yp+'px)'
  
    this.raf_id = requestAnimationFrame(()=>{ this.render() })
  }
  
  //------------------------------------------------------------------------------
  
  listen(){
    this.eventAbortController = new AbortController()
    this.onMouseMoveThrottled = this.throttle(this.onMouseMove.bind(this), this.move_event_throttle)      
    document.addEventListener('mousedown', this.onMouseDown.bind(this), { signal: this.eventAbortController.signal })
    document.addEventListener('mouseup', this.onMouseUp.bind(this), { signal: this.eventAbortController.signal })
    document.addEventListener('mousemove', this.onMouseMoveThrottled.bind(this), { signal: this.eventAbortController.signal })
  }

  //------------------------------------------------------------------------------
  
  stopListening() {
    cancelAnimationFrame(this.raf_id)
    this.eventAbortController.abort()    
  }

  destroy() {
    this.stopListening()
    this.el.classList.add('hide')
  }
  
  //------------------------------------------------------------------------------
  
  save_preset( name, preset ) { this.presets[name] = ( preset || JSON.parse(JSON.stringify(this.presets.current)) ) }
  load_preset(name) { this.set(this.presets[name]) }
  
  //------------------------------------------------------------------------------
  
  //this.set({ shape:'arrow-e', color:'white', stroke:'black', invert:false, rotation:0, scale:1, clicker_bgcolor:'', clicker_strokecolor:'', delay:10, show_native:false, }) })
  
  set_shape(shape) {
    if( !shape ) return
    this.el.querySelector('.shape').not('.'+shape).classList.remove('visible')
    this.el.querySelector('.'+shape).classList.add('visible')
    this.presets.current.shape = shape
  }
  
  set_attr(key,val) {
    this.el.attr(key,val)
    this.presets.current['attr-'+key] = val
  }
  
  set_color(color) {
    this.removeClassesStartingWith( this.el, 'color-' ); this.el.classList.add('color-'+color)
    this.el.querySelector('svg, svg path').forEach((x)=>{ x.style.fill = color })
    //document.querySelector('svg, svg path',this.el)
    this.presets.current.color = color
  }
  
  set_invert(boolean) {
    this.el.classList.toggle('color-invert',boolean)
    this.presets.current.invert = boolean
  }
  
  set_stroke(stroke) {
    if ( !stroke || stroke == '' || stroke == 'none' || stroke == 'transparent' ) stroke = false
    
    //document.documentElement.style.setProperty('--mouser-stroke-color', stroke)
    this.el.querySelector('svg, svg path').forEach((x)=>{ x.style.stroke = stroke })
  
    this.el.classList.toggle('has-stroke',( stroke !== false && stroke !== 'none' && stroke !== 'transparent' ))
    this.presets.current.stroke = stroke
  }
  
  set_rotation(rotation) {
    this.el.querySelector('.rotator').style.transform = 'rotate('+rotation+'deg)'
    this.presets.current.rotation = rotation
  }
  
  set_scale(scale) {
    this.el.querySelector('.scaler').style.transform = 'scale('+scale+')'
    this.presets.current.scale = scale
  }
  
  set_mode(mode) {
    this.removeClassesStartingWith( this.el, 'mode-' )
    this.el.classList.add('mode-'+mode)
    this.presets.current.mode = mode
  }
  
  set_show_native(show_native) {
    document.body.classList.toggle('hide-native-cursor',!show_native)
    this.presets.current.show_native = show_native
  }
  
  set_delay(delay) {
    this.delay = delay
    this.presets.current.delay = delay
  }
  
  
  set_visible ( visible ) {
    this.is_visible = visible
    this.el.classList.toggle('hide', !this.is_visible)
    this.presets.current.visible = visible
  }
  
  set_native_cursor (native_cursor) {
    document.body.classList.toggle('hide-native-cursor',!native_cursor)
    this.presets.current.native_cursor = native_cursor
  }

  throttle(n,l,t){var a,u,e,r=null,i=0;t||(t={});var o=function(){i=!1===t.leading?0:Date.now(),r=null,e=n.apply(a,u),r||(a=u=null)};return function(){var c=Date.now();i||!1!==t.leading||(i=c);var p=l-(c-i);return a=this,u=arguments,p<=0||p>l?(r&&(clearTimeout(r),r=null),i=c,e=n.apply(a,u),r||(a=u=null)):r||!1===t.trailing||(r=setTimeout(o,p)),e}}

  removeClassesStartingWith(el,prefix){ var classes = el.className.split(" ").filter(function(c) { return c.lastIndexOf(prefix, 0) !== 0 }); el.className = classes.join(" ").trim() }
  
  set (input) {
  
    if( !this.el ) return
    if( !input ) input = {}
  
    if( input.shape !== undefined ) this.set_shape(input.shape)
    if( input.color !== undefined ) this.set_color(input.color)
    if( input.stroke !== undefined ) this.set_stroke(input.stroke)
    if( input.invert !== undefined ) this.set_invert(input.invert)
    if( input.mode !== undefined ) this.set_mode(input.mode)
    if( input.rotation !== undefined ) this.set_rotation(input.rotation)
    if( input.scale !== undefined ) this.set_scale(input.scale)
    if( input.delay !== undefined ) this.set_delay(input.delay)
    if( input.visible !== undefined ) this.set_visible(input.visible)
    if( input.native_cursor !== undefined ) this.set_native_cursor(input.native_cursor)
    if( input.set_attr !== undefined ) this.set_set_attr(input.attr)
  
  }

}
