import { Component, OnInit } from '@angular/core';
import { MantenimientoService } from '../service/mantenimiento.service';
import { RepuestosService } from '../service/repuestos.service';
import { PersonasService } from '../service/personas.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {

  repuestosMantenimiento: any[] = [];
  mostrarRepuestos: boolean = false;
  mostrarAgregarRepuestos: boolean = false;
  mostrarAgregarRepuestosDict: { [key: number]: boolean } = {};
  repuesto: any = {
    repuestoId: null,
    cantidadRepuesto: null
  };  
  idRepuesto: any

  nombre: string | null = null;
  cedula: string | null = null;
  rol: string | null = null;

  repuestoBuscar: string = ''
  repuestoEncontrado: any 

  mecanicoBuscar: string = ''
  mecanicoEncontrado: any

  mostrarFormularioCreacion: boolean = false;

  mantenimientos: any[] = []

  mantenimiento: any = {
    placaVehiculo: '',
    personasIdentificacion: '',
    fechaMantenimiento: '',
    tipoMantenimiento: '',
    kilometrajeActual: null,
    descripcion: '',
    tipoSistema: ''
  };

  alertRepuestos: string = ''

  constructor(
    private mantenimientoService: MantenimientoService,
    private repuestosService: RepuestosService,
    private personaService: PersonasService,
    private toastr: ToastrService,
    private router: Router
  ){}

  ngOnInit():void {
    this.nombre = localStorage.getItem('nombre')
    this.cedula = localStorage.getItem('cedula')
    this.rol = localStorage.getItem('rol')
    this.listarMantenimientos()
    if (this.nombre === null) {
      this.router.navigate(['/']);
    }
  }

  listarMantenimientos(): void {
    this.mantenimientoService.listarMantenimiento().subscribe(
      (data) => {
        this.mantenimientos = data
        this.notificarKMDiferencia()
      },
      (error) => {
        this.toastr.error('No se pudieron listar todos los mantenimientos', 'Error')
      }
    )
  }

  crearMantenimiento(): void {
    const fechaActual = new Date(this.mantenimiento.fechaMantenimiento);
    const dataToSend = {
      placaVehiculo: this.mantenimiento.placaVehiculo,
      personaIdentificacion: this.mantenimiento.personasIdentificacion,
      fechaMantenimiento: fechaActual,
      tipoMantenimiento: this.mantenimiento.tipoMantenimiento,
      kilometrajeActual: this.mantenimiento.kilometrajeActual,
      descripcion: this.mantenimiento.descripcion,
      tipoSistema: this.mantenimiento.tipoSistema
    };
  
    this.mantenimientoService.crearMantenimiento(dataToSend).subscribe(
      (data) => {
        this.toastr.success('Mantenimiento agendado');
        this.mostrarFormularioCreacion = !this.mostrarFormularioCreacion;
        this.listarMantenimientos();
      },
      (error) => {
        if (error.error) {
          console.log('Mensaje de error del backend: ', error.error);
          // Acceder al mensaje específico de error
          const errorMessage = error.error;
          this.toastr.error(errorMessage, 'Error al crear el mantenimiento');
        } else {
          this.toastr.error('Asegúrese de ingresar los datos correctamente', 'Error al crear el mantenimiento');
        }
      }
    );
  }
  

  finalizarMantenimiento(id: number): void{
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar este repuesto?')
    if (confirmacion) {
      if (id) {
        this.mantenimientoService.finalizarMantenimiento(id).subscribe(
          (data) => {
            this.toastr.success('Repuesto eliminado correctamente', 'Eliminado')
            this.listarMantenimientos()
          },
          (error) => {
            this.toastr.error('No se pudo eliminar el repuesto', 'Eliminado')
            this.listarMantenimientos()
          }
        )
      }
    } else {
      this.toastr.warning('Eliminación cancelada por el usuario')
    }
  }

  limpiarDatosSesion(): void {
    localStorage.setItem('nombre', '')
    localStorage.setItem('cedula', '')
  }

  toggleFormularioCreacion(): void {
    this.mostrarFormularioCreacion = !this.mostrarFormularioCreacion;
  }

  transformarTipoSistema(tipoSistema: string): string{
    if(tipoSistema === 'MOTOR'){
      return 'Motor'
    } else if(tipoSistema === 'SISTEMA_ELECTRICO'){
      return 'Sistema Eléctrico'
    } else if(tipoSistema === 'TREN_MOTRIZ'){
      return 'Tren Motriz'
    } else {
      return tipoSistema
    }
  }

  transformarTipoMantenimiento(tipoMantenimiento: string): string {
    if (tipoMantenimiento === 'MANTENIMIENTO_A_TIEMPO') {
      return 'A tiempo';
    } else if (tipoMantenimiento === 'MANTENIMIENTO_FUERA_DE_TIEMPO') {
      return 'Fuera de tiempo';
    } else {
      return tipoMantenimiento; // Si no coincide con ninguno de los casos anteriores, retorna el valor original
    }
  }

  //Buscar repuesto
  buscarRepuesto(repuestoBuscar: string): void {
    if (repuestoBuscar) {
      this.repuestosService.buscarPorNombre(repuestoBuscar).subscribe(
        (data) => {
          this.repuestoEncontrado = data;
          this.toastr.success('Repuesto encontrado');
        },
        (error) => {
          this.toastr.error('Ingrese un repuesto existente', 'Repuesto no encontrado');
          console.log('Error', error);
        }
      );
    }
  }

  //Agregar al formulario de creacion
  agregarRepuesto(repuesto: any): void {
    this.repuesto.repuestoId = repuesto.id
    this.repuestoBuscar = ''; // Puedes limpiar el campo de búsqueda si es necesario
    this.repuestoEncontrado = ''
    
  }

  //Buscar mecanico
  buscarMecanico(mecanicoBuscar: string): void {
    if(mecanicoBuscar){
      this.personaService.buscarMecanicoNombre(mecanicoBuscar).subscribe(
        (data) => {
          this.mecanicoEncontrado = data
        },
        (error) => {
          this.toastr.error('Ingrese un mecánico existente', 'Mecánico no encontrado');
          console.log('Error', error);
        }
      )
    }
  }

  //Agregar al formulariio de creacion
  agregarMecanico(mecanico: any): void {
    this.mantenimiento.personasIdentificacion = mecanico.identificacion;
    this.mecanicoBuscar = '';
    this.mecanicoEncontrado = '';
  }

  //Listar repuestos por mantenimiento
  listarRepuestosMantenimiento(id: number): void {
    this.mantenimientoService.listarRepuestoMantenimiento(id).subscribe(
      (data) => {
        console.log('datos', data)
        for(var val of data){
          this.alertRepuestos += 'Nombre del repuesto: ' + val.nombreRepuesto + ', con una cantidad de: ' + val.cantidadRequerida + '\n'
        }
        alert(this.alertRepuestos)
      },
      (error) => {
        console.error('error', error)
      }
    )
    this.alertRepuestos = ''
  }

  toggleMostrarRepuestos(id: number): void {
    this.mostrarRepuestos = !this.mostrarRepuestos;
    if (this.mostrarRepuestos) {
        this.listarRepuestosMantenimiento(id);
    }
  }

  toggleMostrarAgregarRepuestos(id: number): void {
    // Cambiar el estado de visualización solo para el mantenimiento con el ID proporcionado
    this.mostrarAgregarRepuestosDict[id] = !this.mostrarAgregarRepuestosDict[id];
  }

  agregarRepuestoMantenimiento(id:number): void {
    this.mantenimientoService.agregarRepuesto(id, this.repuesto.repuestoId, this.repuesto.cantidadRepuesto).subscribe(
      (data) => {
        console.log('creado', data)
        this.repuesto = {
          repuestoId: null,
          cantidadRepuesto: null
        };
        this.toggleMostrarAgregarRepuestos(id)
        this.toastr.success('Mantenimiento creado')
        this.listarRepuestosMantenimiento(id)
      },
      (error) => {
        console.log('error: ', error)
        if (error.error.text) {
          console.log('Mensaje de error del backend: ', error.error.text);
          // Acceder al mensaje específico de error
          const errorMessage = error.error.text;
          this.toastr.warning(errorMessage);
          this.repuesto = {
            repuestoId: null,
            cantidadRepuesto: null
          }; 
          this.listarRepuestosMantenimiento(id)
        } else if (error.error){
          this.toastr.error(error.error, 'Error al agregar repuestos al matenimiento');
          this.repuesto = {
            repuestoId: null,
            cantidadRepuesto: null
          }; 
        }
        this.toggleMostrarAgregarRepuestos(id)
      }
    )
  }


  generarPDF = (): void => {
    const element = document.getElementById('contenido'); // El ID del contenedor HTML que deseas convertir a PDF
    const pdf = new jsPDF('l', 'in', 'a4');

    if(element){
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
    
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save('archivo.pdf');
      });
    }else {
      console.error('No se encontró ningún elemento con el ID "contenido"');
    }
  }

  notificarKMDiferencia() {
    this.mantenimientos.forEach(mantenimiento => {
      const diferencia = mantenimiento.proximoCambio - mantenimiento.kilometrajeActual;
      if (diferencia < 200) {
        window.alert(`El vehículo con placa: ${mantenimiento.vehiculoMantenimiento}, le falta: ${diferencia}KM para su próximo mantenimiento.`);
      }
    });
  }
  
}
