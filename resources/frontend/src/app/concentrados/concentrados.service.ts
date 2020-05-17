import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConcentradosService {
  url_concentrados                        = `${environment.base_url}/concentrado-casos-covid`;
  url_filter_catalogs                     = `${environment.base_url}/catalogos-covid`;

  constructor(private http: HttpClient) { }


  getConcentrados(payload):Observable<any> {
    return this.http.get<any>(this.url_concentrados,{params: payload}).pipe(
      map( response => {
        console.log("valor",response);
        return response;

      })
    );
  }

  getFilterCatalogs():Observable<any>{
    return this.http.get<any>(this.url_filter_catalogs).pipe(
      map(response => {
        console.log("valor",response);
        return response;
      })
    );
  }



}

