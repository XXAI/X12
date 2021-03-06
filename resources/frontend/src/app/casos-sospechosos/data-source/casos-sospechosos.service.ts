import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CasosSospechososService {

  private api: string
  private resource:string;

  constructor(private http: HttpClient) {
    this.api = environment.base_url;
    this.resource = "casos-sospechosos";
   }
/*
  constructor(private http:HttpClient ) {
    this.api = environment.api;
    this.resource = "usuarios";
   }*/
  
  buscar(filter = '', sortOrder = 'asc', orderBy = '', pageNumber=0, pageSize = 3): Observable<any>{
    
    return this.http.get(`${this.api}/${this.resource}`,{
      params: new HttpParams()
        .set('filter',filter)
        .set('sortOrder',sortOrder)
        .set('orderBy',orderBy)
        .set('page', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    });
  }

  ver(id:Number):Observable<any>{
    return this.http.get(`${this.api}/${this.resource}/${id}`);
  }

  crear(object: any):Observable<any>{
    return this.http.post(`${this.api}/${this.resource}`,object);
  }
  
  editar(id:Number, object: any):Observable<any>{
    return this.http.put(`${this.api}/${this.resource}/${id}`,object);
  }

  borrar(id:Number):Observable<any>{
    return this.http.delete(`${this.api}/${this.resource}/${id}`);
  }

  municipios():Observable<any>{
    return this.http.get(`${this.api}/${this.resource}-municipios`,{
      /*
      params: new HttpParams()
        .set('all',"1")*/
    });
  }

  localidades(municipio_id:any):Observable<any>{
    return this.http.get(`${this.api}/${this.resource}-localidades`,{
      
      params: new HttpParams()
        .set('municipio_id',municipio_id)
    });
  }
  colonias(municipio_id:any):Observable<any>{
    return this.http.get(`${this.api}/${this.resource}-colonias`,{
      
      params: new HttpParams()
        .set('municipio_id',municipio_id)
    });
  }  
}
