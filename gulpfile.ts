import * as browserSync from "browser-sync";
import gulp = require('gulp');
import concat = require('gulp-concat');

let template = require('gulp-template');
let cache = require('gulp-cached');
let ts = require('gulp-typescript');
let Builder = require('systemjs-builder');

let tsProject = ts.createProject('src/tsconfig.json');

let argv = process.argv;
let env: string = argv.indexOf('serve.prod') !== -1 || argv.indexOf('build') != -1 ? 'PROD' : 'DEV';

let bs = browserSync.create();

class Config {
  public env: string = env;

  public src = 'src';
  public dist = 'dist';
  public tmp = `${this.dist}/tmp`;
  public prod = `${this.dist}/prod`;
}

let config = new Config();

gulp.task('compile.ts', () => {
  let tsCache = cache('ts');
  return gulp.src([`${config.src}/**/*.ts`])
      .pipe(tsCache)
      .pipe(tsProject())
      .js
      .pipe(gulp.dest(`${config.tmp}/`));
});

gulp.task('compile.ts.watch', ['compile.ts'], () => {
  gulp.watch(`${config.src}/**/*.ts`, ['compile.ts']);
});

// gulp.task('index.tmp', () => {
//   let indexCache = cache('index');
//   return gulp.src(`${config.src}/index.html`)
//       .pipe(indexCache)
//       .pipe(template(config))
//       .pipe(gulp.dest(config.tmp));
// });
//
// gulp.task('index.watch', ['index.tmp'], () => {
//   gulp.watch(`${config.src}/index.html`, ['index.tmp']);
// });
//
// gulp.task('index.prod', ['index.tmp'], () => {
//   return gulp.src(`${config.src}/index.html`)
//       .pipe(template(config))
//       .pipe(gulp.dest(config.prod));
// });

gulp.task('html.tmp', () => {
  let htmlCache = cache('html');
  return gulp.src(`${config.src}/**/*.html`)
      .pipe(htmlCache)
      .pipe(template(config))
      .pipe(gulp.dest(config.tmp));
});

gulp.task('html.watch', ['html.tmp'], () => {
  gulp.watch(`${config.src}/**/*.html`, ['html.tmp']);
});

gulp.task('html.prod', ['html.tmp'], () => {
  return gulp.src(`${config.src}/**/*.html`)
      .pipe(template(config))
      .pipe(gulp.dest(config.prod));
});

gulp.task('bundle.ts', ['compile.ts'], () => {
  let sjb = new Builder({
    defaultJSExtensions: true,
    // baseURL: `${config.tmp}`,
    paths: {
      'npm:*': 'node_modules/*',
    },
    map: {
      '@angular': 'npm:@angular',
      'rxjs': 'npm:rxjs'
    },
    packages: {
      '@angular': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/common': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/compiler': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/core': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/forms': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/http': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/platform-browser': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/platform-browser-dynamic': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/router': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'rxjs': {
        main: 'Rx.js',
        defaultExtension: 'js'
      }
    }
  });
  return sjb.buildStatic(`${config.tmp}/main.js`, `${config.prod}/main.js`);
});

gulp.task('serve.dev', ['compile.ts.watch', 'html.watch'], () => {
  bs.init({
    port: 5555,
    files: [`${config.tmp}/**/*.{html,htm,css,js}`],
    server: {
      baseDir: `${config.tmp}`,
      index: 'index.html',
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
});

// === PRODUCTION ===

gulp.task('concat.js', () => {
  gulp
      .src([
        'node_modules/core-js/client/shim.min.js',
        // 'node_modules/zone.js/dist/zone.min.js'
      ])
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(`${config.prod}`))
});

gulp.task('build', ['bundle.ts', 'concat.js', 'html.prod']);

gulp.task('serve.prod', ['build'], () => {
  bs.init({
    port: 9999,
    files: [`${config.prod}/**/*.{html,htm,css,js}`],
    server: {
      baseDir: `${config.prod}`,
      index: 'index.html',
    }
  });
});
