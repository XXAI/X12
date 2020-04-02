import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  url_formularios = `${environment.base_url}/obtener-formulario-app`;
  
  constructor(private http: HttpClient) { }

  getFormulario(id):Observable<any> {
    return this.http.get<any>(this.url_formularios+'/'+id).pipe(
      map( response => {
        return response;
      })
    );
  }
}
