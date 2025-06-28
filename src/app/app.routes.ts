import { Routes } from '@angular/router';
import { ServerListComponent } from './server-list/server-list.component';
import { ServerFormComponent } from './server-form/server-form.component';
import { ServerDetailsComponent } from './server-details/server-details.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { SpecificationFormComponent } from "./specification-form/specification-form.component";
import { SpecificationListComponent } from "./specification-list/specification-list.component";

export const routes: Routes = [
  { path: 'servers', component: ServerListComponent },
  { path: 'servers/add', component: ServerFormComponent },
  { path: 'servers/edit/:id', component: ServerFormComponent },
  { 
      path: 'servers/:id', 
      component: ServerDetailsComponent,
      children: [
          { path: 'equipment', component: EquipmentListComponent }
      ]
  },

  { path: 'equipment/add/:serverId', component: EquipmentFormComponent },
  { path: 'equipment/edit/:id', component: EquipmentFormComponent },
  { 
      path: 'equipment/:id', 
      component: SpecificationListComponent 
  },

  { path: 'users', component: UserListComponent },
  { path: 'users/add', component: UserFormComponent },
  { path: 'users/edit/:id', component: UserFormComponent },
  
  { path: 'specifications/add/:equipmentId', component: SpecificationFormComponent },
  { path: 'specifications/edit/:id', component: SpecificationFormComponent },
  
  { path: '', redirectTo: '/servers', pathMatch: 'full' },
  { path: '**', redirectTo: '/servers' }
];