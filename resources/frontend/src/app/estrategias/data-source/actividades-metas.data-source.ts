import { DataSource } from '@angular/cdk/table';
import { ActividadMeta } from './actividad-meta';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActividadesMetasService } from './actividades-metas.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';

export class ActividadesMetasDataSource implements DataSource<ActividadMeta> {
    
    private dataSubject = new BehaviorSubject<ActividadMeta[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public length:number = 0;
    constructor(private apiService: ActividadesMetasService){}

    connect(collectionViewer: CollectionViewer):Observable<ActividadMeta[]>{
        return this.dataSubject.asObservable();
    }

    disconnect( collectionViewer: CollectionViewer){
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }

    loadData(actividad_id = '',filter = '', sortDirection = 'asc', orderBy ='', pageIndex = 0, pageSize = 3){       
        this.loadingSubject.next(true);
        this.apiService.buscar(actividad_id,filter, sortDirection, orderBy, pageIndex + 1, pageSize)
        .pipe(
            catchError(()=> of ([])),
            finalize( () => this.loadingSubject.next(false) )
        ).subscribe((reponse) => { this.length = reponse.total; this.dataSubject.next(reponse.data)});
    }
}