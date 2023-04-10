import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiClient implements HttpInterceptor {
  private baseURL: string = 'https://localhost:5000/';

  constructor(private http: HttpClient) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let token = localStorage.getItem('UserToken');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const modifiedRequest = request.clone({
      headers: headers,
      url: `${this.baseURL}${request.url}`
    });

    return next.handle(modifiedRequest);
  }

  get<T>(url: string) {
    return this.http.get<T>(url);
  }

  post<T>(url: string, data: any) {
    return this.http.post<T>(url, data);
  }

  put<T>(url: string, data: any) {
    return this.http.put<T>(url, data);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(url);
  }
}
