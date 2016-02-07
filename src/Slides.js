'use strict';

import setTransform from '@sled/set-transform';
import eventEmitter from 'eventemitter3';

class Slides extends eventEmitter {
  init($core) {
    this.slide = 0;
    this.changeAccess = true;

    ['first', 'next', 'prev', 'last', 'changeTo']
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
    this.move(which - this.slide);
  }

  first() {
    this.changeTo(0);
  }

  next() {
    this.move(1);
  }

  prev() {
    this.move(-1);
  }

  last() {
    this.changeTo(this.$$.length - 1);
  }

  move(val) {
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

export default Slides;
