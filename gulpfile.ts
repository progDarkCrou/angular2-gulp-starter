/**
 * Created by avorona on 2016-10-05.
 */

let gulp = require('gulp');
let cache = require('gulp-cached');
let ts = require('gulp-typescript');

let tsProject = ts.createProject('tsconfig.json');

class Config {
  public src = 'src';
  public dist = 'dist';
  public tmp = `${this.dist}/tmp`;
  public prod = `${this.dist}/prod`
}

let config = new Config();

gulp.task('build.dev', () => {
  return gulp.src([`${config.src}/**/*.ts`])
      .pipe(cache('ts'))
      .pipe(tsProject())
      .js
      .pipe(gulp.dest(`${config.tmp}`));
});

gulp.task('build.watch', () => {
  gulp.watch(`${config.src}/**/*.ts`, ['build.dev']);
});

gulp.task('index', () => {
  return gulp.src(`${config.src}index.html`)
      .pipe(gulp.dest(`${config.prod}`));
});

gulp.task('bundle.app', ['build.dev'], () => {
  let sjb = new (require('systemjs-builder'))({
    defaultJSExtension: true,
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

gulp.task('bundle.watch', ['bundle.app'], () => {
  gulp.watch(`${config.tmp}/**/*.js`, ['bundle.app']);
});

gulp.task('serve.dev', ['bundle.watch', 'index'], () => {
  let bs = require('browser-sync');
  bs.init({
    port: '5555',
    files: [`${config.prod}/**/*.{html,htm,css,js}`],
    server: {
      baseDir: `${config.prod}`,
      index: 'index.html',
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
});
