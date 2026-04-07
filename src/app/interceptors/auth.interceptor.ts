import { inject } from "@angular/core";
import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Router } from "@angular/router";
import {AuthService} from "../services/auth.service";

export const authInterceptor = (request: HttpRequest<any>, next: HttpHandlerFn) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.getToken()}`,
        // 'Access-Control-Allow-Origin': '*',
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
