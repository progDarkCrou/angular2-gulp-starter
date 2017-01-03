import { NgModule } from '@angular/core';
import { AdminHomeComponent } from "./components/admin-home.component";
import { adminRoutes } from "./admin.router";

@NgModule({
    imports: [
      adminRoutes
    ],
    declarations: [AdminHomeComponent],
})
export default class AdminModule { }
