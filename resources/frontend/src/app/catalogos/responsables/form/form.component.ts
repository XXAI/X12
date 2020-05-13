import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ResponsablesService } from '../responsables.service';
import { CustomValidator } from '../../../utils/classes/custom-validator';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'form-responsable',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(
    private responsableService: ResponsablesService,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  isLoading:boolean = false;
  responsable:any = {};

  provideID:boolean = false;
  
  responsableForm = this.fb.group({
    'descripcion': ['',[Validators.required]],
    'folio': ['',[Validators.required]],
  });

  ngOnInit() {
    let id = this.data.id;
    if(id){
      this.isLoading = true;
      this.responsableService.getResponsable(id).subscribe(
        response => {
          this.responsable = response.responsable;
          this.responsableForm.patchValue(this.responsable);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });
    }
  }

  saveResponsable(){
    this.isLoading = true;
    if(this.responsable.id){
      this.responsableService.updateResponsable(this.responsable.id,this.responsableForm.value).subscribe(
        response =>{
          this.dialogRef.close(true);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
      });
    }else{
      this.responsableService.createResponsable(this.responsableForm.value).subscribe(
        response =>{
          this.dialogRef.close(true);
          console.log(response);
          this.isLoading = false;
      },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}

