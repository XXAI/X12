import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {

  private api: string
  private resource:string;

  constructor(private http: HttpClient) {
    this.api = environment.base_url;
    this.resource = "bitacora-casos-sospechosos";
   }
/*
  constructor(private http:HttpClient ) {
    this.api = environment.api;
    this.resource = "usuarios";
   }*/
  
  buscar(filter = '', caso_id=null, sortOrder = 'asc', orderBy = '', pageNumber=0, pageSize = 3): Observable<any>{
    
    return this.http.get(`${this.api}/${this.resource}`,{
      params: new HttpParams()
        .set('filter',filter)
        .set('caso_id',caso_id)
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
}
