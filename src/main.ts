import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './app/home/home.component';
import { routes } from './app/app.routes';

bootstrapApplication(HomeComponent, {
  providers: [
    provideHttpClient(),  // Fournit HttpClient
    provideRouter(routes) // Fournit le routing
  ]
});
