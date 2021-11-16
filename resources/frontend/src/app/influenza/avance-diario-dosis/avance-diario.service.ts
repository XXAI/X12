import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AvanceDiarioService {
  url_dosis_diarias = `${environment.base_url}/influenza-dosis-diarias`;
  url_init_data = `${environment.base_url}/influenza-dosis-diarias-init`;
  url_metas_dosis = `${environment.base_url}/influenza-config-metas-dosis`;

  constructor(private http: HttpClient) { }

  getInitData():Observable<any> {
    return this.http.get<any>(this.url_init_data).pipe(
      map( response => {
        return response;
      })
    );
  }

  guardarMetas(payload) {
    return this.http.post<any>(this.url_metas_dosis,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  getListadoAvancesDiarios(payload:any={}):Observable<any> {
    return this.http.get<any>(this.url_dosis_diarias,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  nuevoAvanceDiario(payload:any):Observable<any>{
    return this.http.post<any>(this.url_dosis_diarias,payload).pipe(
      map( response => {
        return response;
      })
    );
  }

  verAvanceDiario(id:number):Observable<any> {
    return this.http.get<any>(this.url_dosis_diarias+'/'+id).pipe(
      map( response => {
        return response;
      })
    );
  }

  eliminarAvanceDiario(id:number):Observable<any>{
    return this.http.delete<any>(this.url_dosis_diarias+'/'+id).pipe(
      map( response => {
        return response;
      })
    );
  }
}