import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  url_formularios = `${environment.base_url}/obtener-formularios-app`;

  constructor(private http: HttpClient) { }

  getFormularios():Observable<any> {
    return this.http.get<any>(this.url_formularios,{}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
