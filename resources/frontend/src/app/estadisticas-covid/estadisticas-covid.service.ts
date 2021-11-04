import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasCovidService {

  url = `${environment.base_url}/estadisticas-covid`;

  constructor(private http: HttpClient) { }

  


  guardarEstadisticas(payload) {
    return this.http.post<any>(this.url, payload).pipe(
      map((response) => {
        return response;
      }
      ));
  }
}
