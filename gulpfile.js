const { src, dest, watch } = require('gulp');

const bro = require('gulp-bro');
const terser = require('gulp-terser');

const DEBUG = process.env.NODE_ENV !== 'production';
const FILES = {
  source: 'src',
  destination: 'dist',
};

function build() {
  return src(`${FILES.source}/liwe.js`)
    .pipe(bro({}))
    .pipe(terser({
      compress: {
        passes: 2,
      },
      mangle: !DEBUG,
      output: {
        beautify: DEBUG,
      }
    }))
    .pipe(dest(`${FILES.destination}`));
}

function develop() {
  watch([`${FILES.source}/**/*.js`], build);
}

module.exports = {
  build, develop,
};
