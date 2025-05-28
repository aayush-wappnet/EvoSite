import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialRequestComponent } from './material-request/material-request.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MaterialListComponent,
        data: { roles: ['ADMIN', 'CONTRACTOR', 'SITE_ENGINEER'] }
      },
      {
        path: 'request',
        component: MaterialRequestComponent,
        data: { roles: ['SITE_ENGINEER'] }
      }
    ])
  ]
})
export class MaterialModule { } 