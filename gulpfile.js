const spawn = require('child_process').spawn;
const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');

const paths = {
  py: 'hr/**/*.py',
  js: 'hr/static/js/**/*.{js,jsx}',
  jsOut: 'hr/static/compiled/js',
  sass: 'hr/static/sass/**/*.scss',
  cssOut: 'hr/static/compiled/css',
};

const isProduction = process.env.NODE_ENV === 'production';

const webpackConfig = {
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  devtool: isProduction ? 'source-map' : 'eval',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', { modules: false }],
              'react',
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // This is the default, not an override
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
  ],
};

if (isProduction) {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
  }));
}

gulp.task('compile-js', () => {
  return gulp.src(paths.js)
    .pipe(named())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(paths.jsOut));
});

gulp.task('build-js', gulp.series('compile-js'));

gulp.task('build-css', () => {
  return gulp.src(paths.sass, { sourcemaps: true })
    .pipe(sass({ outputStyle: isProduction ? 'compressed' : 'nested' }).on('error', sass.logError))
    .pipe(gulp.dest(paths.cssOut));
});

gulp.task('clean-js', () => del([paths.jsOut]));
gulp.task('clean-css', () => del([paths.cssOut]));
gulp.task('clean', gulp.parallel('clean-js', 'clean-css'));

gulp.task('watch', () => {
  gulp.watch(paths.js, gulp.series('clean-js', 'build-js'));
  gulp.watch(paths.sass, gulp.series('clean-css', 'build-css'));
});

let child;
gulp.task('serve-py', () => {
  let promise = Promise.resolve();
  // Wait for existing child to exit
  if (child) {
    let resolve;
    promise = new Promise((r) => {
      resolve = r;
    });

    child.on('close', () => {
      resolve();
    });

    child.on('error', () => {
      resolve();
    });

    child.kill();
  }

  return promise.then(() => {
    child = spawn('python', ['main.py'], { detached: true, stdio: 'inherit' });
  });
});

process.on('SIGINT', () => {
  if (child) child.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (child) child.kill();
  process.exit(0);
});

gulp.task('watch-py', () => {
  gulp.watch(paths.py, gulp.series('serve-py'));
});

gulp.task('serve', gulp.series('serve-py', 'watch-py'));

gulp.task('build', gulp.series('clean', gulp.parallel('build-js', 'build-css')));
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
