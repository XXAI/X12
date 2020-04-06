import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CallCenterService {
  url_llamadas = `${environment.base_url}/call-center-llamadas`;

  url_listado_contingencias = `${environment.base_url}/listado-contingencias-formularios`;
  url_obtener_catalogos = `${environment.base_url}/obtener-catalogos`;

  constructor(private http: HttpClient) { }

  getListadoLlamadas(payload):Observable<any> {
    return this.http.get<any>(this.url_llamadas,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getDatosLlamada(id):Observable<any>{
    return this.http.get<any>(this.url_llamadas+'/'+id).pipe(
      map( response=> {
        return response;
      } )
    );
  }

  guardarLlamada(payload) {
    return this.http.post<any>(this.url_llamadas,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  getListadoContingencias():Observable<any> {
    return this.http.get<any>(this.url_listado_contingencias).pipe(
      map( response => {
        return response;
      })
    );
  }

  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_obtener_catalogos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}
