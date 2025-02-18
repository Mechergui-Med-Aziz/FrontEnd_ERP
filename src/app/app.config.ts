import { ApplicationConfig, NgModule } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AppRoutingModule, routes } from './app.routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
@NgModule({
  declarations: [
    HomeComponent,
    AppComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [] ,
})
export class AppModule { }
