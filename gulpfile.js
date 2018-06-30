// const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
// const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
});

// Styles
gulp.task('styles', () =>
  gulp
    .src('./css/main.css')
    .pipe(
      plumber(function(err) {
        console.log('Error in style task');
        console.log(err);
        this.emit('end');
      }),
    )
    // .pipe(sourcemaps.init())
    // .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie11' }))
    .pipe(cleanCSS({ level: '2' }))
    .pipe(rename({ suffix: '.min' }))
    // .pipe(
    //   sourcemaps.write('./', {
    //     sourceMappingURL(file) {
    //       return `${file.relative}.map`;
    //     },
    //   }),
    // )
    .pipe(gulp.dest('./public/css/')),
);

//Configuring  JS
gulp.task('js', () => {
  browserify('./js/currency.js')
    .transform(babelify, { presets: ['env'] })
    .bundle()
    .pipe(source('currency.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init())
    .pipe(
      plumber(function(err) {
        console.log('JavaScript Task Error');
        console.log(err);
        this.emit('end');
      }),
    )
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    // .pipe(
    //   sourcemaps.write('./', {
    //     sourceMappingURL(file) {
    //       return `${file.relative}.map`;
    //     },
    //   }),
    // )
    .pipe(gulp.dest('./public/js/'));
});

//Start the building process for tasks
gulp.task('build', ['styles', 'js'], () => {
  console.log('started to build');
});

// Watch task runner
gulp.task('watch', ['browser-sync', 'build'], () => {
  console.log('watching');
  gulp.watch('index.html').on('change', browserSync.reload);
  gulp.watch('./css/main.css', ['styles']).on('change', browserSync.reload);
  gulp.watch('./js/currency.js', ['js']).on('change', browserSync.reload);
});
