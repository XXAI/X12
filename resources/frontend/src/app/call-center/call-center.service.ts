import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CallCenterService {
  url_llamadas = `${environment.base_url}/call-center-llamadas`;

  constructor(private http: HttpClient) { }

  getListadoLlamadas(payload):Observable<any> {
    return this.http.get<any>(this.url_llamadas,{params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
