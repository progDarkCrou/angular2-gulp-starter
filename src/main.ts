import { NgModule } from '@angular/core';
import { BrowserModule, platformBrowser } from '@angular/platform-browser';
/**
 * Created by avorona on 2016-10-05.
 */

@NgModule({
  imports: [
    BrowserModule
  ],
  bootstrap: []
})
export default class AppModule {
}

platformBrowser().bootstrapModule(AppModule);
