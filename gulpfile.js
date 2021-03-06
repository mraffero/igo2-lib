/*jshint esversion: 6 */
const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const exec = require('gulp-exec');
const merge = require('gulp-merge-json');
const jeditor = require('gulp-json-editor');
const replace = require('gulp-replace');

const package = require('./package.json');
const version = package.version;

gulp.task('core:clean', done => {
  return del([
    'dist/core/assets/**/*',
    'dist/core/style/**/*',
    'dist/core/locale/**/*'
  ]);
});

gulp.task('common:clean', done => {
  return del(['dist/common/assets/**/*', 'dist/common/style/**/*']);
});

gulp.task('auth:clean', done => {
  return del(['dist/auth/assets/**/*', 'dist/auth/style/**/*']);
});

gulp.task('geo:clean', done => {
  return del(['dist/geo/assets/**/*', 'dist/geo/style/**/*']);
});

// ==========================================================

gulp.task('core:copyIcons', done => {
  gulp
    .src('./node_modules/@mdi/angular-material/mdi.svg')
    .pipe(gulp.dest('./dist/core/assets/icons'));

  done();
});

gulp.task('core:copyAssets', done => {
  gulp
    .src('./packages/core/src/assets/**/*', {
      base: './packages/core/src/assets/'
    })
    .pipe(gulp.dest('./dist/core/assets'));

  done();
});

gulp.task('common:copyAssets', done => {
  gulp
    .src('./packages/common/src/assets', {
      base: './packages/common/src/assets/',
      allowEmpty: true
    })
    .pipe(gulp.dest('./dist/common/assets'));

  done();
});

gulp.task('auth:copyAssets', done => {
  gulp
    .src('./packages/auth/src/assets', {
      base: './packages/auth/src/assets/',
      allowEmpty: true
    })
    .pipe(gulp.dest('./dist/auth/assets'));

  done();
});

gulp.task('geo:copyAssets', done => {
  gulp
    .src('./packages/geo/src/assets/**/*', {
      base: './packages/geo/src/assets/'
    })
    .pipe(gulp.dest('./dist/geo/assets'));

  done();
});

gulp.task('geo:copyNGCC', done => {
  gulp
    .src('./packages/geo/ngcc.config.js', {
      base: './packages/geo/'
    })
    .pipe(gulp.dest('./dist/geo'));

  done();
});

gulp.task('context:copyNGCC', done => {
  gulp
    .src('./packages/context/ngcc.config.js', {
      base: './packages/context/'
    })
    .pipe(gulp.dest('./dist/context'));

  done();
});

gulp.task('integration:copyNGCC', done => {
  gulp
    .src('./packages/integration/ngcc.config.js', {
      base: './packages/integration/'
    })
    .pipe(gulp.dest('./dist/integration'));

  done();
});

// ==========================================================

gulp.task('core:copyStyles', done => {
  gulp
    .src('./packages/core/src/style/**/*')
    .pipe(gulp.dest('./dist/core/style'));

  done();
});

gulp.task('common:copyStyles', done => {
  gulp
    .src('./packages/common/src/style/**/*')
    .pipe(gulp.dest('./dist/common/style'));

  done();
});

gulp.task('auth:copyStyles', done => {
  gulp
    .src('./packages/auth/src/style/**/*')
    .pipe(gulp.dest('./dist/auth/style'));

  done();
});

gulp.task('geo:copyStyles', done => {
  gulp.src('./packages/geo/src/style/**/*').pipe(gulp.dest('./dist/geo/style'));
  done();
});

// ==========================================================

gulp.task('core:bundleStyles', done => {
  return gulp
    .src('.')
    .pipe(
      exec(
        'node ./node_modules/scss-bundle/dist/cli/main.js -p ./ -e ./packages/core/src/style/core.theming.scss -o ./dist/core/style/core.theming.scss'
      )
    )
    .pipe(
      exec(
        'node ./node_modules/scss-bundle/dist/cli/main.js -p ./ -e ./packages/core/src/style/theming.scss -o ./dist/core/style/theming.scss'
      )
    )
    .pipe(
      exec(
        'node ./node_modules/scss-bundle/dist/cli/main.js -p ./ -e ./packages/core/src/style/all.theming.scss -o ./dist/core/style/all.theming.scss'
      )
    )
    .pipe(exec.reporter());
});

gulp.task('common:bundleStyles', done => {
  return gulp
    .src('.')
    .pipe(
      exec(
        'node ./node_modules/scss-bundle/dist/cli/main.js -p ./ -e ./packages/common/src/style/common.theming.scss -o ./dist/common/style/common.theming.scss'
      )
    )
    .pipe(exec.reporter());
});

gulp.task('geo:bundleStyles', done => {
  return gulp
    .src('.')
    .pipe(
      exec(
        'node ./node_modules/scss-bundle/dist/cli/main.js -p ./ -e ./packages/geo/src/style/geo.theming.scss -o ./dist/geo/style/geo.theming.scss'
      )
    )
    .pipe(exec.reporter());
});

// ==========================================================

gulp.task('core:copyLocale', done => {
  gulp
    .src('./packages/core/src/locale/*')
    .pipe(gulp.dest('./dist/core/locale'));
  done();
});

gulp.task('common:copyLocale', done => {
  gulp
    .src('./packages/common/src/locale/*')
    .pipe(gulp.dest('./dist/core/locale'));
  done();
});

gulp.task('auth:copyLocale', done => {
  gulp
    .src('./packages/auth/src/locale/*')
    .pipe(gulp.dest('./dist/core/locale'));
  done();
});

gulp.task('geo:copyLocale', done => {
  gulp.src('./packages/geo/src/locale/*').pipe(gulp.dest('./dist/core/locale'));
  done();
});

gulp.task('context:copyLocale', done => {
  gulp
    .src('./packages/context/src/locale/*')
    .pipe(gulp.dest('./dist/core/locale'));

  done();
});

gulp.task('integration:copyLocale', done => {
  gulp
    .src('./packages/integration/src/locale/*')
    .pipe(gulp.dest('./dist/core/locale'));

  done();
});

gulp.task('core:bundleLocale.fr', done => {
  gulp
    .src('./dist/core/locale/fr.*.json')
    .pipe(
      merge({
        fileName: 'fr.json'
      })
    )
    .pipe(gulp.dest('./dist/core/locale'));

  done();
});

gulp.task('core:bundleLocale.en', done => {
  gulp
    .src('./dist/core/locale/en.*.json')
    .pipe(
      merge({
        fileName: 'en.json'
      })
    )
    .pipe(gulp.dest('./dist/core/locale'));

  done();
});

gulp.task('core:copyBundleLocale', done => {
  gulp
    .src('./dist/core/locale/*')
    .pipe(gulp.dest('./dist/core/__ivy_ngcc__/locale'));

  done();
});

gulp.task('sleep', done => {
  setTimeout(() => done(), 1000);
});

gulp.task(
  'core:bundleLocale',
  gulp.series(
    gulp.parallel(['core:bundleLocale.fr', 'core:bundleLocale.en']),
    'sleep',
    'core:copyBundleLocale'
  )
);

// ==========================================================

gulp.task('utils:bumpVersion', done => {
  gulp
    .src('./packages/utils/package.json')
    .pipe(
      jeditor({
        version: version
      })
    )
    .pipe(gulp.dest('./packages/utils/.'));

  done();
});

gulp.task('core:bumpVersion', done => {
  gulp
    .src('./packages/core/package.json')
    .pipe(
      jeditor({
        version: version,
        peerDependencies: {
          '@igo2/utils': `^${version}`
        }
      })
    )
    .pipe(gulp.dest('./packages/core/.'));

  gulp
    .src(['./packages/core/src/lib/config/version.ts'])
    .pipe(replace(/lib: '[A-Za-z0-9\.\-]+'/g, `lib: '${version}'`))
    .pipe(replace(/releaseDate: [0-9]+/g, `releaseDate: ${Date.now()}`))   
    .pipe(gulp.dest('./packages/core/src/lib/config/.'));

  done();
});

gulp.task('common:bumpVersion', done => {
  gulp
    .src('./packages/common/package.json')
    .pipe(
      jeditor({
        version: version,
        peerDependencies: {
          '@igo2/core': `^${version}`,
          '@igo2/utils': `^${version}`
        }
      })
    )
    .pipe(gulp.dest('./packages/common/.'));

  done();
});

gulp.task('auth:bumpVersion', done => {
  gulp
    .src('./packages/auth/package.json')
    .pipe(
      jeditor({
        version: version,
        peerDependencies: {
          '@igo2/core': `^${version}`,
          '@igo2/utils': `^${version}`
        }
      })
    )
    .pipe(gulp.dest('./packages/auth/.'));

  done();
});

gulp.task('geo:bumpVersion', done => {
  gulp
    .src('./packages/geo/package.json')
    .pipe(
      jeditor({
        version: version,
        peerDependencies: {
          '@igo2/common': `^${version}`,
          '@igo2/core': `^${version}`,
          '@igo2/utils': `^${version}`
        }
      })
    )
    .pipe(gulp.dest('./packages/geo/.'));

  done();
});

gulp.task('context:bumpVersion', done => {
  gulp
    .src('./packages/context/package.json')
    .pipe(
      jeditor({
        version: version,
        peerDependencies: {
          '@igo2/auth': `^${version}`,
          '@igo2/common': `^${version}`,
          '@igo2/core': `^${version}`,
          '@igo2/geo': `^${version}`,
          '@igo2/utils': `^${version}`
        }
      })
    )
    .pipe(gulp.dest('./packages/context/.'));

  done();
});

gulp.task('integration:bumpVersion', done => {
  gulp
    .src('./packages/integration/package.json')
    .pipe(
      jeditor({
        version: version,
        peerDependencies: {
          '@igo2/geo': version,
          '@igo2/context': version
        }
      })
    )
    .pipe(gulp.dest('./packages/integration/.'));

  done();
});

gulp.task(
  'bumpVersion',
  gulp.parallel([
    'utils:bumpVersion',
    'core:bumpVersion',
    'common:bumpVersion',
    'auth:bumpVersion',
    'geo:bumpVersion',
    'context:bumpVersion',
    'integration:bumpVersion'
  ])
);

// ==========================================================

// https://github.com/stylus/stylus/pull/2538
gulp.task('libs:fixStylus', done => {
  gulp
    .src(['./node_modules/stylus/lib/nodes/index.js'])
    .pipe(
      replace(
        `/**
 * Constructors
 */`,
        `exports.lineno = null;
exports.column = null;
exports.filename = null;`
      )
    )
    .pipe(gulp.dest('./node_modules/stylus/lib/nodes/'));

  done();
});

gulp.task('libs:fixOL', done => {
  gulp
    .src(['./node_modules/ol/package.json'])
    .pipe(
      jeditor({
        sideEffects: true
      })
    )
    .pipe(gulp.dest('./node_modules/ol/'));

  done();
});

gulp.task('fixLibs', gulp.parallel(['libs:fixStylus', 'libs:fixOL']));

// ==========================================================

gulp.task(
  'core',
  gulp.series(
    'core:clean',
    gulp.parallel(['core:copyAssets', 'core:copyStyles', 'core:copyLocale']),
    gulp.parallel(['core:copyIcons', 'core:bundleStyles']),
    'core:bundleLocale'
  )
);

gulp.task(
  'common',
  gulp.series(
    'common:clean',
    gulp.parallel([
      'common:copyAssets',
      'common:copyStyles',
      'common:copyLocale'
    ]),
    gulp.parallel(['common:bundleStyles']),
    'core:bundleLocale'
  )
);

gulp.task(
  'auth',
  gulp.series(
    'auth:clean',
    gulp.parallel(['auth:copyAssets', 'auth:copyStyles', 'auth:copyLocale']),
    'core:bundleLocale'
  )
);

gulp.task(
  'geo',
  gulp.series(
    'geo:clean',
    gulp.parallel([
      'geo:copyAssets',
      'geo:copyStyles',
      'geo:copyLocale',
      'geo:copyNGCC'
    ]),
    gulp.parallel(['geo:bundleStyles']),
    'core:bundleLocale'
  )
);

gulp.task(
  'context',
  gulp.series(
    gulp.parallel(['context:copyLocale', 'context:copyNGCC']),
    'core:bundleLocale'
  )
);

gulp.task(
  'integration',
  gulp.series(
    gulp.parallel(['integration:copyLocale', 'integration:copyNGCC']),
    'core:bundleLocale'
  )
);

gulp.task(
  'default',
  gulp.series(['core', 'common', 'auth', 'geo', 'context', 'integration'])
);
