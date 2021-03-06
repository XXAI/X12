import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BrigadasService {
  url_brigadas = `${environment.base_url}/brigadas`;
  url_rondas = `${environment.base_url}/rondas`;
  url_municipios = `${environment.base_url}/brigada-municipios`;
  url_brigadistas = `${environment.base_url}/rondas-brigadistas`;
  url_fin_rondas =  `${environment.base_url}/finalizar-ronda`;
  url_catalogos = `${environment.base_url}/obtener-catalogos`;
  url_colonias = `${environment.base_url}/colonias`;
  url_rondas_registros = `${environment.base_url}/rondas-registros`;
  url_exportar_rondas = `${environment.base_url}/exportar-rondas`;
  url_exportar_concentrado = `${environment.base_url}/exportar-concentrado`;

  constructor(private http: HttpClient) { }

  getListadoBrigadas(payload):Observable<any> {
    return this.http.get<any>(this.url_rondas,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getListadoMunicipios(id):Observable<any> {
    return this.http.get<any>(this.url_municipios+'/'+id).pipe(
      map( response => {
        return response;
      })
    );
  }

  guardarRonda(payload) {
    return this.http.post<any>(this.url_rondas,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  finalizarRonda(id,payload) {
    return this.http.put<any>(this.url_fin_rondas+'/'+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  getDatosBrigadas(id) {
    return this.http.get<any>(this.url_brigadas+'/'+id).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  configurarBrigadas(id,payload) {
    return this.http.put<any>(this.url_brigadas+'/'+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  verRonda(id:number):Observable<any>{
    return this.http.get<any>(this.url_rondas+'/'+id).pipe(
      map( response => {
        return response;
      })
    );
  }

  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_catalogos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  getListadoColonias(payload){
    return this.http.get<any>(this.url_colonias,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  guardarRegistro(payload) {
    return this.http.post<any>(this.url_rondas_registros,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  eliminarRegistro(id:number):Observable<any>{
    return this.http.delete<any>(this.url_rondas_registros+'/'+id).pipe(
      map( response => {
        return response;
      })
    );
  }

  exportarReporteConcentrado(payload={}):Observable<any>{
    return this.http.get<any>(this.url_exportar_concentrado, {params:payload, responseType: 'blob' as 'json'});
  }

  exportarReporteRondas(payload={}):Observable<any>{
    return this.http.get<any>(this.url_exportar_rondas, {params:payload, responseType: 'blob' as 'json'});
  }
}
