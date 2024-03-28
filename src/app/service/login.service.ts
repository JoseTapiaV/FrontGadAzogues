import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = 'http://localhost:8181/gestionVehicular/api/persona/login';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const data = { username, password };
    return this.http.post<any>(this.loginUrl, data);
  }
}
