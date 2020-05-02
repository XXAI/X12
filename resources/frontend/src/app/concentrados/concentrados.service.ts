import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConcentradosService {
  url_concentrados = `${environment.base_url}/concentrado-casos-covid`;

  constructor(private http: HttpClient) { }

  getConcentrados(payload) {
    return this.http.get<any>(this.url_concentrados, {params:payload}).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}

