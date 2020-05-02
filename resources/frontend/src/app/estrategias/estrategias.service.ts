import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class EstrategiasService {
  url_estrategias = `${environment.base_url}/estrategias`;

  constructor(private http: HttpClient) { }

  getListadoEstrategias(payload):Observable<any> {
    return this.http.get<any>(this.url_estrategias,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getDatosEstrategia(id):Observable<any>{
    return this.http.get<any>(this.url_estrategias+'/'+id).pipe(
      map( response=> {
        return response;
      } )
    );
  }

  guardarEstrategia(payload) {
    return this.http.post<any>(this.url_estrategias,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  actualizarEstrategia(id,payload) {
    return this.http.post<any>(this.url_estrategias+'/'+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}
