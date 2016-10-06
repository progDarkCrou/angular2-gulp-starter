/**
 * Created by avorona on 2016-10-05.
 */

import * as bs from 'browser-sync';
import gulp = require('gulp');
let template = require('gulp-template');
let cache = require('gulp-cached');
let ts = require('gulp-typescript');

let tsProject = ts.createProject('tsconfig.json');

const enum ENV {
  PROD,
  DEV
}

class Config {
  public env: ENV = ENV.DEV;

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

gulp.task('index.tmp', () => {
  return gulp.src(`${config.src}/index.html`)
      .pipe(template(config))
      .pipe(gulp.dest(`${config.tmp}`));
});

gulp.task('index.watch', ['index.tmp'], () => {
  gulp.watch(`${config.src}/index.html`, ['index.tmp']);
});

gulp.task('index.prod', ['index.tmp'], () => {
  return gulp.src(`${config.src}/index.html`)
      .pipe(template(config))
      .pipe(gulp.dest(`${config.prod}`));
});

gulp.task('bundle.ts', () => {
  let sjb = new (require('systemjs-builder'))({
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
      '@angular/core': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/platform-browser': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/compiler': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      '@angular/common': {
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

gulp.task('serve.dev', ['compile.ts.watch', 'index.watch'], () => {
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

gulp.task('serve.prod', ['bundle.ts', 'index.prod'], () => {
  bs.init({
    port: 9999,
    files: [`${config.prod}/**/*.{html,htm,css,js}`],
    server: {
      baseDir: `${config.prod}`,
      index: 'index.html',
    }
  });
});
