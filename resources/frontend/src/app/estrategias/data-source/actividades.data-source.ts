import { DataSource } from '@angular/cdk/table';
import { Actividad } from './actividad';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActividadesService } from './actividades.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';

export class ActividadesDataSource implements DataSource<Actividad> {
    
    private dataSubject = new BehaviorSubject<Actividad[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public length:number = 0;
    constructor(private apiService: ActividadesService){}

    connect(collectionViewer: CollectionViewer):Observable<Actividad[]>{
        return this.dataSubject.asObservable();
    }

    disconnect( collectionViewer: CollectionViewer){
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }

    loadData(estrategia_id = '',filter = '', sortDirection = 'asc', orderBy ='', pageIndex = 0, pageSize = 3){
       
        this.loadingSubject.next(true);
        this.apiService.buscar(estrategia_id,filter, sortDirection, orderBy, pageIndex + 1, pageSize)
        .pipe(
            catchError(()=> of ([])),
            finalize( () => this.loadingSubject.next(false) )
        ).subscribe((reponse) => { this.length = reponse.total; this.dataSubject.next(reponse.data)});
    }
}