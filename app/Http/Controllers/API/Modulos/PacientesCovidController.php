<?php

namespace App\Http\Controllers\API\Modulos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Input;
use \Validator, \Hash, \Response, \DB;

use App\Models\CasosCovid\PacientesCovid;

use App\Models\CasosCovid\Derechohabiencias;
use App\Models\CasosCovid\Distrito;
use App\Models\CasosCovid\EstatusCovid;
use App\Models\CasosCovid\TipoAtencion;
use App\Models\CasosCovid\TiposTransmisiones;
use App\Models\CasosCovid\TipoUnidad;
use App\Models\CasosCovid\EgresosCovid;
use App\Models\Municipio;
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
                $parametros = Input::all();

                $pacientes = PacientesCovid::select('pacientes_covid.*')
                ->with('municipio', 'tipo_atencion', 'tipo_unidad', 'estatus_covid', 'derechohabiencia', 'tipo_transmision');

                if(isset($parametros['query']) && $parametros['query']){
                    $pacientes = $pacientes->where(function($query)use($parametros){
                        return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('sexo','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('edad','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('no_caso','LIKE','%'.$parametros['query'].'%')
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
            'responsable'        => 'required',
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
            $object->responsable        = $inputs['responsable'];
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
            $pacientes_covid = PacientesCovid::with("municipio")->find($id);
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
        'responsable'        => 'required',
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
            $object->responsable        = $inputs['responsable'];
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
        try{

            $municipios                 = Municipio::orderBy('descripcion');
            $derechohabiencias          = Derechohabiencias::orderBy("descripcion");
            $distrito                   = Distrito::orderBy("descripcion");
            $estatusCovid               = EstatusCovid::orderBy("descripcion");
            $tipo_atencion              = TipoAtencion::orderBy("descripcion");
            $tipos_transmisiones        = TiposTransmisiones::orderBy("descripcion");
            $tipo_unidad                = TipoUnidad::orderBy("descripcion");
            $egresos                    = EgresosCovid::orderBy("descripcion");


            $catalogo_covid = [
                'municipios'                             => $municipios->get(),
                'derechohabiencias'                      => $derechohabiencias->get(),
                //'distrito'                               => $distrito           ->get(),
                'estatusCovid'                           => $estatusCovid       ->get(),
                'tipo_atencion'                          => $tipo_atencion      ->get(),
                'tipos_transmisiones'                    => $tipos_transmisiones->get(),
                'tipo_unidad        '                    => $tipo_unidad        ->get(),
                'egresos            '                    => $egresos            ->get(),

            ];

            return response()->json(['data'=>$catalogo_covid], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function actualizarEstatus(Request $request, $id)
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
}
