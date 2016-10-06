/**
 * Created by avorona on 2016-10-06.
 */

SystemJS.config({
  baseURL: '/',
  defaultJSExtensions: true,
  map: {
    'main': 'main',
    '@angular': 'npm:@angular',
    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    'rxjs': 'npm:rxjs'
  },
  paths: {
    'npm:*': 'node_modules/*'
  },
  packages: {
    'rxjs': {
      defaultExtension: 'js'
    }
  }
});
