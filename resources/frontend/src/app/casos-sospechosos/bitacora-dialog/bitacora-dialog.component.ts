import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatDialog, MatDialogRef, MatPaginator, MatSort, MAT_DIALOG_DATA } from '@angular/material';
import { Bitacora, BitacoraDataSource, BitacoraService } from '@app/casos-sospechosos';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BitacoraFormDialogComponent } from '../bitacora-form-dialog/bitacora-form-dialog.component';

@Component({
  selector: 'app-bitacora-dialog',
  templateUrl: './bitacora-dialog.component.html',
  styleUrls: ['./bitacora-dialog.component.css']
})
export class BitacoraDialogComponent implements OnInit, AfterViewInit {

  private orderBy:string;
  displayedColumns: string[] = ['created_at', 'seguimiento'];

  dataSource: BitacoraDataSource;
  caso_id:Number;
  loading:boolean;

 
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<BitacoraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private apiService: BitacoraService
  ) { }
  
  ngOnInit() {
    
    if(this.data != null){
      this.caso_id = this.data;
    }
    this.dataSource = new BitacoraDataSource(this.apiService);    
    this.dataSource.loadData('', this.caso_id,'asc','',0,5); 
  }

  ngAfterViewInit(){
    this.sort.sortChange.subscribe(() => { this.orderBy = this.sort.active; this.paginator.pageIndex = 0});
    merge(this.sort.sortChange,this.paginator.page)
      .pipe(
        tap(()=> this.loadData())
      ).subscribe();
  }

  loadData(){   
    this.dataSource.loadData('',this.caso_id,this.sort.direction,this.orderBy,this.paginator.pageIndex, this.paginator.pageSize);
  }
  cerrar(): void {
    this.dialogRef.close();
  }

  openDialogForm(bitacora:Bitacora = null): void {
    const dialogRef = this.dialog.open(BitacoraFormDialogComponent, { width:"600px", disableClose: true,data:{bitacora: bitacora, caso_id:this.caso_id}});

    dialogRef.afterClosed().subscribe(result => {
      
      if(result != null){
        if(result.reload){
          this.loadData();
        }
      } 
    });
  }
}
