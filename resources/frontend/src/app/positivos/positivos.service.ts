import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PositivosService {

  url_obtener_catalogos = `${environment.base_url}/catalogos-covid`;
  url = `${environment.base_url}/pacientes-covid`;

  constructor(private http: HttpClient) { }

  obtenerLista(payload) {
    return this.http.get<any>(this.url, {params:payload}).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  obtenerCatalogos(payload) {
    return this.http.get<any>(this.url_obtener_catalogos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  obtenerCaso(id_caso):Observable<any> {
    return this.http.get<any>(this.url + "/"+id_caso ,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  guardarCaso(payload) {
    return this.http.post<any>(this.url,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  editarCaso(id, payload) {
    return this.http.put<any>(this.url+"/"+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}
