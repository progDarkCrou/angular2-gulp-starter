import { RouterModule } from "@angular/router";
import { AdminHomeComponent } from "./components/admin-home.component";
export const adminRoutes = RouterModule.forChild([
  {
    path: '',
    component: AdminHomeComponent
  }
]);
