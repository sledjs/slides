'use strict';
let Slides = require('./src/Slides');
require('./index.styl');

module.exports = {
  class: Slides,
  name: 'slides',
  peer: '$',
};
