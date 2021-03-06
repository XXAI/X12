import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AppsListModule } from './apps-list/apps-list.module';

import { AppRoutingModule } from './app-routing.module';
import { WildcardRoutingModule } from './wildcard-routing.module';

import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { DrawerListComponent } from './navigation/drawer-list/drawer-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';

import { SharedService } from './shared/shared.service';
import { TokenInterceptor, ErrorInterceptor } from './token.service';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

import { SecurityModule } from './security/security.module';
import { ProfileModule } from './profile/profile.module';
import { DevToolsModule } from './dev-tools/dev-tools.module';
import { GoogleChartsModule } from 'angular-google-charts';

//Modulos del Sistema
import { PublicModule } from './public/public.module';
import { FormulariosModule } from './formularios/formularios.module';
import { ContingenciasModule } from './contingencias/contingencias.module';
import { BrigadasModule } from './brigadas/brigadas.module';
import { MapaModule } from './mapa/mapa.module';
import { CallCenterModule } from './call-center/call-center.module';
import { PersonaIndiceModule } from './persona-indice/persona-indice.module';
import { PositivosModule } from './positivos/positivos.module';
import { GraficasModule } from './graficas/graficas.module';
import { EstrategiasModule } from './estrategias/estrategias.module';
import { ConcentradosModule } from './concentrados/concentrados.module';
import { AvancesActividadesModule } from './avances-actividades/avances-actividades.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { GruposEstrategicosModule } from './grupos-estrategicos/grupos-estrategicos.module';
import { ArchivosGruposModule } from './archivos-grupos/archivos-grupos.module';
import { RedNegativaIragModule } from './red-negativa-irag/red-negativa-irag.module';
import { VigilanciaClinicaModule } from './vigilancia-clinica/vigilancia-clinica.module';
import { SemaforoModule } from './semaforo/semaforo.module';
import { CasosSospechososModule } from "./casos-sospechosos/casos-sospechosos.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    WelcomeComponent,
    NotFoundComponent,
    DrawerListComponent,
    ForbiddenComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
    SharedModule,
    AppsListModule,
    UsersModule,
    SecurityModule,
    DevToolsModule,
    ProfileModule,
    PublicModule,
    FormulariosModule,
    ContingenciasModule,
    BrigadasModule,
    CallCenterModule,
    AppRoutingModule,
    PersonaIndiceModule,
    MapaModule,
    PositivosModule,
    GraficasModule,
    EstrategiasModule,
    GruposEstrategicosModule,
    AvancesActividadesModule,
    GoogleChartsModule.forRoot(),
    ConcentradosModule,
    CatalogosModule,
    ArchivosGruposModule,
    RedNegativaIragModule,
    VigilanciaClinicaModule,
    SemaforoModule,
    CasosSospechososModule,
    WildcardRoutingModule,
  ],
  providers: [
    AuthService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: MAT_STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    },
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
