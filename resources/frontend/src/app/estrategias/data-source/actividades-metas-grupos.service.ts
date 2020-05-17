import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadesMetasGruposService {
  private api: string
  private resource:string;

  constructor(private http:HttpClient ) {
    this.api = environment.base_url;
    this.resource = "actividades-metas-grupos";
   }
  
  buscar(actividad_meta_id = '', filter = '', sortOrder = 'asc', orderBy = '', pageNumber=0, pageSize = 3): Observable<any>{
    
    return this.http.get(`${this.api}/${this.resource}`,{
      params: new HttpParams()
        .set('actividad_meta_id', actividad_meta_id)  
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

  grupos():Observable<any>{
    let payload = [{nombre:'grupos'}];
    return this.http.post<any>(`${this.api}/obtener-catalogos`,payload);
  }
}