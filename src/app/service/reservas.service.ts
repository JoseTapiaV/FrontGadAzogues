import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private urlcrearReserva = 'http://localhost:8181/gestionVehicular/api/reserva/realizarReserva';
  private urlListarReservas = 'http://localhost:8181/gestionVehicular/api/reserva/listarReservas';
  private urlActualizarReserva = 'http://localhost:8181/gestionVehicular/api/reserva/actualizarReserva';
  private urlBuscarPorFecha = 'http://localhost:8181/gestionVehicular/api/reserva/buscarPorFecha';
  private urlEliminarReserva = 'http://localhost:8181/gestionVehicular/api/reserva/eliminarReserva/';

  constructor(private http: HttpClient) { }

  crearReserva(reserva: any): Observable<any> {
    return this.http.post<any>(this.urlcrearReserva, reserva);
  }

  listarReservas(): Observable<any> {
    return this.http.get<any>(this.urlListarReservas);
  }

  actualizarReserva(reservaData: any): Observable<any> {
    return this.http.put<any>(this.urlActualizarReserva, reservaData);
  }

  buscarReservasPorFecha(fechas: any): Observable<any> {
    return this.http.post<any>(this.urlBuscarPorFecha, fechas);
  }

  eliminarReserva(id: number): Observable<any> {
    return this.http.delete<any>(this.urlEliminarReserva + id);
  }
}
