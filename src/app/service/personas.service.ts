import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  private urlActualizarPersonas = 'http://localhost:8080/api/persona/actualizar';
  private urlCrearPersonas = 'http://localhost:8080/api/persona/crear';
  private urlEliminarPersonas = 'http://localhost:8080/api/persona/eliminar/';
  private urlListarPersonas = 'http://localhost:8080/api/persona/buscarTodos';
  private urlBuscarCedula = 'http://localhost:8080/api/persona/buscarPorCedula/';
  private urlBuscarNombreApellido = 'http://localhost:8080/api/persona/buscarPorNombreOApellido/';
  private urlBuscarMecanicoNombre = 'http://localhost:8080/api/persona/listarMecanicos/'
  private urlBuscarChoferNombre = 'http://localhost:8080/api/persona/listarChoferes/'

  constructor(private http: HttpClient) { }

  actualizarPersona(persona: any): Observable<any> {
    return this.http.put<any>(this.urlActualizarPersonas, persona);
  }

  crearPersona(persona: any): Observable<any> {
    return this.http.post<any>(this.urlCrearPersonas, persona);
  }

  eliminarPersona(id: number): Observable<any> {
    return this.http.delete<any>(this.urlEliminarPersonas + id);
  }

  listarPersona(): Observable<any> {
    return this.http.get<any>(this.urlListarPersonas);
  }

  buscarPorCedula(cedula: string): Observable<any> {
    return this.http.get<any>(this.urlBuscarCedula + cedula);
  }

  buscarPorNombreApellido(nombre: string): Observable<any>{
    return this.http.get<any>(this.urlBuscarNombreApellido + nombre)
  }

  buscarMecanicoNombre(nombre: string): Observable<any>{
    return this.http.get<any>(this.urlBuscarMecanicoNombre + nombre)
  }

  buscarChoferNombre(nombre: string): Observable<any>{
    return this.http.get<any>(this.urlBuscarChoferNombre + nombre)
  }
}