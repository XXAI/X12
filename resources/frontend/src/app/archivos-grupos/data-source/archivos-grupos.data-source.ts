import { DataSource } from '@angular/cdk/table';
import { ArchivoGrupo } from './archivo-grupo';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ArchivosGruposService } from './archivos-grupos.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';

export class ArchivosGruposDataSource implements DataSource<ArchivoGrupo> {
    
    private dataSubject = new BehaviorSubject<ArchivoGrupo[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public length:number = 0;
    constructor(private apiService: ArchivosGruposService){}

    connect(collectionViewer: CollectionViewer):Observable<ArchivoGrupo[]>{
        return this.dataSubject.asObservable();
    }

    disconnect( collectionViewer: CollectionViewer){
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }

    loadData(filter = '', sortDirection = 'asc', orderBy ='', pageIndex = 0, pageSize = 3){       
        this.loadingSubject.next(true);
        this.apiService.buscar(filter, sortDirection, orderBy, pageIndex + 1, pageSize)
        .pipe(
            catchError(()=> of ([])),
            finalize( () => this.loadingSubject.next(false) )
        ).subscribe((reponse) => { this.length = reponse.total; this.dataSubject.next(reponse.data)});
    }
}