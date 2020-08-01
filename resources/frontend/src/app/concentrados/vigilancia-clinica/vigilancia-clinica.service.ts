import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VigilanciaClinicaService {
  url_resumen         = `${environment.base_url}/resumen_camas`;
  url_filter_catalogs = `${environment.base_url}/catalogos-resumen-clinicas`;

  constructor(private http: HttpClient) { }


  getResumen(payload): Observable<any> {
    return this.http.get<any>(this.url_resumen, { params: payload }).pipe(
      map(response => {
        return response;

      })
    );
  }


  getFilterCatalogs(): Observable<any> {
    return this.http.get<any>(this.url_filter_catalogs).pipe(
      map(response => {
        console.log("valor", response);
        return response;
      })
    );
  }



}

