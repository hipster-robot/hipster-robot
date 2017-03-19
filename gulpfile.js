'use strict';

const spawn = require('child_process').spawn,
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  del = require('del'),
  webpack = require('webpack-stream'),
  named = require('vinyl-named');

const paths = {
  js: 'hr/static/js/**/*.{js,jsx}',
  jsOut: 'hr/static/compiled/js',
  sass: 'hr/static/sass/**/*.scss',
  cssOut: 'hr/static/compiled/css',
};

gulp.task('compile-js', () => {
  return gulp.src(paths.js)
    .pipe(named())
    .pipe(webpack({
      devtool: 'source-map',
      module: {
        loaders: [
          {
            test: /\.jsx?/,
            exclude: /(node_modules|components)/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'react']
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(paths.jsOut));
});

gulp.task('build-js', gulp.series('compile-js'));

gulp.task('build-css', () => {
  return gulp.src(paths.sass, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.cssOut));
});

gulp.task('clean-js', () => del([paths.jsOut]));
gulp.task('clean-css', () => del([paths.cssOut]));
gulp.task('clean', gulp.parallel('clean-js', 'clean-css'));

gulp.task('watch', () => {
  gulp.watch(paths.js, gulp.series('clean-js', 'build-js'));
  gulp.watch(paths.sass, gulp.series('clean-css', 'build-css'));
});

gulp.task('serve', () => {
  const child = spawn('python', ['main.py'], { stdio: 'inherit' })

  child.on('close', () => {
    process.exit(0);
  });

  process.on('SIGINT', () => {
    child.kill();
  });

  process.on('SIGTERM', () => {
    child.kill();
  });
});

gulp.task('build', gulp.series('clean', gulp.parallel('build-js', 'build-css')));
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
