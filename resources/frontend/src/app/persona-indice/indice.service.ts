import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IndiceService {

  //url_obtener_catalogos = `${environment.base_url}/obtener-catalogos`;
  url_obtener_catalogos = `${environment.base_url}/catalogos-covid`;
  url_obtener_localidad = `${environment.base_url}/obtener-localidad`;
  url_persona_indice = `${environment.base_url}/persona-indice`;
  url_persona_contacto = `${environment.base_url}/indice-contacto`;

  constructor(private http: HttpClient) { }

  
  getListadoContactos(payload):Observable<any> {
    return this.http.get<any>(this.url_persona_contacto , {params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getListadoIndices(payload):Observable<any> {
    return this.http.get<any>(this.url_persona_indice, {params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  obtenerCatalogos(payload) {
    return this.http.get<any>(this.url_obtener_catalogos,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
  obtenerLocalidad(payload) {
    return this.http.get<any>(this.url_obtener_localidad , {params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  guardarContacto(payload) {
    return this.http.post<any>(this.url_persona_contacto,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
  
  guardarIndice(payload) {
    return this.http.post<any>(this.url_persona_indice,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  editarIndice(id, payload) {
    return this.http.put<any>(this.url_persona_indice+"/"+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
  
  editarContacto(id, payload) {
    return this.http.put<any>(this.url_persona_contacto+"/"+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}
