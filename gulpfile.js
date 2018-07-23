/*jshint esversion: 6 */
const gulp = require('gulp');
const del = require('del');
const exec = require('gulp-exec');
const merge = require('gulp-merge-json');
const gulpSequence = require('gulp-sequence');

gulp.task('core:clean', () => {
  return del([
    'dist/core/assets/**/*',
    'dist/core/style/**/*',
    'dist/core/locale/**/*'
  ]);
});

gulp.task('common:clean', () => {
  return del(['dist/common/assets/**/*', 'dist/common/style/**/*']);
});

gulp.task('auth:clean', () => {
  return del(['dist/auth/assets/**/*', 'dist/auth/style/**/*']);
});

gulp.task('geo:clean', () => {
  return del(['dist/geo/assets/**/*', 'dist/geo/style/**/*']);
});

// ==========================================================

gulp.task('core:copyAssets', () => {
  gulp
    .src('./projects/core/src/assets/**/*', {
      base: './projects/core/src/assets/'
    })
    .pipe(gulp.dest('./dist/core/assets'));
});

gulp.task('common:copyAssets', () => {
  gulp
    .src('./projects/common/src/assets', {
      base: './projects/common/src/assets/'
    })
    .pipe(gulp.dest('./dist/common/assets'));
});

gulp.task('auth:copyAssets', () => {
  gulp
    .src('./projects/auth/src/assets', {
      base: './projects/auth/src/assets/'
    })
    .pipe(gulp.dest('./dist/auth/assets'));
});

gulp.task('geo:copyAssets', () => {
  gulp
    .src('./projects/geo/src/assets/**/*', {
      base: './projects/geo/src/assets/'
    })
    .pipe(gulp.dest('./dist/geo/assets'));
});

// ==========================================================

gulp.task('core:copyStyles', () => {
  gulp
    .src('./projects/core/src/style/**/*')
    .pipe(gulp.dest('./dist/core/style'));
});

gulp.task('common:copyStyles', () => {
  gulp
    .src('./projects/common/src/style/**/*')
    .pipe(gulp.dest('./dist/common/style'));
});

gulp.task('auth:copyStyles', () => {
  gulp
    .src('./projects/auth/src/style/**/*')
    .pipe(gulp.dest('./dist/auth/style'));
});

gulp.task('geo:copyStyles', () => {
  gulp.src('./projects/geo/src/style/**/*').pipe(gulp.dest('./dist/geo/style'));
});

// ==========================================================

gulp.task('core:bundleStyles', () => {
  return gulp
    .src('.')
    .pipe(
      exec(
        './node_modules/scss-bundle/dist/bundle-cli.js -e ./projects/core/src/style/core.theming.scss -d ./dist/core/style/core.theming.scss'
      )
    )
    .pipe(
      exec(
        './node_modules/scss-bundle/dist/bundle-cli.js -e ./projects/core/src/style/theming.scss -d ./dist/core/style/theming.scss'
      )
    )
    .pipe(
      exec(
        './node_modules/scss-bundle/dist/bundle-cli.js -e ./projects/core/src/style/all.theming.scss -d ./dist/core/style/all.theming.scss'
      )
    )
    .pipe(exec.reporter());
});

gulp.task('common:bundleStyles', () => {
  return gulp
    .src('.')
    .pipe(
      exec(
        './node_modules/scss-bundle/dist/bundle-cli.js -e ./projects/common/src/style/common.theming.scss -d ./dist/common/style/common.theming.scss'
      )
    )
    .pipe(exec.reporter());
});

gulp.task('geo:bundleStyles', () => {
  return gulp
    .src('.')
    .pipe(
      exec(
        './node_modules/scss-bundle/dist/bundle-cli.js -e ./projects/geo/src/style/geo.theming.scss -d ./dist/geo/style/geo.theming.scss'
      )
    )
    .pipe(exec.reporter());
});

// ==========================================================

gulp.task('core:copyLocale', () => {
  gulp
    .src('./projects/core/src/locale/*')
    .pipe(gulp.dest('./dist/core/locale'));
});

gulp.task('common:copyLocale', () => {
  gulp
    .src('./projects/common/src/locale/*')
    .pipe(gulp.dest('./dist/core/locale'));
});

gulp.task('auth:copyLocale', () => {
  gulp
    .src('./projects/auth/src/locale/*')
    .pipe(gulp.dest('./dist/core/locale'));
});

gulp.task('geo:copyLocale', () => {
  gulp.src('./projects/geo/src/locale/*').pipe(gulp.dest('./dist/core/locale'));
});

gulp.task('core:bundleLocale.fr', () => {
  gulp
    .src('./dist/core/locale/fr.*.json')
    .pipe(
      merge({
        fileName: 'fr.json'
      })
    )
    .pipe(gulp.dest('./dist/core/locale'));
});

gulp.task('core:bundleLocale.en', () => {
  gulp
    .src('./dist/core/locale/en.*.json')
    .pipe(
      merge({
        fileName: 'en.json'
      })
    )
    .pipe(gulp.dest('./dist/core/locale'));
});

gulp.task('core:bundleLocale', [
  'core:bundleLocale.fr',
  'core:bundleLocale.en'
]);

// ==========================================================

gulp.task(
  'core',
  gulpSequence(
    'core:clean',
    ['core:copyAssets', 'core:copyStyles', 'core:copyLocale'],
    ['core:bundleStyles'],
    'core:bundleLocale'
  )
);

gulp.task(
  'common',
  gulpSequence(
    'common:clean',
    ['common:copyAssets', 'common:copyStyles', 'common:copyLocale'],
    ['common:bundleStyles'],
    'core:bundleLocale'
  )
);

gulp.task(
  'auth',
  gulpSequence(
    'auth:clean',
    ['auth:copyAssets', 'auth:copyStyles', 'auth:copyLocale'],
    'core:bundleLocale'
  )
);

gulp.task(
  'geo',
  gulpSequence(
    'geo:clean',
    ['geo:copyAssets', 'geo:copyStyles', 'geo:copyLocale'],
    ['geo:bundleStyles'],
    'core:bundleLocale'
  )
);

gulp.task('default', ['core', 'common', 'auth', 'geo']);