import { Component, OnInit } from '@angular/core';
import { PersonasService } from '../service/personas.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {
  
  nombre: string | null = null;
  cedula: string | null = null;
  rol: string | null = null;

  modosEdicion: { [key: number]: boolean } = {};

  persona = {
    id: null,
    nombre: "",
    apellido: "",
    username: "",
    password: "",
    tipoIdentificacion: "",
    identificacion: "",
    edad: null,
    correo: "",
    direccion: "",
    telefono: "",
    rol: "",
    imagen: "",
  };

  personaVacia = {
    id: null,
    nombre: "",
    apellido: "",
    username: "",
    password: "",
    tipoIdentificacion: "",
    identificacion: "",
    edad: null,
    correo: "",
    direccion: "",
    telefono: "",
    rol: "",
    imagen: "",
  };

  personasEdicion: { [key: number]: any } = {}; // Usar un objeto para manejar instancias independientes

  imagenSeleccionada: File | null = null;
  imagenBase64: string = '';

  data: any[] = [];

  constructor(
      private personasService: PersonasService, 
      private toastr: ToastrService,
      private router: Router
    ) { }

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre')
    this.cedula = localStorage.getItem('cedula')
    this.rol = localStorage.getItem('rol')
    this.listarUsuarios();
    if (this.nombre === null) {
      this.router.navigate(['/']);
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      const imagenSeleccionada = files[0];
      this.convertirImagenABytes(imagenSeleccionada, (base64StringWithHeader) => {
        if (base64StringWithHeader !== null) {
          this.imagenBase64 = base64StringWithHeader;
        }
      });
    }
  }

  convertirImagenABytes(imagen: File, callback: (result: string | null) => void): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result;
        callback(base64String);
      } else {
        console.error('Error al convertir la imagen a base64.');
        callback(null);
      }
    };
    reader.readAsDataURL(imagen);
  }

  crearUsuario(): void {
    this.persona.imagen = this.imagenBase64
    this.personasService.crearPersona(this.persona).subscribe(
      (data) => {
        console.log('Usuario creado exitosamente: ', data);
        this.toastr.success('Usuario creado');
        this.persona = {...this.personaVacia}
        this.listarUsuarios();
      },
      (error) => {
        console.log('Error al crear usuario: ', error);
      if (error.error) {
        console.log('Mensaje de error del backend: ', error.error);
        // Acceder al mensaje específico de error
        const errorMessage = error.error;
        this.toastr.error(errorMessage, 'Error al crear el usuario');
      } else {
        this.toastr.error('Asegúrese de ingresar los datos correctamente', 'Error al crear el usuario');
      }
      }
    );
  }

  eliminarUsuario(id: number): void {
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
    if (confirmacion) {
      this.personasService.eliminarPersona(id).subscribe(
        (data) => {
          console.log('Usuario eliminado: ', data);
          this.toastr.success('Usuario eliminado correctamente', 'Eliminado');
          this.listarUsuarios();
        },
        (error) => {
          console.error('Error al eliminar usuario: ', error);
          this.toastr.error('Usuario eliminado correctamente', 'Eliminado');
          this.listarUsuarios();
        }
      );
    } else {
      console.log('Eliminación cancelada por el usuario');
    }
  }

  listarUsuarios(): void {
    this.personasService.listarPersona().subscribe(
      (data) => {
        this.data = data;
        console.log('Usuarios obtenidos: ', data);
        this.data.forEach((usuario) => {
          //console.log('Imagen de',usuario.nombre,': ', usuario.imagen);
        });
      },
      (error) => {
        console.error('Error al obtener usuarios: ', error);
      }
    );
  }

  actualizarPersona(usuario: any): void {
    this.modosEdicion[usuario.id] = true;
    this.personasEdicion[usuario.id] = { ...usuario }; // Usar el ID como clave única para cada instancia
  }


  cancelarEdicion(usuarioId:number): void {
    this.modosEdicion[usuarioId] = false;
  }

  guardarEdicion(usuarioID:number): void {
    if (usuarioID !== null) {
      const usuarioEdicion = this.personasEdicion[usuarioID];
      if (usuarioEdicion !== null && usuarioEdicion !== undefined) {
        const index = this.data.findIndex((usuario) => usuario.id === usuarioID);
        if (index !== -1) {
          this.data[index] = { ...usuarioEdicion };
          usuarioEdicion.imagen = this.imagenBase64
          this.personasService.actualizarPersona(usuarioEdicion).subscribe(
            (response) => {
              console.log('Persona actualizada: ', response);
              this.toastr.success('Usuario actualizado');
              this.listarUsuarios();
              this.cancelarEdicion(usuarioID);
            },
            (error) => {
              console.log('Error al actualizar persona: ', error);
              this.toastr.error('Ingrese todos los datos correctamente', 'Error');
            }
          );
        }
      }
    }
  }

  ocultarContrasena(password: string): string {
    // Lógica para ocultar la contraseña, por ejemplo, reemplazar cada carácter por '*'
    return password.replace(/./g, '*');
  }

  limpiarDatosSesion(): void {
    localStorage.setItem('nombre', '')
    localStorage.setItem('cedula', '')
  }

}
