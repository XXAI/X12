import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArchivosGruposService {
  private api: string
  private resource:string;

  constructor(private http:HttpClient ) {
    this.api = environment.base_url;
    this.resource = "archivos-grupos";
   }
  
  buscar( filter = '', sortOrder = 'asc', orderBy = '', pageNumber=0, pageSize = 3): Observable<any>{
    
    return this.http.get(`${this.api}/${this.resource}`,{
      params: new HttpParams()
        .set('filter',filter)
        .set('sortOrder',sortOrder)
        .set('orderBy',orderBy)
        .set('page', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    });
  }

  ver(id:string):Observable<any>{
    return this.http.get(`${this.api}/${this.resource}/${id}`);
  }

  crear(object: any):Observable<any>{
    return this.http.post(`${this.api}/${this.resource}`,object);
  }
  
  editar(id:string, object: any):Observable<any>{
    return this.http.put(`${this.api}/${this.resource}/${id}`,object);
  }

  borrar(id:string):Observable<any>{
    return this.http.delete(`${this.api}/${this.resource}/${id}`);
  }
  subir(formData: FormData, ):Observable<any> {
		return this.http.post(`${this.api}/${this.resource}/`, formData);
  }
/*
  grupos():Observable<any>{
    return this.http.get(`${this.api}/grupos-permisos`,{
      params: new HttpParams()
        .set('all',"1")
        .set('permisos',"1")
    });
  }*/
}
