/**
 * Created by 仁焜 on 2017/5/19.
 */

var jquery = (function () {
  var $ = function (selector, context) {
    return new $.prototype.init(selector, context);
  };

  $.prototype.init = function (selector, ctx) {
    if(typeof selector === 'string'){
      var context = ctx || document;
      var nodeList = context.querySelectorAll(selector);
      this.length = nodeList.length;
      for (var i = 0; i < this.length; i++) {
        this[i] = nodeList[i];
      }

    }else if(typeof selector === 'object'){
      this[0] = selector;
      this.length = 1;
    }
    return this;
  };

  $.prototype.each = function (callback, args) {
    var length = this.length, i = 0;

    while (i < length) {
      callback.call(this[i], args);
      i += 1;
    }

    return this;
  };

  $.prototype.css = function(arg1, arg2){

    if(typeof arg1 === 'string' && !arg2){

      if(window.getComputedStyle) {
        return window.getComputedStyle(this[0] , null)[arg1];
      } else if(this[0].currentStyle) {
        return this[0].currentStyle[arg1];
      }else{
        return "";
      }
    }

    var sty_obj = arg1;
    if(typeof arg1 !== 'object' && arg2){
      sty_obj = {};
      sty_obj[arg1] = arg2;
    }

    this.each(function(){
      for(var sty_name in sty_obj){
        var sty = getEleStyle(this);
        sty[sty_name] = sty_obj[sty_name];
        this.setAttribute('style', JSON.stringify(sty).replace(/[{}"]/g, '').replace(/[,]/g, ";") );
      }
    });

    return this;
  };

  $.prototype.addClass = function(arg1){
    this.each(function(){
      this.setAttribute('class', (this.getAttribute('class')||'') + ' ' + arg1 );
    });
    return this;
  };

  $.prototype.removeClass = function(arg1){
    this.each(function(){
      this.setAttribute('class', (this.getAttribute('class')||'').replace(arg1, '') );
    });
    return this;
  };

  $.prototype.attr = function(arg1, arg2){

    if(!arg2 && typeof arg1 === 'string'){
      return this[0].getAttribute(arg1) || '';
    }

    var attr_obj = arg2 ? {arg1:arg2} : arg1;

    this.each(function(){
      for(var attr_name in attr_obj){
        this.setAttribute(attr_name, attr_obj[attr_name]);
      }
    });

    return this;
  };

  $.prototype.html = function (arg1) {
    if (typeof arg1 == 'string') {
      this.each(function () {
        this.innerHTML = arg1;
      });
      return this;
    } else {
      return this[0].innerHTML;
    }
  };

  $.prototype.remove = function(){
    this.each(function(){
      this.parentNode.removeChild(this);
    });
  };
  $.prototype.append = function(arg1){
    if(typeof arg1 === 'object'){

      this.each(function(){
        this.appendChild(arg1);
      });

    }else if(typeof arg1 === 'string'){

      this.each(function(){
        this.innerHTML = arg1;
      });
    }
    return this;
  };

  $.prototype.bind = function(event, hander){
    if (this[0].addEventListener) {
      this.each(function(){
        this.addEventListener(event, hander);
      });

    } else if (this[0].attachEvent) {
      this.each(function(){
        this.attachEvent("on" + event, hander);
      });
    }
  };

  $.prototype.init.prototype = $.prototype;

  function getEleStyle (element){
    var style = {};
    var style_attr =  element.getAttribute('style');
    if(style_attr){
      var style_arr = style_attr.split(';');
      for(var item = 0; item < style_arr.length; item ++){
        var item_val = style_arr[item].split(':');
        style[item_val[0]] = item_val[1];
      }
    }
    return style;
  }
  return $;
}());

export var jquery = jquery;

export var $ = jquery;
