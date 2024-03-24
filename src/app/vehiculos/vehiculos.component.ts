import { Component, OnInit } from '@angular/core';
import { VehiculosService } from '../service/vehiculos.service';
import { PersonasService } from '../service/personas.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  nombre: string | null = null;
  cedula: string | null = null;

  nombreBuscar: string = '';
  personaEncontrada: any[] = [];

  mostrarFormularioCreacion: boolean = false;
  mostrarFormularioPersonas: boolean = false;
  mostrarTablaVehiculo: boolean = false;
  actualizarV: boolean = false;
  personasEncargadas: string[] = [];

  modosEdicion: { [key: number]: boolean } = {};
  placa: string = '';
  cedulaPersona: string = ''

  vehiculo = {
    id: null,
    placa: "",
    marca: "",
    modelo: "",
    chasis: "",
    motor: "",
    kilometraje: null,
    cilindraje: null,
    anioModelo: null,
    anioMatricula: null,
    color: "",
    claseVehiculo: "",
    imagen: "",
    personaIdentificacion: [] as string[]
  };

  vehiculoVacio = {
    id: null,
    placa: "",
    marca: "",
    modelo: "",
    chasis: "",
    motor: "",
    kilometraje: null,
    cilindraje: null,
    anioModelo: null,
    anioMatricula: null,
    color: "",
    claseVehiculo: "",
    imagen: "",
    personaIdentificacion: [] as string[]
  }

  vehiculosEdicion: { [key: number]: any } = {}; // Usar un objeto para manejar instancias independientes

  data: any[] = []

  imagenBase64: string = '';

  constructor(
    private vehiculoService: VehiculosService,
    private personaService: PersonasService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre')
    this.cedula = localStorage.getItem('cedula')
    this.listarVehiculos();
    if (this.nombre === null) {
      this.router.navigate(['/']);
    }
  }

  buscarPorPlaca(): void {
    this.vehiculoService.buscarPorPlaca(this.placa).subscribe(
      (response) => {
        console.log('Vehículo encontrado: ', response);
        this.vehiculo = response;
        this.toastr.success('Vehículo encontrado');
      },
      (error) => {
        this.toastr.error('Vehículo no encontrado')
        console.log('No se encontró el vehículo: ', error);
      }
    );
  }

  actualizarVehiculo(vehiculo: any): void {
    //this.modosEdicion[vehiculo.id] = true
    this.actualizarV = true
    this.vehiculosEdicion[vehiculo.id] = { ...vehiculo }
  }

  cancelarActualizacion(): void {
    this.actualizarV = false
  }


  crearVehiculo(): void {
    // Construir el objeto JSON con los datos del vehículo
    const nuevoVehiculo = {
      placa: this.vehiculo.placa,
      marca: this.vehiculo.marca,
      modelo: this.vehiculo.modelo,
      chasis: this.vehiculo.chasis,
      motor: this.vehiculo.motor,
      cilindraje: this.vehiculo.cilindraje,
      anioModelo: this.vehiculo.anioModelo,
      anioMatricula: this.vehiculo.anioMatricula,
      color: this.vehiculo.color,
      kilometraje: this.vehiculo.kilometraje,
      claseVehiculo: this.vehiculo.claseVehiculo,
      personaIdentificacion: this.vehiculo.personaIdentificacion.map(identificacion => ({ identificacion })),
      imagen: this.imagenBase64
    };

    // Enviar la solicitud al servicio
    console.log('vehiculo a crear: ', nuevoVehiculo)
    this.vehiculoService.crearVehiculo(nuevoVehiculo).subscribe(
      (response) => {
        console.log('Vehículo creado exitosamente: ', response);
        this.toastr.success('Vehículo creado');
        this.listarVehiculos();
        this.vehiculo = { ...this.vehiculoVacio };
        this.personasEncargadas = [];
        this.mostrarFormularioCreacion = !this.mostrarFormularioCreacion;
      },
      (error) => {
        if (error.error) {
          console.log('Mensaje de error del backend: ', error.error);
          // Acceder al mensaje específico de error
          const errorMessage = error.error;
          this.toastr.error(errorMessage, 'Error al crear el vehículo');
          this.personasEncargadas = [];
        } else {
          this.toastr.error('Asegúrese de ingresar los datos correctamente', 'Error al crear el vehículo');
          this.personasEncargadas = [];
        }
      }
    );
  }

  listarVehiculos(): void {
    this.vehiculoService.listarVehiculos().subscribe(
      (data) => {
        this.data = data;
        console.log(data);
      }
    );
  }

  eliminarVehiculo(id: number): void {
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')
    if (confirmacion) {
      this.vehiculoService.eliminarVehiculo(id).subscribe(
        (data) => {
          console.log('Vehículo eliminado: ', data)
          this.toastr.error('El vehículo no se ha eliminado correctamente', 'Eliminado')
          this.listarVehiculos()
        },
        (error) => {
          console.error('Error al eliminar el vehículo: ', error)
          this.toastr.success('Vehículo eliminado correctamente', 'Eliminado')
          this.listarVehiculos()
        }
      )
    } else {
      console.log('Eliminación cancelada por el usuario')
    }
  }

  agregarPersonaVehiculo(idVehiculo: number, identificacionPersona: string): void {
    this.vehiculoService.agregarPersonaVehiculo(idVehiculo, identificacionPersona).subscribe(
      (data) => {
        console.log('Persona agregada: ', data)
        this.toastr.success('Persona agregada correctamente')
        this.cedulaPersona = ''
        this.mostrarFormularioPersonas = !this.mostrarFormularioPersonas;
        this.listarVehiculos()
      },
      (error) => {
        console.log('error: ', error)
        if (error.error && error.error.text) {
          console.log('Mensaje de error del backend: ', error.error.text);
          // Acceder al mensaje específico de error
          const errorMessage = error.error.text;
          this.toastr.warning(errorMessage);
          this.personasEncargadas = [];
          this.cancelarActualizacion();
          this.toggleFormularioAgregar();
          this.cedulaPersona = '';
        } else {
          this.toastr.error('Error al agregar persona al vehículo');
          this.personasEncargadas = [];
        }
        //console.log('Error: ', error)
        //this.toastr.warning('La persona no se pudo agregar')
        this.listarVehiculos()
      }
    )
    this.mostrarTablaVehiculo = !this.mostrarTablaVehiculo
    this.cedulaPersona = ''
    this.mostrarFormularioPersonas = !this.mostrarFormularioPersonas;
  }

  eliminarPersonadeVehiculo(idVehiculo: number, identificacionPersona: string): void {
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar a esta persona del vehículo?')

    if (confirmacion) {
      this.vehiculoService.eliminarPersonaDeVehiculo(idVehiculo, identificacionPersona).subscribe(
        (data) => {
          console.log('Persona eliminada: ', data)
          this.toastr.warning('Persona eliminada del vehículo correctamente', 'Eliminado')
          this.listarVehiculos()
        },
        (error) => {
          console.error('Error al eliminar el vehículo: ', error)
          //this.toastr.error('Persona no eliminada del vehículo', 'Error')
          this.toastr.warning('Persona eliminada del vehículo correctamente', 'Eliminado')
          this.listarVehiculos()
        }
      )
    } else {
      console.log('Eliminación cancelada por el usuario')
    }
  }

  cancelarEdicion(vehiculoID: number): void {
    this.modosEdicion[vehiculoID] = false;
  }

  guardarEdicion(vehiculo: any): void {
    this.vehiculoService.actualizarVehiculos(vehiculo).subscribe(
      (response) => {
        console.log('Vehículo actualizado: ', response);
        this.toastr.success('Vehículo actualizado');
        this.listarVehiculos();
        this.cancelarActualizacion()
      },
      (error) => {
        if (error.error) {
          console.log('Mensaje de error del backend: ', error.error);
          // Acceder al mensaje específico de error
          const errorMessage = error.error;
          this.toastr.error(errorMessage, 'Error al actualizar el vehículo');
          this.personasEncargadas = [];
        } else {
          this.toastr.error('Asegúrese de ingresar los datos correctamente', 'Error al actualizar el vehículo');
          this.personasEncargadas = [];
        }
      }
    );
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

  toggleDetalles(vehiculo: any): void {
    vehiculo.mostrarDetalles = !vehiculo.mostrarDetalles;
    this.mostrarTablaVehiculo = !this.mostrarTablaVehiculo;
    //this.mostrarFormularioPersonas = !this.mostrarFormularioPersonas;
  }

  limpiarDatosSesion(): void {
    localStorage.setItem('nombre', '')
    localStorage.setItem('cedula', '')
  }

  buscarPersonaPorNombre(nombreBuscar: string): void {
    this.personaService.buscarChoferNombre(nombreBuscar).subscribe(
      (data) => {
        console.log('Persona encontrada: ', data)
        this.personaEncontrada = data
        this.toastr.success('Chofer encontrado')
      },
      (error) => {
        console.error('Persona no encontrada: ', error)
        this.toastr.error('Chofer no encontrado')
      }
    )
  }

  limpiarFormularioPersona(): void {
    this.nombreBuscar = ''; // Establece el valor de nombreBuscar como cadena vacía
    this.personaEncontrada = []; // Limpia los resultados de la búsqueda
  }

  toggleFormularioCreacion(): void {
    this.mostrarFormularioCreacion = !this.mostrarFormularioCreacion;
  }

  toggleFormularioAgregar(): void {
    this.cedulaPersona = ''
    this.mostrarFormularioPersonas = !this.mostrarFormularioPersonas;
  }

  agregarPersonaAlFormulario(persona: any): void {
    // Agrega la identificación de la persona al array
    this.personasEncargadas.push(persona.identificacion);
    // Actualiza el valor del input con la lista de identificaciones
    this.vehiculo.personaIdentificacion = this.personasEncargadas;
    this.cedulaPersona = persona.identificacion
    // Limpia el resultado de la búsqueda y el campo de búsqueda
    this.limpiarFormularioPersona();
  }

}
