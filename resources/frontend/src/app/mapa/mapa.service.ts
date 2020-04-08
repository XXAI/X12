import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  url_personas_contagios = `${environment.base_url}/personas-contagios`;
  
  constructor(private http: HttpClient) { }

  getContagios():Observable<any> {
    return this.http.get<any>(this.url_personas_contagios).pipe(
      map( response => {
        return response;
      })
    );
  }
}
