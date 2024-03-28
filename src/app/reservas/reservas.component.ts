import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../service/reservas.service';
import { PersonasService } from '../service/personas.service';
import { VehiculosService } from '../service/vehiculos.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  nombre: string | null = null;
  cedula: string | null = null;
  rol: string | null = null;

  reservas: any[] = [];
  personaEncontrada: any;
  cedulaBuscar: string = '';
  vehiculoEncontrado: any;
  placaBuscar: string = '';
  reserva: any = {
    vehiculoPlaca: '',
    fechaInicio: '',
    fechaFin: ''
  };

  reservaActualizando: any;
  
  fechaInicio: string = '';
  fechaFin: string = '';
  reservasFiltradas: any[] = [];

  constructor(
    private reservasService: ReservasService,
    private personaService: PersonasService,
    private vehiculoService: VehiculosService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre')
    this.cedula = localStorage.getItem('cedula')
    this.rol = localStorage.getItem('rol')
    this.listarReservas();
    if (this.nombre === null) {
      this.router.navigate(['/']);
    }
  }

  listarReservas(): void {
    this.reservasService.listarReservas().subscribe(
      (data) => {
        this.reservas = data;
        this.reservasFiltradas = this.reservas; // Asignar aquí
      },
      (error) => {
        this.toastr.error('No se pudieron listar todas las reservas', 'Error')
        console.error('Error al listar reservas', error);
      }
    );
  }

  crearReserva(): void {
    const fechaIni = new Date(this.reserva.fechaInicio)
    const fechaFi = new Date(this.reserva.fechaFin)
    this.reserva.fechaInicio = fechaIni
    this.reserva.fechaFin = fechaFi
    this.reservasService.crearReserva(this.reserva).subscribe(
      (data) => {
        this.reserva = data
        this.toastr.success('Reserva creada')
        this.listarReservas()
        this.refrescarListado()
        console.log('Reserva creada', data)
      },
      (error) => {
        if (error.error) {
          console.log('Mensaje de error del backend: ', error.error);
          // Acceder al mensaje específico de error
          const errorMessage = error.error;
          this.toastr.error(errorMessage, 'Error al crear la reserva');
        } else {
          this.toastr.error('Asegúrese de ingresar los datos correctamente', 'Error al crear la reserva');
        }
      }
    )
  }

  buscarPersona(): void {
    if (this.cedulaBuscar) {
      this.personaService.buscarPorCedula(this.cedulaBuscar).subscribe(
        (data) => {
          this.personaEncontrada = data
          this.toastr.success('Persona encontrada')
          console.log('Persona encontrada', data)
        },
        (error) => {
          console.log('Error al buscar', error)
          this.toastr.error('Ingrese una cédula correcta', 'Persona no encontrada')
        }
      )
    }
  }

  buscarVehiculo(): void {
    if (this.placaBuscar) {
      this.vehiculoService.buscarPorPlaca(this.placaBuscar).subscribe(
        (data) => {
          this.vehiculoEncontrado = data
          this.toastr.success('Vehículo encontrado')
          console.log('Vehiculo encontrado', data)
        },
        (error) => {
          console.log('Error al buscar', error)
          this.toastr.error('Ingrese una placa correcta', 'Vehículo no encontrado')
        }
      )
    }
  }

  eliminarReserva(eliminarid: number): void {
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')
    if (confirmacion) {
      if (eliminarid) {
        this.reservasService.eliminarReserva(eliminarid).subscribe(
          (data) => {
            console.log('Reserva eliminado', data)
            this.toastr.error('No se pudo eliminar la reserva', 'Error')
            this.listarReservas()
          },
          (error) => {
            console.log('Error al eliminar', error)
            this.toastr.success('Reserva eliminada correctamente', 'Eliminada')
            this.listarReservas()
          }
        )
      }
    } else {
      console.log('Eliminación cancelada por el usuario')
    }
  }

  mostrarFormularioActualizar(reserva: any): void {
    const fechaIni = new Date(this.reserva.fechaInicio)
    const fechaFi = new Date(this.reserva.fechaFin)
    // Desactivar el modo de edición para todas las reservas
    console.log('reserva para actualiza', reserva);
    this.reservas.forEach(r => r.editando = false);
    // Activar el modo de edición solo para la reserva seleccionada
    reserva.editando = true;
    this.reservaActualizando = {
      id: reserva.id,
      personaIdentificacion: reserva.vehiculoReserva.personaList[0].identificacion,
      vehiculoPlaca: reserva.vehiculoReserva.placa,
      fechaInicio: fechaIni,
      fechaFin: fechaFi
    };

    //Convertir la fecha al formato del html
    this.reservaActualizando.fechaInicio = this.formatDate(reserva.fechaInicio);
    this.reservaActualizando.fechaFin = this.formatDate(reserva.fechaFin);
  
    console.log('Datos', this.reservaActualizando);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString.slice(0, 16); // Truncate to 'YYYY-MM-DDTHH:mm'
  }
  

  actualizarReserva(): void {
    const fechaI = new Date(this.reservaActualizando.fechaInicio)
    const fechaF = new Date(this.reservaActualizando.fechaFin)
    this.reservaActualizando.fechaInicio = fechaI
    this.reservaActualizando.fechaFin = fechaF
    this.reservasService.actualizarReserva(this.reservaActualizando).subscribe(
      (data) => {
        this.toastr.success('Reserva actualizada');
        this.reservaActualizando = null;
        this.listarReservas();
        console.log('Reserva actualizada', data);
      },
      (error) => {
        console.error('Error al actualizar la reserva', error);
        this.toastr.error('Asegúrese de ingresar los datos correctamente', 'Error al actualizar la reserva');
        this.listarReservas();
      }
    );
  }

  cancelarActualizacion(): void {
    // Desactivar el modo de edición para todas las reservas
    this.reservas.forEach(r => r.editando = false);
    this.reservaActualizando = null;
  }

  filtrarReservasPorFechas(): void {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio + 'T00:00:00');
      const fechaFin = new Date(this.fechaFin + 'T23:59:59');
  
      // Validar que fechaFin no sea menor que fechaInicio
      if (fechaFin < fechaInicio) {
        // Manejar la situación donde fechaFin es menor que fechaInicio
        this.toastr.error('La fecha de fin no puede ser menor que la fecha de inicio', 'Error');
        return;
      }
  
      this.reservasFiltradas = this.reservas.filter(reserva => {
        const fechaReserva = new Date(reserva.fechaInicio);
        return fechaReserva >= fechaInicio && fechaReserva <= fechaFin;
      });
    } else {
      // Si no se seleccionan fechas, mostrar todas las reservas
      this.reservasFiltradas = this.reservas;
    }
  }

  refrescarListado(): void{
    this.fechaInicio = '';
    this.fechaFin = '';
    this.reservasFiltradas = [];
    this.reservas = [];
    this.listarReservas();
  }

  limpiarDatosSesion(): void {
    localStorage.setItem('nombre', '')
    localStorage.setItem('cedula', '')
  }

  //Para agregar la placa al formulario de creacion
  agregarPlacaVehiculo(): void {
    this.reserva.vehiculoPlaca = this.vehiculoEncontrado.placa;
    this.limpiarFormularioVehiculoEncontrado();  // Limpia el formulario
    this.placaBuscar = '' //Limpia el cuadro de busqueda
  }  

  limpiarFormularioVehiculoEncontrado(): void {
    this.vehiculoEncontrado = null;
  }


}
