import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPasswordDialogComponent } from '../confirm-password-dialog/confirm-password-dialog.component';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '../../auth/models/user';
import { AVATARS } from '../../avatars';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {

  constructor(
    private sharedService: SharedService, 
    private usersService: UsersService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  isLoading:boolean = false;
  hidePassword:boolean = true;

  authUser: User;
  
  usuario:any = {};

  usuarioForm = this.fb.group({
    'name': ['',Validators.required],
    'email': ['',[Validators.required, Validators.email]],
    'username': ['',[Validators.required, Validators.minLength(4)]],
    'password': ['',[Validators.minLength(6)]],
    'turno_id': [''],
    'is_superuser': [false],
    'avatar': [''],
    'roles': [[]],
    'permissions': [[]],
    'groups':[[]],
  });

  avatarList: any[] = [];
  catalogTurnos: any[] = [];

  //Para el filtro de Roles
  catalogRoles: any[] = [];
  listOfRoles$: Observable<any[]>;
  filterInputRoles: FormControl = new FormControl('');
  filterInputRoles$: Observable<string> = this.filterInputRoles.valueChanges.pipe(startWith(''));
  filteredRoles$: Observable<any[]>;
  selectedRolesControl:any = {};
  selectedRoles: any[] = [];
  selectedRolePermissions: any[] = [];
  assignedPermissions: any[] = [];
  deniedPermissions: any[] = [];
  selectedRoleChipId: number = 0;

  selectedAvatar:string = AVATARS[0].file;

  //Para el filtro de Permisos
  catalogPermissions: any[] = [];
  listOfPermissions$: Observable<any[]>;
  filterInputPermissions: FormControl = new FormControl('');
  filterInputPermissions$: Observable<string> = this.filterInputPermissions.valueChanges.pipe(startWith(''));
  filteredPermissions$: Observable<any[]>;
  selectedPermissions: any[] = [];

  //Para el filtro de Grupos
  catalogGroups: any[] = [];
  listOfGroups$: Observable<any[]>;
  selectedGroupsControl:any = {};
  filterInputGroups: FormControl = new FormControl('');
  filterInputGroups$: Observable<string> = this.filterInputGroups.valueChanges.pipe(startWith(''));
  filteredGroups$: Observable<any[]>;
  selectedGroups: any[] = [];


  ngOnInit() {
    this.authUser = this.authService.getUserData();

    this.avatarList = AVATARS;

    let callRolesCatalog = this.usersService.getAllRoles();
    let callPermissionsCatalog = this.usersService.getAllPermissions();
    let callTurnoCatalog = this.usersService.getTurnos();
    let callGruposCatalog = this.usersService.getGrupos();
    
    let httpCalls = [callRolesCatalog, callPermissionsCatalog, callTurnoCatalog, callGruposCatalog];

    this.route.paramMap.subscribe(params => {
      if(params.get('id')){

        let id = params.get('id');

        let callUserData = this.usersService.getUser(id);

        httpCalls.push(callUserData);
      }else{
        this.usuarioForm.get('password').setValidators([Validators.minLength(6), Validators.required]);
      }

      this.isLoading = true;

      //Calls: 0 => Roles, 1 => Permissions, 2 => User
      forkJoin(httpCalls).subscribe(
        results => {
          console.log(results);

          //Starts: Roles
          this.catalogRoles = results[0].data;
          this.listOfRoles$ = of(this.catalogRoles);
          this.filteredRoles$ = combineLatest(this.listOfRoles$,this.filterInputRoles$).pipe(
            map(
              ([roles,filterString]) => roles.filter(
                role => (role.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
              )
            )
          );
          //Ends: Roles

          //Starts: Permissions
          this.catalogPermissions = results[1].data;
          this.listOfPermissions$ = of(this.catalogPermissions);
          this.filteredPermissions$ = combineLatest(this.listOfPermissions$,this.filterInputPermissions$).pipe(
            map(
              ([permissions,filterString]) => permissions.filter(
                permission => (permission.description.toLowerCase().indexOf(filterString.toLowerCase()) !== -1) || (permission.group.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
              )
            )
          );
          //Ends: Permissions


          //Starts: Turnos
          this.catalogTurnos = results[2].data.turnos;
          //Ends: Turnos
          
          //Starts: Groups
          this.catalogGroups = results[3].data.grupos_estrategicos;
          this.listOfGroups$ = of(this.catalogGroups);
          this.filteredGroups$ = combineLatest(this.listOfGroups$,this.filterInputGroups$).pipe(
            map(
              ([groups,filterString]) => groups.filter(
                group => (group.descripcion.toLowerCase().indexOf(filterString.toLowerCase()) !== -1) || (group.folio.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
              )
            )
          );
          //Ends: Groups

          //Starts: User
          if(results[httpCalls.length-1]){
            this.usuario = results[httpCalls.length-1];
            this.usuarioForm.patchValue(this.usuario);

            this.selectedAvatar = this.usuario.avatar;
            //Load Roles
            for(let i in this.usuario.roles){
              let roleIndex = this.catalogRoles.findIndex(item => item.id == this.usuario.roles[i].id);
              this.selectRole(this.catalogRoles[roleIndex]);
            }

            this.selectedRoleChipId = 0;

            for(let i in this.usuario.grupos){
              let groupIndex = this.catalogGroups.findIndex(item => item.id == this.usuario.grupos[i].id);
              this.selectGroup(this.catalogGroups[groupIndex]);
            }

            //Load Permissions
            for(let i in this.usuario.permissions){
              let permission = this.usuario.permissions[i];
              if(this.assignedPermissions[permission.id]){
                this.assignedPermissions[permission.id].active = (permission.pivot.status == 1);
              }else{
                this.assignedPermissions[permission.id] = {
                  active: (permission.pivot.status == 1)?true:false,
                  description: permission.description,
                  inRoles:[]
                }
                this.selectedPermissions.push(permission);
              }
            }
          }
          //Ends: User

          this.isLoading = false;
        }
      );
    }); 
  }

  removeRole(index){
    let role = this.selectedRoles[index];
    this.selectedRoles.splice(index,1);
    this.selectedRolesControl[role.id] = false;

    if(role.id == this.selectedRoleChipId){
      this.selectedRoleChipId = 0;
    }

    for(let i in role.permissions){
      let permission = role.permissions[i];
      let indexOfRole = this.assignedPermissions[permission.id].inRoles.indexOf(role.id);
      this.assignedPermissions[permission.id].inRoles.splice(indexOfRole,1);

      if(this.assignedPermissions[permission.id].inRoles.length <= 0){
        delete this.assignedPermissions[permission.id];
      }
    }
    //this.usuarioForm.get('roles').patchValue(this.selectedRoles);
  }

  selectRole(role){
    //Si el Rol no esta seleccionado
    if(!this.selectedRolesControl[role.id]){

      //Lo agregamos a la lista de Roles;
      this.selectedRoles.push(role);
      this.selectedRolesControl[role.id] = true; 
      
      //Agregamos los permisos del Rol a un arreglo global de permisos
      for(let i in role.permissions){
        let permission = role.permissions[i];
        
        if(!this.assignedPermissions[permission.id]){
          this.assignedPermissions[permission.id] = {
            active: true,
            description: permission.description,
            inRoles:[role.id]
          }
        }else{
          //Si el permiso ya esta asignado es probable que este asignado desde permisos individuales
          if(this.assignedPermissions[permission.id].inRoles.length <= 0){
            let permissionIndex = this.selectedPermissions.findIndex(item => item.id == permission.id); //Si encontramos el permiso en el arreglo de permisos individuales, lo quitamos
            if(permissionIndex >= 0){
              this.selectedPermissions.splice(permissionIndex,1);
            }
          }

          this.assignedPermissions[permission.id].inRoles.push(role.id);
        }
      }

      this.showPermissionsList(role);
      //this.usuarioForm.get('roles').patchValue(this.selectedRoles);
    }else{
      //Si el rol ya esta seleccionado, lo quitamos
      let roleIndex = this.selectedRoles.findIndex(item => item.id == role.id);
      this.removeRole(roleIndex);
    }
  }

  showPermissionsList(role){ 
    this.selectedRoleChipId = role.id; 
    this.selectedRolePermissions = [];

    for(let i in role.permissions){
      let permission = role.permissions[i];
      if(this.assignedPermissions[permission.id]){
        permission.active = this.assignedPermissions[permission.id].active;
        permission.disabled = !(this.assignedPermissions[permission.id].inRoles.length > 0);
      }else{
        permission.active = false;
        permission.disabled = true;
      }
      
      this.selectedRolePermissions.push(permission);
    }
  }

  changePermissionStatus(permission){
    this.assignedPermissions[permission.id].active = !this.assignedPermissions[permission.id].active;
  }

  removePermission(index){
    let permission = this.selectedPermissions[index];
    if(this.assignedPermissions[permission.id].inRoles.length <= 0){
      if(this.assignedPermissions[permission.id].active){
        delete this.assignedPermissions[permission.id];
      }else{
        this.assignedPermissions[permission.id].active = !this.assignedPermissions[permission.id].active;
      }
    }else{
      this.assignedPermissions[permission.id].active = !this.assignedPermissions[permission.id].active;
    }

    if(!this.assignedPermissions[permission.id] || !this.assignedPermissions[permission.id].active){
      this.selectedPermissions.splice(index,1);
    }
  }

  selectPermission(permission){
    if(this.assignedPermissions[permission.id]){
      let permissionIndex = this.selectedPermissions.findIndex(item => item.id == permission.id);
      this.removePermission(permissionIndex);
    }else{
      this.selectedPermissions.push(permission);
      this.assignedPermissions[permission.id] = {
        active: true,
        description: permission.description,
        inRoles:[]
      };
    }
    //console.log(this.assignedPermissions);
  }

  selectGroup(group){
    if(this.selectedGroupsControl[group.id]){
      let groupIndex = this.selectedGroups.findIndex(item => item.id == group.id);
      this.removeGroup(groupIndex);
    }else{
      let sameFolioIndex = this.selectedGroups.findIndex(item => item.folio == group.folio);
      if(sameFolioIndex >= 0){
        this.sharedService.showSnackBar('No se pueden seleccionar dos grupos con el mismo folio', null, 3000);
        return false;
      }

      this.selectedGroups.push(group);
      this.selectedGroupsControl[group.id] = true; 
    }
    //console.log(this.assignedPermissions);
  }

  removeGroup(index){
    let group = this.selectedGroups[index];
    this.selectedGroups.splice(index,1);
    this.selectedGroupsControl[group.id] = false;
    //this.usuarioForm.get('roles').patchValue(this.selectedRoles);
  }

  accionGuardar(){
    if(this.usuarioForm.valid){
      if(this.usuarioForm.get('password').value){
        this.confirmarContrasenia();
      }else{
        this.guardarUsuario();
      }
    }
  }

  confirmarContrasenia():void {
    const dialogRef = this.dialog.open(ConfirmPasswordDialogComponent, {
      width: '500px',
      data: {password: this.usuarioForm.get('password').value}
    });

    dialogRef.afterClosed().subscribe(validPassword => {
      if(validPassword){
        this.guardarUsuario();
      }
    });
  }

  guardarUsuario(){
    this.isLoading = true;

    let roles = [];
    let permissions = {};
    let groups = [];

    for(let id in this.assignedPermissions){
      let permission = this.assignedPermissions[id];

      if(permission.inRoles.length <= 0 || (permission.inRoles.length > 0 && !permission.active)){
        permissions[id]={status:permission.active};
      }
      
      if(permission.inRoles.length > 0){
        for(let i in permission.inRoles){
          if(roles.indexOf(permission.inRoles[i]) < 0){
            roles.push(permission.inRoles[i]);
          }
        }
      }
    }

    for(let i in this.selectedGroups){
      groups.push(this.selectedGroups[i].id);
    }

    this.usuarioForm.get('permissions').patchValue(permissions);
    this.usuarioForm.get('roles').patchValue(roles);
    this.usuarioForm.get('groups').patchValue(groups);

    this.usuarioForm.get('avatar').patchValue(this.selectedAvatar);

    if(this.usuario.id){
      this.usersService.updateUser(this.usuarioForm.value,this.usuario.id).subscribe(
        response=>{
          if(response.guardado){
            this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
            
            if(this.authUser.id == response.usuario.id){
              this.authService.updateUserData(response.usuario);
            }
          }
          
          this.isLoading = false;
        }
      );
    }else{
      this.usersService.createUser(this.usuarioForm.value).subscribe(
        response =>{
          this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
          this.usuario = response.data;
          this.isLoading = false;
        }
      );
    }
  }

  clearRolesFilter(){
    this.filterInputRoles.setValue('');
  }
  clearPermissionsFilter(){
    this.filterInputPermissions.setValue('');
  }
  clearGroupsFilter(){
    this.filterInputGroups.setValue('');
  }
}