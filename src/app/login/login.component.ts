import { Component } from '@angular/core';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  rol: string = '';

  constructor(
    private loginService:LoginService, 
    private router:Router, 
    private toastr: ToastrService
  ){}

  login(): void {
    this.loginService.login(this.username, this.password).subscribe(
      (response) => {
        localStorage.setItem('nombre', response.nombre)
        localStorage.setItem('cedula', response.identificacion)
        localStorage.setItem('rol', response.rol);
        this.router.navigate(['/Principal']);
        this.toastr.success('Bienvenido ' + response.nombre)
      },
      (error) => {
        this.toastr.error('Usario o contraseña incorrectos', 'Error')
        this.username = ''
        this.password = ''
      }
    )
  }

}
