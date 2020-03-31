import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ContingenciasService {
  url_listado_contingencias = `${environment.base_url}/listado-contingencias`;
  url_listado_casos = `${environment.base_url}/listado-casos-contingencia/`;
  url_datos_caso = `${environment.base_url}/obtener-datos-caso/`;
  url_obtener_catalogos = `${environment.base_url}/obtener-catalogos`;

  constructor(private http: HttpClient) { }

  getListadoContingencias():Observable<any> {
    return this.http.get<any>(this.url_listado_contingencias).pipe(
      map( response => {
        return response;
      })
    );
  }

  getListadoCasos(id:number,payload):Observable<any> {
    return this.http.get<any>(this.url_listado_casos+id,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getCaso(id:number):Observable<any>{
    return this.http.get<any>(this.url_datos_caso+id).pipe(
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
