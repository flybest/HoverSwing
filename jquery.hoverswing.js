// style of http://caozhi.news.163.com/
// auther Peter Zhang
// July 12 2017

(function($,window){
  var HoverSwing = function(element, option){
    this.$element = $(element);
    this.option = $.extend({},HoverSwing.DEFAULT,option);
    this.$element.css({display: 'block',overflow: 'hidden',transition: 'transform .2s linear',transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'});
    this.$element.on('mousemove', $.proxy(this.transform, this));
    this.$element.on('mouseleave', $.proxy(this.restore, this));
  }

  HoverSwing.DEFAULT = {
    extent: 0.00025
  }

  HoverSwing.prototype.transform = function(e){
    var halfWidth = this.$element.width()/2, halfHeight = this.$element.height()/2;
    var M14 = (e.offsetX/halfWidth-1)*this.option.extent, M24 = (e.offsetY/halfHeight-1)*this.option.extent;
    this.$element.css('transform','matrix3d(1,0,0,'+ M14 +',0,1,0,'+ M24 +',0,0,1,0,0,0,0,1)');
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
})(jQuery,window);
