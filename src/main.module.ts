import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./components/app.component";
import { routes } from "./main.routes";
import { HomeComponent } from "./components/home.component";
import { APP_BASE_HREF } from "@angular/common";

@NgModule({
  imports: [
    BrowserModule,
    routes
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ],
  bootstrap: [AppComponent]
})
export default class MainModule {

}
