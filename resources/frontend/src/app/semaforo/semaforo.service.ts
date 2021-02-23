import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SemaforoService {

  url = `${environment.base_url}/semaforo`;
  url_obtener_catalogos = `${environment.base_url}/obtener-catalogos`;
  url_salida = `${environment.base_url}/pacientes-covid-salida`;
  url_estatus = `${environment.base_url}/pacientes-covid-estatus`;

  constructor(private http: HttpClient) { }

  obtenerLista(payload) {
    return this.http.get<any>(this.url, { params: payload }).pipe(
      map((response) => {
        return response;
      }
      ));
  }



  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_obtener_catalogos, payload).pipe(
      map((response) => {
        return response;
      }
      ));
  }

  obtenerCaso(id_caso): Observable<any> {
    return this.http.get<any>(this.url + "/" + id_caso, {}).pipe(
      map(response => {
        return response;
      })
    );
  }

  guardarPaciente(payload) {
    return this.http.post<any>(this.url, payload).pipe(
      map((response) => {
        return response;
      }
      ));
  }

  editarPaciente(id, payload) {
    return this.http.put<any>(this.url + "/" + id, payload).pipe(
      map((response) => {
        return response;
      }
      ));
  }

  registroSalida(id: any, tipo_movimiento: number) {
    return this.http.put<any>(this.url_salida + "/" + id, { egreso_id: tipo_movimiento }).pipe(
      map((response) => {
        return response;
      }
      ));
  }

  actualizarEstatus(id: any, estatus: number) {
    return this.http.put<any>(this.url_estatus + "/" + id, { estatus_id: estatus }).pipe(
      map((response) => {
        return response;
      }
      ));
  }
}
