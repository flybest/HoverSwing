// style of http://caozhi.news.163.com/
// auther Peter Zhang
// July 12 2017
(function (factory) {
    var jQuery;
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jQuery'], factory);
    } else if (typeof module === 'object' && typeof module.exports === "object") {
        // Node/CommonJS
        jQuery = require('jQuery');
        module.exports = factory(jQuery);
    } else {
        // Browser globals
        if (typeof window.jQuery === 'undefined')
            throw 'jQuery must be loaded first';
        factory(window.jQuery);
    }
}(function($){
  var _DEG2RAD = Math.PI / 180, _MAXANGLE = 30, _MINANGLE = 5;

  var transformCSS = function(rotationX, rotationY, perspective){
    var angle, t1, t2, min, cos, sin, comma, zero, transform, x, y, x;
    var a12 = a21 = a13 = a23 = a31 = a32 = a41 = a42 = 0;
    var a11 = a22 = a33 = 1
    var a43 = (perspective) ? -1 / perspective : 0;

    x = y = z = 0;
    min = 0.000001;
    comma = ",";
    zero = "0";

    angle = rotationY * _DEG2RAD;
    if (angle) {
      cos = Math.cos(angle);
      sin = Math.sin(angle);
      a31 = -sin;
      a41 = a43*-sin;
      a13 = a11*sin;
      a23 = a21*sin;
      a33 = cos;
      a43 *= cos;
      a11 *= cos;
      a21 *= cos;
    }
    angle = rotationX * _DEG2RAD;
    if (angle) {
      cos = Math.cos(angle);
      sin = Math.sin(angle);
      t1 = a12*cos+a13*sin;
      t2 = a22*cos+a23*sin;
      a32 = a33*sin;
      a42 = a43*sin;
      a13 = a12*-sin+a13*cos;
      a23 = a22*-sin+a23*cos;
      a33 = a33*cos;
      a43 = a43*cos;
      a12 = t1;
      a22 = t2;
    }

    transform = "matrix3d(";
    transform += ((a11 < min && a11 > -min) ? zero : a11) + comma + ((a21 < min && a21 > -min) ? zero : a21) + comma + ((a31 < min && a31 > -min) ? zero : a31);
    transform += comma + ((a41 < min && a41 > -min) ? zero : a41) + comma + ((a12 < min && a12 > -min) ? zero : a12) + comma + ((a22 < min && a22 > -min) ? zero : a22);
    if (rotationX || rotationY ) {
      transform += comma + ((a32 < min && a32 > -min) ? zero : a32) + comma + ((a42 < min && a42 > -min) ? zero : a42) + comma + ((a13 < min && a13 > -min) ? zero : a13);
      transform += comma + ((a23 < min && a23 > -min) ? zero : a23) + comma + ((a33 < min && a33 > -min) ? zero : a33) + comma + ((a43 < min && a43 > -min) ? zero : a43) + comma;
    } else {
      transform += ",0,0,0,0,1,0,";
    }
    transform += x + comma + y + comma + z + comma + (perspective ? (1 + (-z / perspective)) : 1) + ")";

    return transform;
  }

  var HoverSwing = function(element, option){
    this.$element = $(element);
    this.option = $.extend({},HoverSwing.DEFAULT, option);
    this.option.swingAngle = Math.min(_MAXANGLE, this.option.swingAngle);
    this.option.swingAngle = Math.max(_MINANGLE, this.option.swingAngle);
    this.$element.css({display: 'block',overflow: 'hidden',transition: 'transform .2s linear',transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'});
    // this.$element.on('mousemove', $.proxy(this.transform, this));
    // this.$element.on('mouseleave', $.proxy(this.restore, this));
    this.$element.on('mouseover', $.proxy(function(){
      console.log('over')
      this.$element.on('mousemove', $.proxy(this.transform, this))
    }, this));
    this.$element.on('mouseout', $.proxy(function(){
      this.$element.off('mousemove');
      console.log('out')
      this.restore();
    }, this));
  }

  HoverSwing.DEFAULT = {
    swingAngle: 15
  }

  HoverSwing.prototype.transform = function(e){
    console.log('move');
    var angle = this.option.swingAngle;
    var ry = -angle + angle * 2 * e.offsetX / this.$element.width(), rx = angle - angle * 2 * e.offsetY / this.$element.height();
    this.$element.css('transform', transformCSS(rx, ry, 1000));
  }

  HoverSwing.prototype.restore = function(e){
    this.$element.css('transform','matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)');
  }

  function Plugin(option){
    return this.each(function(){
      var $this = $(this);
      var data = $this.data('hoverSwing');
      if(!data) $this.data('hoverSwing',(data = new HoverSwing(this, option)));
    })
  }

  var old = $.fn.hoverswing;

  $.fn.hoverswing = Plugin;
  $.fn.hoverswing.Constructor = HoverSwing;

  $.fn.hoverswing.noConflict = function(){
    $.fn.hoverswing = old;
    return this;
  }
}));
