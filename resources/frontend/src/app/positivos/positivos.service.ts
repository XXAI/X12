import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PositivosService {

  url_obtener_catalogos = `${environment.base_url}/obtener-catalogos`;
  url = `${environment.base_url}/`;

  constructor(private http: HttpClient) { }

  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_obtener_catalogos,payload).pipe(
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
