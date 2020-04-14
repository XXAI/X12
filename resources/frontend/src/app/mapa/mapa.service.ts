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
  url_municipios = `${environment.base_url}/ubicacion-municipios`;
  //informacion_covid = `${environment.base_url}/informacion-covid`;
  informacion_casos = `${environment.base_url}/casos-dias`;
  url_informacion = 'http://contingencia.saludchiapas.gob.mx/manualapi/municipios.php';
  informacion_covid = 'http://contingencia.saludchiapas.gob.mx/manualapi/estadisticas.php';
  
  constructor(private http: HttpClient) { }

  getContagios():Observable<any> {
    return this.http.get<any>(this.url_personas_contagios).pipe(
      map( response => {
        return response;
      })
    );
  }

  getInformacion():Observable<any> {
    return this.http.get<any>(this.url_informacion).pipe(
      map( response => {
        return response;
      })
    );
  }

  getInformacionCovid():Observable<any> {
    return this.http.get<any>(this.informacion_covid).pipe(
      map( response => {
        return response;
      })
    );
  }
  
  getCasosDias():Observable<any> {
    return this.http.get<any>(this.informacion_casos).pipe(
      map( response => {
        return response;
      })
    );
  }

  getUbicacion():Observable<any> {
    return this.http.get<any>(this.url_municipios,{}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
