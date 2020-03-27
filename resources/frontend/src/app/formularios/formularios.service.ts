import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {
  url_llenado_formularios = `${environment.base_url}/llenado-formularios`;

  constructor(private http: HttpClient) { }

  getLlenadoFormularios(payload):Observable<any> {
    return this.http.get<any>(this.url_llenado_formularios,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  verDetalleLlenadoFormulario(id):Observable<any>{
    return this.http.get<any>(this.url_llenado_formularios+'/'+id).pipe(
      map( response => {
        return response;
      })
    );
  }
}