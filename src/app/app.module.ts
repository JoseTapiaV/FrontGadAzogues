import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { PersonasComponent } from './personas/personas.component';
import { SugerenciasComponent } from './sugerencias/sugerencias.component';
import { ReservasComponent } from './reservas/reservas.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';
import { RepuestosComponent } from './repuestos/repuestos.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VehiculosComponent,
    PersonasComponent,
    SugerenciasComponent,
    ReservasComponent,
    LoginComponent,
    MantenimientoComponent,
    RepuestosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    //{ provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
