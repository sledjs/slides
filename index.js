import setTransform from './setTransform';

export default class Slides {
  constructor($core) {
    this.$slides = $core.domModules.slides;
    this.slide = 0;
    this.changeAcces = true;
    this.afterChange = can => can;

    this.broadcast = [];
  }

  sort(next) {
    [].forEach.call(this.$slides.children, (slide, i) => {

      if (i == next) return false;

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

  change(val) {

    if (!this.changeAcces) return false;
    this.changeAcces = false;

    let prev = this.slide;
    let $prev = this.$slides.children[prev];
    let next = this.slide + val;
    let $next = this.$slides.children[next];
    let forward =  val > 0;

    if (next >= 0 && $next) {
      this.slide += val;
      if ($prev) {
        $prev.style.position = 'absolute';
        setTransform($prev.style, `translateX(${ forward ? -100 : 100}%)`);

        if ($prev.previousElementSibling) {
          $prev.previousElementSibling.style.position = 'absolute';
          setTransform($prev.previousElementSibling.style, 'translateX(-100%)');
        }
      }

      $next.style.position = 'relative';
      setTransform($next.style, 'translateX(0)');

      this.broadcast.forEach(_=>_(this.slide));

      setTimeout(_=> this.changeAcces = true, 750);

      this.sort(prev);

      return this.afterChange(true, val);
    }else {
      this.changeAcces = true;
      return this.afterChange(false, val);
    }
  }
}
