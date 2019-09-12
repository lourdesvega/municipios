import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MunicipiosComponent } from './municipios/municipios.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    MunicipiosComponent,
    AppComponent
  ],
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: 'municipios', pathMatch: 'full' },
      { path: 'municipios', component: MunicipiosComponent}
    ]),
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    RouterModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
