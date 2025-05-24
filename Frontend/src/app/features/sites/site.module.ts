import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SiteListComponent } from './site-list/site-list.component';
import { SiteFormComponent } from './site-form/site-form.component';
import { SiteService } from '../../core/services/site.service';

@NgModule({
  declarations: [
    SiteListComponent,
    SiteFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: SiteListComponent },
      { path: 'create', component: SiteFormComponent },
      { path: ':id/edit', component: SiteFormComponent }
    ])
  ],
  providers: [SiteService]
})
export class SiteModule { } 