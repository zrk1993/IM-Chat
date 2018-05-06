/**
 * Created by 仁焜 on 2017/5/19.
 */

import {$} from './utils';

function Popup(options) {
  if(!options)options={};

  var doc = this.doc = document;
  var bd = this.bd = doc.getElementsByTagName('body')[0];

  this.time = new Date().getTime();

  this.width = options.width || '300px';
  this.height = options.height || 'auto';
  this.left = options.left || '50%';
  this.top = options.top || '50%';

  this.mask_width = options.mask_width || '100%';
  this.mask_height = options.mask_height || '100%';
  this.mask_left = options.mask_left || 0;
  this.mask_top = options.mask_top || 0;
  this.mask_color = options.mask_color || '#000';
  this.mask_opacity = options.mask_opacity || 0.1;

  this.drag = options.drag || false;
  this.id = options.id || 'popup_'+this.time;

  this._popup = doc.createElement('div');
  $(this._popup)
    .attr('id', this.id)
    .css({
      position : 'absolute',
      top: this.top,
      left: this.left,
      width: this.width
    });

  if(options.mask !== false){
    this._mask = doc.createElement('div');
    $(this._mask).css({
      position: 'fixed',
      left: this.mask_left,
      top: this.mask_top,
      width: this.mask_width,
      height: this.mask_height,
      overflow: 'hidden',
      userSelect: 'none',
      'background-color': this.mask_color,
      opacity: this.mask_opacity,
      'filter':'alpha(opacity='+this.mask_opacity+')'//兼容IE8
    });
  }
}

/**
 * 显示浮层
 * @param   {HTMLElement, Event}  指定位置（可选）
 */
Popup.prototype.show = function() {
  if(this._mask)this.bd.appendChild(this._mask);
  this.bd.appendChild(this._popup);
  this._center();
};

/** 销毁 */
Popup.prototype.remove = function() {
  $(this._popup).remove();
  $(this._mask).remove();
};

Popup.prototype.content =  function(arg1) {
  if(arg1){
    $(this._popup).append(arg1);
    return this;
  }else{
    return this._popup.firstChild;
  }
};
// 居中浮层
Popup.prototype._center = function() {
  var w = this._popup.offsetWidth;
  var h = this._popup.offsetHeight;
  $(this._popup).css({
    'margin-top' : -h/2 + 'px',
    'margin-left' : -w/2 + 'px'
  });
};




var Dialog = (function(){

  function open (arg1){
    var options = {};

    for(var opt in arg1){
      options[opt] = arg1[opt];
    }

    var pop = new Popup(options);
    pop.content(options.content);
    pop.show();

    return pop;
  }

  function init (opt){
    var options = {};
    if (opt) for(var o in opt){
      options[o] = opt[o];
    }
    return options;
  }

  var d = {
    /**
     * loading
     * 目标选择器
     * @return {[type]} [description]
     */
    load:function(){
      debugger;
      var options = init(arguments[0]);
      
      options.content = '<img src="/static/img/loading.gif" alt="" style="width:30px">';

      if(options.slt){
        var slt_n = $(options.slt);
        options.left = parseInt(slt_n.css('left')) + parseInt(slt_n.css('width'))/2 - parseInt(options.width)/2 + 'px';
        options.top = parseInt(slt_n.css('top')) + parseInt(slt_n.css('height'))/2 - parseInt(options.width)/2  + 'px';

        options.mask_left = parseInt(slt_n.css('left')) +'px';
        options.mask_top = parseInt(slt_n.css('top')) +'px';
        options.mask_width = parseInt(slt_n.css('width')) +'px';
        options.mask_height = parseInt(slt_n.css('height')) +'px';
      }
      return open(options);
    },
    alert:function(message,cb){

    },
    confirm:function(message, yes, no){

    },
    msg:function(message, time){

    },
    tip:function(message){

    },
    popwindow:function(){
    },
    iframe:function(url){

    },
    open:open
  };
  
  return d;
}());

export default Dialog;
