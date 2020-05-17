import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  url_grupos = `${environment.base_url}/grupos-estrategicos`;
  url_buscar_usuarios = `${environment.base_url}/grupos-buscar-usuarios`;
  url_grupo_usuarios = `${environment.base_url}/grupo-usuarios/`;
  url_sincronizar_usuarios = `${environment.base_url}/sincronizar-grupo-usuarios/`;

  constructor(private http: HttpClient) { }

  buscarUsuarios(payload):Observable<any> {
    return this.http.get<any>(this.url_buscar_usuarios,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  verUsuariosDeGrupo(id):Observable<any> {
    return this.http.get<any>(this.url_grupo_usuarios+id).pipe(
      map( response => {
        return response;
      })
    );
  }

  sincronizarGrupoUsuarios(id,payload) {
    return this.http.put<any>(this.url_sincronizar_usuarios+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  getListadoGrupos(payload):Observable<any> {
    return this.http.get<any>(this.url_grupos,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  verGrupo(id) {
    return this.http.get<any>(this.url_grupos+'/'+id).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  guardarGrupo(payload) {
    return this.http.post<any>(this.url_grupos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  modificarGrupo(id,payload) {
    return this.http.put<any>(this.url_grupos+'/'+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  borrarGrupo(id) {
    return this.http.delete<any>(this.url_grupos+'/'+id).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}
