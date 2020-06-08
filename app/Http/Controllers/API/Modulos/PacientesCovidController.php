<?php

namespace App\Http\Controllers\API\Modulos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Input;
use \Validator, \Hash, \Response, \DB;

use App\Models\CasosCovid\PacientesCovid;

use App\Models\CasosCovid\Derechohabiencias;
use App\Models\CasosCovid\Responsable;
use App\Models\CasosCovid\EstatusCovid;
use App\Models\CasosCovid\TipoAtencion;
use App\Models\CasosCovid\TiposTransmisiones;
use App\Models\CasosCovid\TipoUnidad;
use App\Models\CasosCovid\EgresosCovid;
use App\Models\Municipio;
use App\Models\PersonaIndice;
use App\Models\PersonaContacto;
use App\Models\Localidad;
use Carbon\Carbon;



class PacientesCovidController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {

        try{
            $loggedUser = auth()->userOrFail();

             //permiso para ver todos los pacientes fa7QWns1FDzcIZjC44OAsHtswKYhOsPN
            $permiso = DB::table('permissions')
            ->leftJoin('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
            ->where('permission_user.user_id', '=', $loggedUser->id)
            ->where('permission_user.permission_id', '=', 'fa7QWns1FDzcIZjC44OAsHtswKYhOsPN')
            ->first();

            $parametros = Input::all();

            if($permiso || $loggedUser->is_superuser=='1' )
            {

                $pacientes = PacientesCovid::select('pacientes_covid.*')
                ->with('municipio', 'tipo_atencion', 'tipo_unidad', 'estatus_covid', 'derechohabiencia', 'tipo_transmision', 'egreso_covid', 'responsable')
                ->orderBy("egreso_id", "asc", "no_caso", "asc");
            }
            else
            {

                $grupo = DB::table('grupos_estrategicos_usuarios')
                ->leftJoin('users', 'id', '=', 'grupos_estrategicos_usuarios.user_id')
                ->where('grupos_estrategicos_usuarios.user_id', '=', $loggedUser->id)
                ->first();

                if($grupo)
                {
                    $pacientes = PacientesCovid::select('pacientes_covid.*')
                    ->with('municipio', 'tipo_atencion', 'tipo_unidad', 'estatus_covid', 'derechohabiencia', 'tipo_transmision', 'egreso_covid', 'responsable.grupo')
                    ->join('catalogo_responsables as R', 'R.id', '=', 'pacientes_covid.responsable_id')
                    ->join('grupos_estrategicos as GE', 'GE.folio', '=', 'R.folio')
                    ->where('GE.id','=',$grupo->grupo_estrategico_id)
                    ->orderBy("egreso_id", "asc", "no_caso", "asc");

                }
                else{

                    $pacientes = PacientesCovid::select('pacientes_covid.*')
                    ->with('municipio', 'tipo_atencion', 'tipo_unidad', 'estatus_covid', 'derechohabiencia', 'tipo_transmision', 'egreso_covid', 'responsable')
                    ->join('catalogo_responsables as R', 'R.id', '=', 'pacientes_covid.responsable_id')
                    ->join('grupos_estrategicos as GE', 'GE.folio', '=', 'R.folio')

                    ->orderBy("egreso_id", "asc", "no_caso", "asc");

                }



                /* $pacientes = PacientesCovid::select('pacientes_covid.*')
                ->with('municipio', 'tipo_atencion', 'tipo_unidad', 'estatus_covid', 'derechohabiencia', 'tipo_transmision', 'egreso_covid', 'responsable.grupo')
                 ->join('catalogo_responsables as R', 'R.id', '=', 'pacientes_covid.responsable_id')
                ->join('grupos_estrategicos as GE', 'GE.folio', '=', 'R.folio')
                ->orderBy("egreso_id", "asc", "no_caso", "asc") ; */

                //return response()->json(['data'=>$pacientes],HttpResponse::HTTP_OK);

            }

                if(isset($parametros['query']) && $parametros['query']){
                    $pacientes = $pacientes->where(function($query)use($parametros){
                        return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('sexo','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('edad','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('no_caso','LIKE','%'.$parametros['query'].'%')
                                    // ->orWhere('responsable_id','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('municipio_id','LIKE','%'.$parametros['query'].'%');
                    });
                }
                if(isset($parametros['page'])){
                    $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;

                    $pacientes = $pacientes->paginate($resultadosPorPagina);
                } else {
                    $pacientes = $pacientes->get();
                }

            return response()->json(['data'=>$pacientes],HttpResponse::HTTP_OK);

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }


    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function store(Request $request)
    {

        $mensajes = [
            'required'           => "required",
        ];

        $reglas = [
            'no_caso'            => 'required',
            'nombre'             => 'required',
            'sexo'               => 'required',
            'edad'               => 'required',
            'municipio_id'       => 'required',
            'responsable_id'     => 'required',
            //'fecha_captura'      => 'required',
            'tipo_atencion_id'   => 'required',
            'tipo_unidad_id'     => 'required',
            'estatus_covid_id'   => 'required',
            'derechohabiente_id' => 'required',
            //'distrito_id'        => 'required',
            'contactos'          => 'required',
            'tipo_transmision_id'=> 'required',
            'fecha_inicio_sintoma'=> 'required',
            'fecha_confirmacion'  => 'required',
            //'dias_evolucion'       => 'required',
        ];

        $object = new PacientesCovid();

        $inputs = Input::all();
        $inputs = $inputs['persona'];

        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {


            $object->no_caso        = $inputs['no_caso'];
            $object->nombre         = $inputs['nombre'];
            $object->alias         = $inputs['alias'];
            $object->sexo           = $inputs['sexo'];
            $object->edad           = $inputs['edad'];
            $object->municipio_id   = $inputs['municipio_id'];
            $object->responsable_id        = $inputs['responsable_id'];
            //$object->fecha_captura        = $inputs['fecha_captura'];
            $object->tipo_atencion_id        = $inputs['tipo_atencion_id'];
            $object->tipo_unidad_id        = $inputs['tipo_unidad_id'];
            $object->estatus_covid_id        = $inputs['estatus_covid_id'];
            $object->derechohabiente_id        = $inputs['derechohabiente_id'];
            //$object->distrito_id        = $inputs['distrito_id'];
            $object->contactos        = $inputs['contactos'];
            $object->tipo_transmision_id        = $inputs['tipo_transmision_id'];
            $object->fecha_inicio_sintoma        = $inputs['fecha_inicio_sintoma'];
            $object->fecha_confirmacion        = $inputs['fecha_confirmacion'];
            $fecha = new Carbon($inputs['fecha_confirmacion']);
            $fecha->addDays(14);
            $object->fecha_alta_14        = $fecha->format('Y-m-d');
            $fecha->addDays(7);
            $object->fecha_alta_21        = $fecha->format('Y-m-d');
            //$object->dias_evolucion        = $inputs['dias_evolucion'];
            $object->fecha_alta_probable        = $inputs['fecha_alta_probable'];
            //$object->egreso_id                  = $inputs['egreso_id'];


            $object->save();

            DB::commit();

            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\CasosCovid\PacientesCovid  $pacientesCovid
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try{
            $pacientes_covid = PacientesCovid::with("municipio", "responsable")->find($id);
            return response()->json(['data'=>$pacientes_covid],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CasosCovid\PacientesCovid  $pacientesCovid
     * @return \Illuminate\Http\Response
     */
    public function edit(PacientesCovid $pacientesCovid)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {


    $mensajes = [
        'required'           => "required",
    ];

    $reglas = [
        'no_caso'            => 'required',
        'nombre'             => 'required',
        'sexo'               => 'required',
        'edad'               => 'required',
        'municipio_id'       => 'required',
        'responsable_id'     => 'required',
        //'fecha_captura'      => 'required',
        'tipo_atencion_id'   => 'required',
        'tipo_unidad_id'     => 'required',
        'estatus_covid_id'   => 'required',
        'derechohabiente_id' => 'required',
        //'distrito_id'        => 'required',
        'contactos'          => 'required',
        'tipo_transmision_id'=> 'required',
        'fecha_inicio_sintoma'=> 'required',
        'fecha_confirmacion'  => 'required',
        //'dias_evolucion'       => 'required',
    ];

        $object = PacientesCovid::find($id);

        if(!$object){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        $inputs = Input::all();
        $inputs = $inputs['persona'];
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {


            $object->no_caso        = $inputs['no_caso'];
            $object->nombre         = $inputs['nombre'];
            $object->alias         = $inputs['alias'];
            $object->sexo           = $inputs['sexo'];
            $object->edad           = $inputs['edad'];
            $object->municipio_id   = $inputs['municipio_id'];
            $object->responsable_id        = $inputs['responsable_id'];
            //$object->fecha_captura        = $inputs['fecha_captura'];
            $object->tipo_atencion_id        = $inputs['tipo_atencion_id'];
            $object->tipo_unidad_id        = $inputs['tipo_unidad_id'];
            $object->estatus_covid_id        = $inputs['estatus_covid_id'];
            $object->derechohabiente_id        = $inputs['derechohabiente_id'];
            //$object->distrito_id        = $inputs['distrito_id'];
            $object->contactos        = $inputs['contactos'];
            $object->tipo_transmision_id        = $inputs['tipo_transmision_id'];
            $object->fecha_inicio_sintoma        = $inputs['fecha_inicio_sintoma'];
            $object->fecha_confirmacion        = $inputs['fecha_confirmacion'];
            $fecha = new Carbon($inputs['fecha_confirmacion']);
            $fecha->addDays(14);
            $object->fecha_alta_14        = $fecha->format('Y-m-d');
            $fecha->addDays(7);
            $object->fecha_alta_21        = $fecha->format('Y-m-d');
            //$object->dias_evolucion        = $inputs['dias_evolucion'];
            $object->fecha_alta_probable        = $inputs['fecha_alta_probable'];
            //$object->egreso_id                  = $inputs['egreso_id'];

            $object->save();

            DB::commit();

            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $pacientes_covid = PacientesCovid::find($id);
            $pacientes_covid->delete();

            return response()->json(['data'=>'PacienteCovid eliminado'], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }


    public function getCatalogos(){
        //$parametros = Input::all();
        //return response()->json(['data'=>$parametros], HttpResponse::HTTP_OK);
        try{

            $municipios                 = Municipio::orderBy('descripcion');
            //$localidades                 = Localidad::getModel();
            $derechohabiencias          = Derechohabiencias::orderBy("descripcion");
            $responsables               = Responsable::orderBy("descripcion");
            $estatusCovid               = EstatusCovid::orderBy("descripcion");
            $tipo_atencion              = TipoAtencion::orderBy("descripcion");
            $tipos_transmisiones        = TiposTransmisiones::orderBy("descripcion");
            $tipo_unidad                = TipoUnidad::orderBy("descripcion");
            $egresos                    = EgresosCovid::orderBy("descripcion");
            $maxNoCaso                  = PacientesCovid::select(DB::RAW("max(no_caso) as no_caso"))->first();


            $catalogo_covid = [
                'municipios'                             => $municipios         ->get(),
                //'localidades'                             => $localidades        ->get(),
                'derechohabiencias'                      => $derechohabiencias  ->get(),
                'responsables'                           => $responsables       ->get(),
                'estatusCovid'                           => $estatusCovid       ->get(),
                'tipo_atencion'                          => $tipo_atencion      ->get(),
                'tipos_transmisiones'                    => $tipos_transmisiones->get(),
                'tipo_unidad'                            => $tipo_unidad        ->get(),
                'egresos'                                => $egresos            ->get(),
                'caso'                                   => $maxNoCaso

            ];

            return response()->json(['data'=>$catalogo_covid], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function actualizarEgreso(Request $request, $id)
    {

        $object = PacientesCovid::find($id);

        $inputs = Input::all();

        DB::beginTransaction();
        try {

            $object->egreso_id                  = $inputs['egreso_id'];
            $object->save();

            DB::commit();

            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function actualizarEgresoIndice(Request $request, $id)
    {

        $object = PersonaIndice::find($id);

        $inputs = Input::all();

        DB::beginTransaction();
        try {

            $object->egreso_id                  = $inputs['egreso_id'];
            $object->save();

            DB::commit();

            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function actualizarEstatus(Request $request, $id)
    {

        $object = PacientesCovid::find($id);

        $inputs = Input::all();

        DB::beginTransaction();
        try {

            $object->estatus_covid_id                  = $inputs['estatus_id'];
            $object->save();

            DB::commit();

            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function actualizarEstatusIndice(Request $request, $id)
    {

        $object = PersonaIndice::find($id);

        $inputs = Input::all();

        DB::beginTransaction();
        try {

            $object->estatus_covid_id                  = $inputs['estatus_id'];
            $object->save();

            DB::commit();

            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getGraficas(){

        $filtros = Input::all();

        try{

            $distritos = PacientesCovid::select('pacientes_covid.municipio_id', DB::raw('count(pacientes_covid.municipio_id) as total'))->with('municipio.distrito')
            // ->join('pacientes_covid as P', 'P.municipio_id', '=', 'catalogo_municipios.id')
            // ->where('municipio_id', '!=', null)
            ->groupBy('pacientes_covid.municipio_id')->get();

            $sexo = PacientesCovid::select('pacientes_covid.sexo', DB::raw('count(pacientes_covid.sexo) as total'))
            ->groupBy('pacientes_covid.sexo')->get();


            $derechohabiencia = PacientesCovid::select('pacientes_covid.derechohabiente_id', DB::raw('count(pacientes_covid.derechohabiente_id) as total'))->with('derechohabiencia')
            ->groupBy('pacientes_covid.derechohabiente_id')->get();

            $tipo_atencion = PacientesCovid::select('pacientes_covid.tipo_atencion_id', DB::raw('count(pacientes_covid.tipo_atencion_id) as total'))->with('tipo_atencion')
            ->groupBy('pacientes_covid.tipo_atencion_id')->get();

            $estatus = PacientesCovid::select('pacientes_covid.estatus_covid_id', DB::raw('count(pacientes_covid.estatus_covid_id) as total'))->with('estatus_covid')
            ->groupBy('pacientes_covid.estatus_covid_id')->get();

            $casos = PacientesCovid::count();

            $hospitalizados = PacientesCovid::select('no_caso', 'tipo_unidad_id', 'estatus_covid_id')->with('tipo_unidad', 'estatus_covid')
            ->orderBy('pacientes_covid.no_caso')->get();

            $ambulatorios = PacientesCovid::select('no_caso', 'fecha_alta_probable', 'tipo_atencion_id')->with('tipo_atencion')
            // ->join('pacientes_covid as P', 'P.tipo_atencion_id', '=', 'catalogo_tipos_atenciones.id')
            ->where('egreso_id', '!=', null)
            ->where('tipo_atencion_id', '=', 3)
            ->orderBy('pacientes_covid.no_caso')->get();

            $graficas_covid = [

                'pacientes_distritos'                 => $distritos,
                'pacientes_sexo'                      => $sexo,
                'pacientes_derechohabiencia'          => $derechohabiencia,
                'pacientes_tipo_atencion'             => $tipo_atencion,
                'pacientes_estatus'                   => $estatus,
                'total_casos'                         => $casos,
                'hospitalizados'                      => $hospitalizados,
                'ambulatorios'                        => $ambulatorios

            ];



            return response()->json(['data'=>$graficas_covid], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }


    public function getConcentradoCasos(){
        try{

            $parametros = Input::all();
            $loggedUser = auth()->userOrFail();

            $permiso = DB::table('permissions')
                ->leftJoin('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
                ->where('permission_user.user_id', '=', $loggedUser->id)
                ->where('permission_user.permission_id', '=', 'fa7QWns1FDzcIZjC44OAsHtswKYhOsPN')
                ->first();

            if($permiso || $loggedUser->is_superuser=='1' )
            {
                $casos = PersonaIndice::select('persona_indice.*')
                    ->with('tipo_atencion', 'tipo_unidad', 'responsable.grupo', 'municipio.distrito', 'estatus_covid','contactos')
                    ->leftjoin('catalogo_responsables as R', 'R.id', '=', 'persona_indice.responsable_id')
                    ->leftjoin('grupos_estrategicos as GE', 'GE.folio', '=', 'R.folio')
                    ->orderBy('R.folio', 'asc','persona_indice.responsable_id', 'asc','persona_indice.no_caso','asc') ;
            }
            else
            {
                $grupo = DB::table('grupos_estrategicos_usuarios')
                ->leftJoin('users', 'id', '=', 'grupos_estrategicos_usuarios.user_id')
                ->where('grupos_estrategicos_usuarios.user_id', '=', $loggedUser->id)
                ->first();
                if($grupo)
                {

                   /*  $casos = PacientesCovid::select('pacientes_covid.*')
                    ->with('tipo_atencion', 'tipo_unidad', 'responsable.grupo', 'municipio.distrito', 'estatus_covid')
                    ->join('catalogo_responsables as R', 'R.id', '=', 'pacientes_covid.responsable_id')
                    ->join('grupos_estrategicos as GE', 'GE.folio', '=', 'R.folio')
                    ->where('GE.id','=',$grupo->grupo_estrategico_id)
                    ->orderBy('pacientes_covid.responsable_id', 'asc') ; */

                    $casos = PersonaIndice::select('persona_indice.*')
                    ->with('tipo_atencion', 'tipo_unidad', 'responsable.grupo', 'municipio.distrito', 'estatus_covid','contactos')
                    ->leftjoin('catalogo_responsables as R', 'R.id', '=', 'persona_indice.responsable_id')
                    ->leftjoin('grupos_estrategicos as GE', 'GE.folio', '=', 'R.folio')
                    ->where('GE.id','=',$grupo->grupo_estrategico_id)
                    ->orderBy('persona_indice.responsable_id', 'asc','persona_indice.no_caso', 'asc') ;

                }
                else{

                    $casos = PersonaIndice::select('persona_indice.*')
                    ->with('tipo_atencion', 'tipo_unidad', 'responsable.grupo', 'municipio.distrito', 'estatus_covid','contactos')
                    ->join('catalogo_responsables as R', 'R.id', '=', 'persona_indice.responsable_id')
                    ->join('grupos_estrategicos as GE', 'GE.folio', '=', 'R.folio')
                    ->orderBy('R.folio', 'asc','persona_indice.responsable_id', 'asc') ;


                }


            }

            if(isset($parametros['query']) && $parametros['query']){
                $casos = $casos->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('sexo','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('edad','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('no_caso','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){


                if(isset($parametros['no_caso']) && $parametros['no_caso']){

                    $casos = $casos->where('no_caso', '=', $parametros['no_caso']);

                }

                if(isset($parametros['municipios']) && $parametros['municipios']){

                    $casos = $casos->where('municipio_id',$parametros['municipios']);
                }

                if(isset($parametros['responsables']) && $parametros['responsables']){

                    $casos = $casos->where('responsable_id',$parametros['responsables']);
                }

                if(isset($parametros['tipo_atencion']) && $parametros['tipo_atencion']){

                    $casos = $casos->where('tipo_atencion_id',$parametros['tipo_atencion']);
                }

                if(isset($parametros['tipo_unidades']) && $parametros['tipo_unidades']){

                    $casos = $casos->where('tipo_unidad_id',$parametros['tipo_unidades']);
                }

                if(isset($parametros['estatus_covid']) && $parametros['estatus_covid']){

                    $casos = $casos->where('estatus_covid_id',$parametros['estatus_covid']);
                }


            }


            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;

                $casos = $casos->paginate($resultadosPorPagina);
            } else {
                $casos = $casos->get();
            }

            foreach ($casos as $key => $value) {
                $fecha_actual = Carbon::today();
                if($casos[$key]->fecha_inicio_sintoma != null)
                {
                    $array_fecha = explode("-", $casos[$key]->fecha_inicio_sintoma);
                    $fecha_inicio_sintomas = Carbon::now();
                    $fecha_inicio_sintomas->year = $array_fecha[0];
                    $fecha_inicio_sintomas->month = $array_fecha[1];
                    $fecha_inicio_sintomas->day = $array_fecha[2];
                    $casos[$key]->dias_evolucion = $fecha_actual->diffInDays($fecha_inicio_sintomas);
                }else{
                    $casos[$key]->dias_evolucion = "-";
                }

                if($casos[$key]->fecha_ingreso_hospital != null)
                {
                    $array_fecha = explode("-", $casos[$key]->fecha_ingreso_hospital);
                    $fecha_ingreso_hospital = Carbon::now();
                    $fecha_ingreso_hospital->year = $array_fecha[0];
                    $fecha_ingreso_hospital->month = $array_fecha[1];
                    $fecha_ingreso_hospital->day = $array_fecha[2];
                    $casos[$key]->dias_hospitalizacion = $fecha_actual->diffInDays($fecha_ingreso_hospital);
                }else{
                    $casos[$key]->dias_hospitalizacion = "-";
                }
                
                
            }
            
            return response()->json(['data'=>$casos],HttpResponse::HTTP_OK);

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }















        // $filtros = Input::all();

        // try{

        //     $casos = PacientesCovid::select('no_caso', 'sexo', 'edad', 'municipio_id', 'responsable_id', 'fecha_alta_probable', 'estatus_covid_id', 'tipo_atencion_id', 'tipo_unidad_id')
        //     ->with('tipo_atencion', 'tipo_unidad', 'responsable.grupo', 'municipio.distrito', 'estatus_covid')
        //     ->orderBy('pacientes_covid.no_caso')->get();

        //     $concentrado = [
        //         'casos'                => $casos
        //     ];



        //     return response()->json(['data'=>$concentrado], HttpResponse::HTTP_OK);
        // }catch(\Exception $e){
        //     return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        // }
    }
}
