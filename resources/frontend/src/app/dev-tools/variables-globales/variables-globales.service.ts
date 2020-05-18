import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VariablesGlobalesService {

  url_variables_globales = `${environment.base_url}/variables-globales`;

  constructor(private http: HttpClient) { }

  getListadoVariables(payload):Observable<any> {
    return this.http.get<any>(this.url_variables_globales,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  verVariable(id) {
    return this.http.get<any>(this.url_variables_globales+'/'+id).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  guardarVariable(payload) {
    return this.http.post<any>(this.url_variables_globales,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  modificarVariable(id,payload) {
    return this.http.put<any>(this.url_variables_globales+'/'+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  borrarVariable(id) {
    return this.http.delete<any>(this.url_variables_globales+'/'+id).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}