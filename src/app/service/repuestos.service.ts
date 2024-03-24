import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepuestosService {

  private urlListarRepuestos = 'http://localhost:8080/api/repuesto/listarRepuestos'
  private urlBuscarPorNombre = 'http://localhost:8080/api/repuesto/buscarporNombre/'
  private urlBuscarPorId = 'http://localhost:8080/api/repuesto/buscarporID/'
  private urlCrearRepuesto = 'http://localhost:8080/api/repuesto/crearRepuesto'
  private urlActualizarRepuesto = 'http://localhost:8080/api/repuesto/actualizarRepuesto'
  private urlEliminarRepuesto = 'http://localhost:8080/api/repuesto/eliminarRepuesto/'

  constructor(private http: HttpClient) { }

  listarRepuestos(): Observable<any>{
    return this.http.get<any>(this.urlListarRepuestos)
  }

  buscarPorNombre(nombre: string): Observable<any>{
    return this.http.get<any>(this.urlBuscarPorNombre + nombre)
  }

  buscarPorID(id: number): Observable<any>{
    return this.http.get<any>(this.urlBuscarPorId + id)
  }

  crearRepuesto(repuesto: any): Observable<any>{
    return this.http.post<any>(this.urlCrearRepuesto, repuesto)
  }

  actualizarRepuesto(repuesto: any): Observable<any>{
    return this.http.put<any>(this.urlActualizarRepuesto, repuesto)
  }

  eliminarRepuesto(id: number): Observable<any>{
    return this.http.delete<any>(this.urlEliminarRepuesto + id)
  }
}
