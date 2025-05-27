import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialFormComponent } from './material-form/material-form.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: MaterialListComponent },
      { path: 'create', component: MaterialFormComponent },
      { path: 'edit/:id', component: MaterialFormComponent }
    ])
  ]
})
export class MaterialModule { } 