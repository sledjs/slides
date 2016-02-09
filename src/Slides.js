'use strict';

import setTransform from '@sled/set-transform';
import eventEmitter from 'eventemitter3';

/** Slides module */
class Slides extends eventEmitter {
  /**
   * Provide slides api
   * @param {any} core slider module
   */
  init(core) {
    this.slide = 0;
    this.changeAccess = true;

    core.$.addEventListener('dragstart', e => e.preventDefault());
    core.$.addEventListener('drop', e => e.preventDefault());

    ['first', 'next', 'prev', 'last', 'changeTo']
      .forEach(toBind => this[toBind] = this[toBind].bind(this));
  }

  /**
   * Sort slides to correct sides
   * @param {number} slide which won't be sorted
   */
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

  /**
   * Change to specific slide
   * @param {number} to which slide
   */
  changeTo(which) {
    this.move(which - this.slide);
  }

  /**
   * Move to first slide.
   */
  first() {
    this.changeTo(0);
  }

  /**
   * Move to next slide.
   * @return {boolean} Is there a yet another next slide.
   */
  next() {
    return this.move(1) + 1 < this.$$.length;
  }

  /**
   * Move to previous slide.
   * @return {boolean} Is there a yet another previous slide.
   */
  prev() {
    return this.move(-1) - 1 >= 0;
  }

  /**
   * Move to last slide.
   */
  last() {
    this.changeTo(this.$$.length - 1);
  }

  /**
   * Change current slide.
   * @param {number} move by provided value
   * @return {number} actual slide.
   */
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
        this.changeAccess = true, 500);

    } else {
      this.changeAccess = true;
      this.emit('afterChange', false, val);
    }

    return next;
  }
};

export default Slides;
