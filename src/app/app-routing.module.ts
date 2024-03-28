import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { PersonasComponent } from './personas/personas.component'
import { SugerenciasComponent } from './sugerencias/sugerencias.component';
import { ReservasComponent } from './reservas/reservas.component';
import { LoginComponent } from './login/login.component';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component'; 
import { RepuestosComponent } from './repuestos/repuestos.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'Vehiculos', component: VehiculosComponent},
  { path: 'Personas', component: PersonasComponent},
  { path: 'Sugerencias', component: SugerenciasComponent},
  { path: 'Reservas', component: ReservasComponent},
  { path: 'Principal', component: HomeComponent},
  { path: 'Mantenimientos', component: MantenimientoComponent},
  { path: 'Repuestos', component: RepuestosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
