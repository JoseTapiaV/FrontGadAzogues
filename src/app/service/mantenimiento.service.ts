import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  private urlListarMantenimiento = 'http://localhost:8080/api/mantenimiento/listarMantenimientosP'
  private urlCrearMantenimiento = 'http://localhost:8080/api/mantenimiento/agendarMantenimiento'
  private urlFinalizarMantenimiento = 'http://localhost:8080/api/mantenimiento/finalizarMantenimiento/'
  private urlListarRepuestosPorMantenimiento = 'http://localhost:8080/api/mantenimiento/listarRepuestos/'
  private urlAgregarRepuesto = 'http://localhost:8080/api/mantenimiento/agregarRepuesto/'

  constructor(private http:HttpClient) { }

  listarMantenimiento(): Observable<any> {
    return this.http.get<any>(this.urlListarMantenimiento)
  }

  crearMantenimiento(mantenimiento: any): Observable<any>{
    return this.http.post<any>(this.urlCrearMantenimiento, mantenimiento)
  }

  finalizarMantenimiento(id: number): Observable<any>{
    return this.http.delete<any>(this.urlFinalizarMantenimiento + id)
  }

  listarRepuestoMantenimiento(id:number): Observable<any>{
    return this.http.get<any>(this.urlListarRepuestosPorMantenimiento+id)
  }

  agregarRepuesto(id: number, repuestoId: number, cantidadRepuesto: number): Observable<any>{
    const requestBody = { repuestoId: repuestoId, cantidadRepuesto: cantidadRepuesto };
    console.log('json', requestBody)
    return this.http.put<any>( this.urlAgregarRepuesto+id, requestBody )
  }
}
