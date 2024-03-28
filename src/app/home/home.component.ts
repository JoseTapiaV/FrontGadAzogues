import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    private router: Router
  ){}

  nombre: string | null = null;
  cedula: string | null = null;
  rol: string | null = null;

  ngOnInit() {
    this.nombre = localStorage.getItem('nombre')
    this.cedula = localStorage.getItem('cedula')
    this.rol = localStorage.getItem('rol')
    if (this.nombre === null) {
      this.router.navigate(['/']);
    }
  }

  limpiarDatosSesion(): void {
    localStorage.setItem('nombre', '')
    localStorage.setItem('cedula', '')
  }

}
