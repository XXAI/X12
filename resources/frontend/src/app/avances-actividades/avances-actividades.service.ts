import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AvancesActividadesService {
  url_avances = `${environment.base_url}/avances-actividades`;
  url_listado_avances = `${environment.base_url}/listado-avances`;

  constructor(private http: HttpClient) { }

  getListadoActividades(payload):Observable<any> {
    return this.http.get<any>(this.url_avances,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getListadoAvancesGrupo(payload):Observable<any> {
    return this.http.get<any>(this.url_listado_avances,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
