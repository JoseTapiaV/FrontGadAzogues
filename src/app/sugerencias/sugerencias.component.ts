import { Component, OnInit } from '@angular/core';
import { SugerenciasService } from '../service/sugerencias.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.css']
})
export class SugerenciasComponent implements OnInit{

  nombre: string | null = null;
  cedula: string | null = null;
  rol: string | null = null;

  mensaje: string = '';
  data: any[] = [];

  constructor(
    private sugerenciasService: SugerenciasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre')
    this.cedula = localStorage.getItem('cedula')
    this.rol = localStorage.getItem('rol')
    this.sugerenciasService.getData().subscribe(data => {
      this.data = data;
    });
    if (this.nombre === null) {
      this.router.navigate(['/']);
    }
  }

  enviarSugerencia(): void {
    this.sugerenciasService.enviarData(this.mensaje).subscribe(
      (response) => {
        console.log('Respuesta del servidor: ', response);
        // Actualizar la lista después de enviar la sugerencia
        this.sugerenciasService.getData().subscribe(data => {
          this.data = data;
        });
        // Reiniciar el valor del mensaje a una cadena vacía
        this.mensaje = '';
      },
      (error) => {
        console.log('Error en la petición: ', error);
      }
    );
  }

  limpiarDatosSesion(): void {
    localStorage.setItem('nombre', '')
    localStorage.setItem('cedula', '')
  }

}
