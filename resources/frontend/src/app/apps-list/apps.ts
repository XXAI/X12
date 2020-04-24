export class App {
    name:string;
    route: string;
    icon: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    hideHome?:boolean; //Si es verdadero ocultara el elemento que dirige a raiz, en la lista que aparece en los modulos con hijos (la raiz es la ruta de la aplicación padre)
    isHub?:boolean; //Si es verdadero solo mostrara la aplicación en el HUB cuando tenga al menos un hijo activo, de lo contario se ocultara, si es falso siempre estara presente en el HUB (tomando encuenta los permisos asignados) sin importar si tiene hijos o no activos
    children?:App[]; //Lista de modulos y componentes hijos de la aplicación
}

export const APPS:App [] = [
    { name:"Usuarios",              route: "usuarios",                    icon: "assets/icons/users.svg",                 permission:"nTSk4Y4SFKMyQmRD4ku0UCiNWIDe8OEt" },
    { name:'Permisos',              route: "permisos",                    icon: "assets/icons/security-shield.svg",       permission:"RGMUpFAiRuv7UFoJroHP6CtvmpoFlQXl" },
    { name:'Roles',                 route: "roles",                       icon: "assets/icons/users-roles.svg",           permission:"nrPqEhq2TX0mI7qT7glaOCJ7Iqx2QtPs" },
    { name:'Formularios Llenos',    route: "listado-llenado-formulario",  icon: "assets/icons/catalogos.svg",             permission:"aTRn5wKRr1iwaknd4ZtNmVRwG5dSYrRJ" },
    { name:'Call Center',           route: "call-center",                 icon: "assets/icons/phone.svg",                 permission:"roEJ83ekTBadrqqh24zvZqe1XOFIQHJk" },
    { name:'Contingencias',         route: "listado-contingencias",       icon: "assets/icons/professions-and-jobs.svg",  permission:"xxzE7Hpa6HYIRBih3tyCMKd80Z3Nk92L" },
    { name:'Contagios',             route: "listado-indices",             icon: "assets/icons/indice_contacto.svg",       permission:"L66kwrzam7WU23VRh0aiV91p8ZbPoN7i" },
    { name:'Mapa',                  route: "mapa-visor",                  icon: "assets/icons/mapa.png"/*,        permission:"L66kwrzam7WU23VRh0aiV91p8ZbPoN7i"*/ },
    { name:'Casos Positivos',       route: "casos-positivos",             icon: "assets/icons/covid19.svg",        permission:"8PRCP4nL58TYwiEoVSY8CewwmEVNboFU" },
    { name:'Herramientas Dev',      route: "dev-tools",  icon: "assets/icons/toolbox.svg", isHub:true, hideHome:true, 
      children:[
        {name:'Reportes MySQL',     route:'dev-tools/mysql-reportes',     icon:'insert_drive_file',                       permission:"6ARHQGj1N8YPkr02DY04K1Zy7HjIdDcj"}
      ],
    },
    { name:'Llenar Formulario',     route:'llenar-formulario-sistema',            icon: 'assets/icons/clipboard.svg',     permission:"aTRn5wKRr1iwaknd4ZtNmVRwG5dSYrRJ"},
]