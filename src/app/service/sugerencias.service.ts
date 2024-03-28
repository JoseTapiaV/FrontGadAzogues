import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SugerenciasService {

  private urlCrearSugerencias = 'http://localhost:8181/gestionVehicular/api/sugerencia/crearSugerencia';
  private urlListarSugerencias = 'http://localhost:8181/gestionVehicular/api/sugerencia/listarSugerencias';

  constructor(private http: HttpClient) {}

  enviarData(mensaje: string): Observable<any> {
    const dataToSend = { mensaje };
    return this.http.post<any>(this.urlCrearSugerencias, dataToSend);
  }

  getData(): Observable<any> {
    return this.http.get<any>(this.urlListarSugerencias);
  }
}
