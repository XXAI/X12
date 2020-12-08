import { AbstractControl } from '@angular/forms';

export class CustomValidator {

    static notEqualToValidator(formControlName:string){
        return (control: AbstractControl): { [key:string]:any } | null =>{
            if(control.value != null){
                return control.value == control.parent.get(formControlName).value ? { notEqualTo:true } : null; 
            }
        };
    }

    static dateBefore(validDate:Date){
        return (control: AbstractControl): { [key:string]:any } | null =>{
            if(control.value != null){
                let fechaControl = new Date(control.value);
                if(fechaControl){
                    return fechaControl > validDate ?  { dateBefore:true } : null; 
                }
            }
        };
    }
}
