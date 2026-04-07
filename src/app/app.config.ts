import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {routes} from "./app.routes";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {providePrimeNG} from "primeng/config";
import Aura from '@primeng/themes/aura';
import {provideToastr} from "ngx-toastr";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./interceptors/auth.interceptor";
import {definePreset} from "@primeng/themes";
// CORIS MESO FINANCE - Bleu foncé (#002855) et rouge vif (#E30613)
const CorisPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#2563eb',
      600: '#1d4ed8',
      700: '#1e40af',
      800: '#1e3a8a',
      900: '#1e3a8a',
      950: '#002855'
    },
    secondary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#E30613',
      600: '#c80510',
      700: '#ad040e',
      800: '#92030c',
      900: '#77020a',
      950: '#5c0108'
    }
  }
});


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
      authInterceptor
    ])),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      progressAnimation: 'decreasing',
    }),
    providePrimeNG({
      theme: {
        preset: CorisPreset
      }
    })]
};
