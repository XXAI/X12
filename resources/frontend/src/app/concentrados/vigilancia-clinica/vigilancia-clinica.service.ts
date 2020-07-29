import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VigilanciaClinicaService {
  url_equipamiento = `${environment.base_url}/equipamiento`;
  url_filter_catalogs = `${environment.base_url}/catalogos-covid`;

  constructor(private http: HttpClient) { }


  getCamas(payload): Observable<any> {
    return this.http.get<any>(this.url_equipamiento, { params: payload }).pipe(
      map(response => {
        console.log("valor", response);
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

