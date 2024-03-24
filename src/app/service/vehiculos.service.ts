import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  private urlActualizarVehiculos = 'http://localhost:8080/api/vehiculo/actualizar';
  private urlBuscarPorPlaca = 'http://localhost:8080/api/vehiculo/buscarPorPlaca/';
  private urlCrearVehiculo = 'http://localhost:8080/api/vehiculo/crear';
  private urlListarVehiculos = 'http://localhost:8080/api/vehiculo/buscarTodos';
  private urlEliminarVehiculo = 'http://localhost:8080/api/vehiculo/eliminar/';
  private urlAgregarPersonaVehiculo = 'http://localhost:8080/api/vehiculo/agregarPersonaAVehiculo/';
  private urlEliminarPersonaDeVehiculo = 'http://localhost:8080/api/vehiculo/eliminarPersonaDeVehiculo/';

  constructor(private http: HttpClient) { }

  actualizarVehiculos(vehiculo: any): Observable<any> {
    return this.http.put<any>(this.urlActualizarVehiculos, vehiculo);
  }

  buscarPorPlaca(placa: string): Observable<any> {
    return this.http.get<any>(this.urlBuscarPorPlaca + placa);
  }

  crearVehiculo(vehiculo:any): Observable<any> {
    return this.http.post<any>(this.urlCrearVehiculo, vehiculo);
  }

  listarVehiculos(): Observable<any> {
    return this.http.get<any>(this.urlListarVehiculos);
  }

  eliminarVehiculo(id: number): Observable<any>{
    return this.http.delete<any>(this.urlEliminarVehiculo + id)
  }

  agregarPersonaVehiculo(idVehiculo: number, identificacion:string): Observable<any>{
    const requestBody = { identificacion: identificacion};
    return this.http.post<any>(this.urlAgregarPersonaVehiculo + idVehiculo, requestBody )
  }

  eliminarPersonaDeVehiculo(idVehiculo: number, identificacion:string): Observable<any>{
    const requestBody = { identificacion };
    return this.http.delete<any>(this.urlEliminarPersonaDeVehiculo + idVehiculo, { body: requestBody })
  }
}
