import { RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home.component";

export const routes = RouterModule.forRoot([
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin',
    loadChildren: 'modules/admin/admin.module'
  }
]);
