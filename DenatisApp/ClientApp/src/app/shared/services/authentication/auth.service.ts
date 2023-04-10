import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { firstValueFrom } from 'rxjs';
import { ApiClient } from '../api-client';

const defaultPath = '/';

@Injectable()
export class AuthService {
  private MAIN_ENDPOINT = 'api/authentication/login';
  private _user?: User | null;
  get loggedIn(): boolean {
    return !!this._user;
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(private apiClient: ApiClient, private router: Router) { }

  async logIn(payload: User) {
    let result= {
      isOk: false,
      data: "error...",
      message: "Authentication failed"
    };

    await firstValueFrom(this.apiClient.post(this.MAIN_ENDPOINT, { username: payload.username, password: payload.password }))
      .then((data:any) => {
        result = {
          isOk: true,
          data: data,
          message: "Authentication successful"
        }
        this._user = data.currentUser;
        this.router.navigate([this._lastAuthenticatedPath]);
      })
      .catch((err) => {
        result = {
          isOk: false,
          data: err,
          message: "Authentication failed"
        };
      });

      return result;
  }

  async getUser() {
    return this.loggedIn
    ? {
      isOk: true,
      data: this._user
    }
    : {
      isOk: false,
      data: null
    };
  }

  async logOut() {
    this._user = null;
    this.router.navigate(['/login']);
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.loggedIn;
    const isAuthForm = [
      'login'
    ].includes(route.routeConfig?.path || defaultPath);

    if (isLoggedIn && isAuthForm) {
      this.authService.lastAuthenticatedPath = defaultPath;
      this.router.navigate([defaultPath]);
      return false;
    }

    if (!isLoggedIn && !isAuthForm) {
      this.router.navigate(['/login']);
    }

    if (isLoggedIn) {
      this.authService.lastAuthenticatedPath = route.routeConfig?.path || defaultPath;
    }

    return isLoggedIn || isAuthForm;
  }
}
