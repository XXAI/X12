import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {
  url_graficas = `${environment.base_url}/graficas-covid`;

  constructor(private http: HttpClient) { }

  getGraficas():Observable<any> {
    return this.http.get<any>(this.url_graficas).pipe(
      map( response => {
        return response;
      })
    );
  }
}
