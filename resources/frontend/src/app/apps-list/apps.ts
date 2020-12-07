export class App {
  name: string;
  route: string;
  icon: string;
  permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
  hideHome?: boolean; //Si es verdadero ocultara el elemento que dirige a raiz, en la lista que aparece en los modulos con hijos (la raiz es la ruta de la aplicación padre)
  isHub?: boolean; //Si es verdadero solo mostrara la aplicación en el HUB cuando tenga al menos un hijo activo, de lo contario se ocultara, si es falso siempre estara presente en el HUB (tomando encuenta los permisos asignados) sin importar si tiene hijos o no activos
  children?: App[]; //Lista de modulos y componentes hijos de la aplicación
}

export const APPS: App[] = [
  {
    name: "Usuarios",
    route: "usuarios",
    icon: "assets/icons/users.svg",
    permission: "nTSk4Y4SFKMyQmRD4ku0UCiNWIDe8OEt",
  },
  {
    name: "Permisos",
    route: "permisos",
    icon: "assets/icons/security-shield.svg",
    permission: "RGMUpFAiRuv7UFoJroHP6CtvmpoFlQXl",
  },
  {
    name: "Roles",
    route: "roles",
    icon: "assets/icons/users-roles.svg",
    permission: "nrPqEhq2TX0mI7qT7glaOCJ7Iqx2QtPs",
  },
  {
    name: "Formularios Llenos",
    route: "listado-llenado-formulario",
    icon: "assets/icons/catalogos.svg",
    permission: "aTRn5wKRr1iwaknd4ZtNmVRwG5dSYrRJ",
  },
  {
    name: "Call Center",
    route: "call-center",
    icon: "assets/icons/phone.svg",
    permission: "roEJ83ekTBadrqqh24zvZqe1XOFIQHJk",
  },
  {
    name: "Contingencias",
    route: "listado-contingencias",
    icon: "assets/icons/professions-and-jobs.svg",
    permission: "xxzE7Hpa6HYIRBih3tyCMKd80Z3Nk92L",
  },
  {
    name: "Contagios",
    route: "listado-indices",
    icon: "assets/icons/indice_contacto.svg",
    permission: "L66kwrzam7WU23VRh0aiV91p8ZbPoN7i",
  },
  {
    name: "Mapa",
    route: "mapa-casos-visor",
    icon: "assets/icons/mapa.png",
    permission: "kjBw52kYMsDiR0xdK1O9em7n7YPi18Ez",
  },
  {
    name: "Casos Sospechosos",
    route: "casos-sospechosos",
    icon: "assets/icons/covid-suspect.svg",
    permission: "XIPjaH3PyPRSEHNMwiZZI6GaFkzeWFV5",
  },
  {
    name: "Casos Positivos",
    route: "casos-positivos",
    icon: "assets/icons/indice_contacto.svg",
    permission: "0ZV9m4evdNTeQGfBqM4azfyRjpj5nu1t",
  },
  {
    name: "Graficas",
    route: "casos-graficas",
    icon: "assets/icons/graficas.svg",
    permission: "n7Mak8Umm4uNJbiZ87IdxSdvTaDx76j9",
  },
  {
    name: "Grupos",
    route: "grupos-estrategicos",
    icon: "assets/icons/grupos.svg",
    permission: "vU9g00gC50MOdtUR0Rx7Q0vd2VrA3sOt",
  },
  {
    name: "Archivos Grupos",
    route: "archivos-grupos",
    icon: "assets/icons/archivos-grupos.svg",
    permission: "kjBw52kYMsDiR0xdKiOWuWJg4WtJGZTv",
  },
  {
    name: "Estrategias",
    route: "estrategias",
    icon: "assets/icons/estrategias.svg",
    permission: "SIwbml7PkAOaBFcOxiOWuWJg4WtJGZTv",
  },
  {
    name: "Avances Actividades",
    route: "avances-actividades",
    icon: "assets/icons/avances-actividades.svg",
    permission: "41vhF3i5Dzfo0D62cGqxTcqe571wSxkk",
  },
  {
    name: "Red Negativa IRAG",
    route: "red-negativa-registro-diario",
    icon: "assets/icons/registro-diario.svg",
    permission: "pxP2aMnsp1Vxwf3RjZGhmPk8KrdpZglj",
  },
  {
    name: "Vigilancia Clinica",
    route: "vigilancia-clinica",
    icon: "assets/icons/vigilancia-clinica.svg",
    permission: "5LPMrjGUSaEQkkzM0w1RUUWC25z7ePvH",
  },
  {
    name: "Herramientas Dev",
    route: "dev-tools",
    icon: "assets/icons/toolbox.svg",
    isHub: true,
    hideHome: true,
    children: [
      {
        name: "Reportes MySQL",
        route: "dev-tools/mysql-reportes",
        icon: "insert_drive_file",
        permission: "6ARHQGj1N8YPkr02DY04K1Zy7HjIdDcj",
      },
      {
        name: "Variables Globales",
        route: "dev-tools/variables-globales",
        icon: "settings",
        permission: "QOiVxSyoMmmRq1OmMS8MOhsmEqi8bJEl",
      },
    ],
  },
  {
    name: "Llenar Formulario",
    route: "llenar-formulario-sistema",
    icon: "assets/icons/clipboard.svg",
    permission: "aTRn5wKRr1iwaknd4ZtNmVRwG5dSYrRJ",
  },
  {
    name: "Reportes",
    route: "concentrados",
    icon: "assets/icons/estadisticas.svg",
    isHub: true,
    hideHome: true,
    children: [
      {
        name: "Concentrado de datos",
        route: "concentrados/casos-concentrados",
        icon: "picture_as_pdf",
        permission: "Z52PdlZk2XCCbIPS28NO3M17WzZMF0lI",
      },
      {
        name: "Vigilancia Clinica",
        route: "concentrados/vigilancia-clinica",
        icon: "insert_drive_file",
        permission: "5LPMrjGUSaEQkkzM0w1RUUWC25z7ePvH",
      },
    ],
  },
  {
    name: "Rondas",
    route: "listado-rondas",
    icon: "assets/icons/brigadas.svg",
    permission: "2pL1uPR9Mzb02KV4Xa4vqVZxudWfLe35",
  },
  {
    name: "Catalogos",
    route: "catalogos",
    icon: "assets/icons/catalogos.svg",
    isHub: true,
    hideHome: true,
    children: [
      {
        name: "Responsables",
        route: "catalogos/responsables",
        icon: "adjust",
        permission: "uc5EjMH6WSVn79Wx8BJfAwddC3eMgcRI",
      },
    ],
  },
];
