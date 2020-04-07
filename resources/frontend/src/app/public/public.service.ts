import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  url_formularios = `${environment.base_url}/obtener-formulario-app`;
  url_guardado_formularios = `${environment.base_url}/guardar-llenado-formularios-app`;
  url_guardado_contacto = `${environment.base_url}/guardar-contacto-indice`;
  url_editar_contacto = `${environment.base_url}/editar-contacto-indice`;
  url_guardado_indice = `${environment.base_url}/guardar-indice`;
  url_editar_indice = `${environment.base_url}/editar-indice`;
  url_obtener_catalogos = `${environment.base_url}/obtener-catalogos`;

  constructor(private http: HttpClient) { }

  getFormulario(id):Observable<any> {
    return this.http.get<any>(this.url_formularios+'/'+id).pipe(
      map( response => {
        return response;
      })
    );
  }

  guardarFormularios(payload) {
    return this.http.post<any>(this.url_guardado_formularios,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_obtener_catalogos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}
