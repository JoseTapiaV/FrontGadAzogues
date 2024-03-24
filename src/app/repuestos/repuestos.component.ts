import { Component, OnInit } from '@angular/core';
import { RepuestosService } from '../service/repuestos.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-repuestos',
  templateUrl: './repuestos.component.html',
  styleUrls: ['./repuestos.component.css']
})
export class RepuestosComponent implements OnInit {

  mostrarFormularioCrear: boolean = true;

  modelosDisponibles: string[] = ['Genérico','DMAX H1','LUX V COMODAT','10 - TRAIL 200','13 WORKSTAR','XM250  MOTO 8','SHARK III DY200','PATROL K','TANQUERO BLANCO','DY110V-D NRO 5','DY250 SCORPION','DIMAX R','GRAN VITAR G1','ENDURO NRO 2','D-MAX','PLATAFORMA 10','VOLQUETA 4','12 RECOLECTOR','9 IGM IM150SC','CG-11','TRACTOR D7G','BT-50 4X4 B1','VOLQUETA 9','RECOLECTOR11','DIMAX W','12 - TRAIL 200','MINICARGADORA','RODILLO.LISO','TROOPER C','CISTERNA C3','SEDAN T','13 - TRAIL 200','LUV L','ENDURO NRO 1','MOTONIVELADORA','D-MAX A2','12 WORKSTAR','VOLQUETE  11','CANTER J','LUV E','DURASTAR 15','TROOPER A','DIMAX S','D-MAX A4','LANDCRUISER M','DURAESTAR 14','FIJI 125','NPR O','PAVIMENTADORA','HILUX P','DIMAX A1','DY200 SHARK III','TROOPER D','C1 NLR  4X2','CARGADORA-760','RECOLECTOR 13','RETROEXCAVADORA','RECOLECTOR 9','HILUX Q','FRONTIER F1','D-MAX A3','JEEP G','NMR 85H X','RECOLECTOR 14','DY250 SCORP','RECOLECTOR 7','JEEP H','VOLQUETA 10','NHR N','TANQUERO 7','LUV  F','RECOLECTOR 8','LANDCRUISER U','JH125-D NRO 4','EXCAVADOR-ORUGA','DURASTART 16','IVECO','RETROESCABADORA','CROSS ENDURO6','CAMIÓN   Z','CLINICA VETERIN','DURASTAR 17','TM DIESEL CN','RODILLO VIBROMA','VOLQUETA 8','HILUX I','JH125-D NRO 3','FURGON Y','DISTR.ASFALTO','11 - TRAIL 200','RODILLO.NEUMATI'];

  nombre: string | null = null;
  cedula: string | null = null;

  repuestos: any[] = []

  repuesto: any = {
    nombre: '',
    cantidad: null,
    valorUnitario: null,
    marca: '',
    modelo: ''
  }

  repuestoActualizando: any

  nombreBusqueda: string = '';

  constructor(
    private repuestosService: RepuestosService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre')
    this.cedula = localStorage.getItem('cedula')
    this.listarRepuestos()
    if (this.nombre === null) {
      this.router.navigate(['/']);
    }
  }

  listarRepuestos(): void {
    this.repuestosService.listarRepuestos().subscribe(
      (data) => {
        this.repuestos = data
      },
      (error) => {
        this.toastr.error('No se pudieron listar todos los repuestos', 'Error')
      }
    )
  }

  crearRepuesto(): void {
    console.log('a crear', this.repuesto)
    this.repuestosService.crearRepuesto(this.repuesto).subscribe(
      (data) => {
        this.repuesto = {
          nombre: '',
          cantidad: null,
          valorUnitario: null,
          marca: '',
          modelo: ''
        };
        this.toastr.success('Repuesto creado')
        this.listarRepuestos()
      },
      (error) => {
        if (error.error) {
          console.log('Mensaje de error del backend: ', error.error);
          // Acceder al mensaje específico de error
          const errorMessage = error.error;
          this.toastr.error(errorMessage, 'Error al crear el repuesto');
          this.listarRepuestos()
        } else {
          this.toastr.error('Asegúrese de ingresar los datos correctamente', 'Error al crear el repuesto');
          this.listarRepuestos()
        }
      }
    )
  }

  actualizarRepuesto(): void {
    this.repuestosService.actualizarRepuesto(this.repuestoActualizando). subscribe(
      (data) => {
        this.toastr.success('Repuesto actualizado')
        this.repuestoActualizando = null
        this.listarRepuestos()
      },
      (error) => {
        this.toastr.error('Asegúrese de ingresar los datos correctamente', 'Error al actualizar el repuesto');
        this.listarRepuestos()
      }
    )
  }

  eliminarRepuesto(id: number): void {
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar este repuesto?')
    if (confirmacion) {
      if (id) {
        this.repuestosService.eliminarRepuesto(id).subscribe(
          (data) => {
            this.toastr.success('Repuesto eliminado correctamente', 'Eliminado')
            this.listarRepuestos()
          },
          (error) => {
            this.toastr.error('No se pudo eliminar el repuesto', 'Eliminado')
            this.listarRepuestos()
          }
        )
      }
    } else {
      this.toastr.warning('Eliminación cancelada por el usuario')
    }
  }

  mostrarFormularioActualizar(repuesto: any): void {
    // Desactivar el modo de edición para todas las reservas
    this.repuestos.forEach(r => r.editando = false);
    // Activar el modo de edición solo para la reserva seleccionada
    repuesto.editando = true;
    // Clonar la reserva para evitar modificar directamente el objeto en la lista
    this.repuestoActualizando = {
      id: repuesto.id,
      nombre: repuesto.nombre,
      cantidad: repuesto.cantidad,
      valorUnitario: repuesto.valorUnitario,
      marca: repuesto.marca,
      modelo: repuesto.modelo
    };
    this.mostrarFormularioCrear = false; // Ocultar el formulario de creación
  }

  cancelarActualizacion(): void {
    // Desactivar el modo de edición para todas las reservas
    this.repuestos.forEach(r => r.editando = false);
    this.repuestoActualizando = null;
    this.mostrarFormularioCrear = true
  }

  buscarPorNombre(): void {
    if (this.nombreBusqueda.trim() !== '') {
      this.repuestosService.buscarPorNombre(this.nombreBusqueda).subscribe(
        (data) => {
          this.repuestos = data;
        },
        (error) => {
          this.toastr.error('No se pudieron obtener los repuestos', 'Error');
          console.error('Error al buscar repuestos', error);
        }
      );
    } else {
      this.toastr.warning('Ingrese un nombre de repuesto para realizar la búsqueda');
    }
  }

  refrescarListado(): void {
    this.listarRepuestos()
    this.nombreBusqueda = ''
  }

  limpiarDatosSesion(): void {
    localStorage.setItem('nombre', '')
    localStorage.setItem('cedula', '')
  }

}
