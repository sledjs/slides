'use strict';

let setTransform = require('@sled/set-transform');
let eventEmitter = require('eventemitter3');

module.exports = class Slides extends eventEmitter {
  constructor($core) {
    super();
    this.slide = 0;
    this.changeAccess = true;

    ['next', 'prev', 'changeTo']
      .forEach(toBind => this[toBind] = this[toBind].bind(this));
  }

  sort(except) {
    [].forEach.call(this.$.children, (slide, i) => {
      if (i == except) return false;

      if (i > this.slide) {
        slide.style.transition = '0s';
        setTransform(slide.style, 'translateX(100%)');
      } else if (i < this.slide) {
        slide.style.transition = '0s';
        setTransform(slide.style, 'translateX(-100%)');
      }

      setTimeout(_=> slide.style.transition = null, 100);
    });
  }

  changeTo(which) {
    this.change(which - this.slide);
  }

  next() {
    this.change(1);
  }

  prev() {
    this.change(-1);
  }

  change(val) {
    if (!this.changeAccess) return false;

    this.changeAccess = false;

    let forward =  val > 0;

    let prev = this.slide;
    let next = prev + val;

    let $prev = this.$.children[prev];
    let $next = this.$.children[next];

    if ($next) {
      this.slide += val;

      $next.style.position = 'relative';
      setTransform($next.style, 'translateX(0)');

      if ($prev) {
        $prev.style.position = 'absolute';
        setTransform($prev.style, `translateX(${ forward ? -100 : 100}%)`);
      }

      this.sort(prev);
      this.emit('change', this.slide);
      this.emit('afterChange', true, val);

      setTimeout(_=>
        this.changeAccess = true, 750);

      return true;
    } else {
      this.changeAccess = true;
      this.emit('afterChange', false, val);
      return false;
    }
  }
};
