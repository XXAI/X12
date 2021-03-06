<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use \DB, \Response, \Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Models\VigilanciaClinica\Vigilancia;
use App\Models\VigilanciaClinica\CatalogoClinicaCovid;

use App\Helpers\HttpStatusCodes;

class VigilanciaClinicaController extends Controller
{
    public function index()
    {
        try {
            $parametros = Input::all();
            $pacientes = Vigilancia::select('vigilancia_clinica.*')
                ->with('municipio', 'estatus_paciente', 'clinica_covid', 'estatus_egreso');

            if (isset($parametros['query']) && $parametros['query']) {
                $pacientes = $pacientes->where(function ($query) use ($parametros) {
                    return $query->where('nombre_paciente', 'LIKE', '%' . $parametros['query'] . '%');
                        // ->orWhere('sexo', 'LIKE', '%' . $parametros['query'] . '%')
                        // ->orWhere('edad', 'LIKE', '%' . $parametros['query'] . '%')
                        // ->orWhere('no_caso', 'LIKE', '%' . $parametros['query'] . '%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                if(isset($parametros['no_caso']) && $parametros['no_caso']){

                    $pacientes = $pacientes->where('no_caso',$parametros['no_caso']);

                }

                if(isset($parametros['clinica']) && $parametros['clinica']){

                    $pacientes = $pacientes->where('clinica_id',$parametros['clinica']);

                }

                if(isset($parametros['municipio']) && $parametros['municipio']){

                    $pacientes = $pacientes->where('municipio_id',$parametros['municipio']);

                }

                if(isset($parametros['estatus']) && $parametros['estatus']){

                    $pacientes = $pacientes->where('estatus_paciente_id',$parametros['estatus']);

                }

                if(isset($parametros['egreso']) && $parametros['egreso']){

                    $pacientes = $pacientes->where('estatus_egreso_id',$parametros['egreso']);

                }

            }

            if (isset($parametros['page'])) {
                $resultadosPorPagina = isset($parametros["per_page"]) ? $parametros["per_page"] : 20;

                $pacientes = $pacientes->paginate($resultadosPorPagina);
            } else {
                $pacientes = $pacientes->get();
            }

            return response()->json(['data' => $pacientes], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }


        // $params = $request->input();
        // if (isset($params["all"])) {

        //     return response()->json(["data" => Vigilancia::all()]);
        // } else {
        //     if (!isset($params['pageSize'])) {
        //         $params['pageSize'] = 1;
        //     }


        //     $items = Vigilancia::select();

        //     if (isset($params['filter']) && trim($params['filter']) != "") {
        //         $items = $items->where("descripcion", "LIKE", "%" . $params['filter'] . "%");
        //     }

        //     $items = $items->paginate($params['pageSize']);

        //     return response()->json($items);
        // }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {


        $rules = [
            'nombre_paciente' => ['required'],
            'edad' => ['required'],
            'fecha_inicio' => ['required'],
            'municipio_id' => ['required'],
            'sexo' => ['required'],
            'folio_pcr' => ['required'],
            'no_caso' => ['required'],
            'estatus_paciente_id' => ['required'],
            'estatus_egreso_id' => ['required'],
            'intubado' => ['required'],
            'fecha_ingreso' => ['required'],
            'servicio_cama' => ['required'],
            'pco_fipco' => ['required'],
            'saturado_02' => ['required'],
            'ventilador' => ['required'],
            'monitor' => ['required'],
            'bomba_infusion' => ['required'],
            'no_bombas' => ['required'],

        ];
        $messages = [
            'required' => 'required',
            'numeric' => 'numeric',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return  response()->json($validator->messages(), 409);
        }

        DB::beginTransaction();
        try {
            $data = [];
            $data['clinica_id']             = $request['clinica_id'];
            $data['nombre_paciente']        = mb_strtoupper($request['nombre_paciente'], 'UTF-8');
            $data['municipio_id']           = $request['municipio_id'];
            $data['edad']                   = $request['edad'];
            $data['sexo']                   = mb_strtoupper($request['sexo'], 'UTF-8');
            $data['fecha_inicio']           = $request['fecha_inicio'];
            $data['fecha_ingreso']          = $request['fecha_ingreso'];
            $data['fecha_intubado']         = $request['fecha_intubado'];
            $data['folio_pcr']              = mb_strtoupper($request['folio_pcr'], 'UTF-8');
            $data['no_caso']                = $request['no_caso'];
            $data['diagnostico']            = mb_strtoupper($request['diagnostico'], 'UTF-8');
            $data['estatus_paciente_id']    = $request['estatus_paciente_id'];
            $data['estatus_egreso_id']      = $request['estatus_egreso_id'];
            $data['intubado']               = $request['intubado'];
            $data['servicio_cama']          = mb_strtoupper($request['servicio_cama'], 'UTF-8');
            $data['pco_fipco']              = $request['pco_fipco'];
            $data['saturado_02']            = $request['saturado_02'];
            $data['observaciones']          = mb_strtoupper($request['observaciones'], 'UTF-8');
            $data['ventilador']             = $request['ventilador'];
            $data['monitor']                = $request['monitor'];
            $data['bomba_infusion']         = $request['bomba_infusion'];
            $data['no_bombas']              = $request['no_bombas'];

            $object = Vigilancia::create($data);
            // $clinica = CatalogoClinicaCovid::find($data['clinica_id']);
            // dd($clinica);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

        return $object;
    }

    public function show($id)
    {
        try {
            $paciente = Vigilancia::with("municipio", "estatus_paciente", "clinica_covid", "estatus_egreso")->find($id);
            return response()->json(['data' => $paciente], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $auth_user = auth()->user();
            $parametros = Input::all();
            $result = [];

            //$datos = $parametros['all'];

            $object = Vigilancia::find($id);

            //$data = [];
            $object->clinica_id             = $parametros['clinica_id'];
            $object->nombre_paciente        = mb_strtoupper($parametros['nombre_paciente'], 'UTF-8');
            $object->municipio_id           = $parametros['municipio_id'];
            $object->edad                   = $parametros['edad'];
            $object->sexo                   = mb_strtoupper($parametros['sexo'], 'UTF-8');
            $object->fecha_inicio           = $parametros['fecha_inicio'];
            $object->fecha_ingreso          = $parametros['fecha_ingreso'];
            $object->fecha_intubado         = $parametros['fecha_intubado'];
            $object->folio_pcr              = mb_strtoupper($parametros['folio_pcr'], 'UTF-8');
            $object->no_caso                = $parametros['no_caso'];
            $object->diagnostico            = mb_strtoupper($parametros['diagnostico'], 'UTF-8');
            $object->estatus_paciente_id    = $parametros['estatus_paciente_id'];
            $object->estatus_egreso_id      = $parametros['estatus_egreso_id'];
            $object->intubado               = $parametros['intubado'];
            $object->servicio_cama          = mb_strtoupper($parametros['servicio_cama'], 'UTF-8');
            $object->pco_fipco              = $parametros['pco_fipco'];
            $object->saturado_02            = $parametros['saturado_02'];
            $object->observaciones          = mb_strtoupper($parametros['observaciones'], 'UTF-8');
            $object->ventilador             = $parametros['ventilador'];
            $object->monitor                = $parametros['monitor'];
            $object->bomba_infusion         = $parametros['bomba_infusion'];
            $object->no_bombas              = $parametros['no_bombas'];
            $object->save();


            DB::commit();

            return response()->json(['data' => $result], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $object = Vigilancia::find($id);
            $object->delete();

            return response()->json(['data' => 'Registro eliminado'], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getResumenCamas()
    {
        try {

            $parametros = Input::all();

            $reporte = CatalogoClinicaCovid::with('pacientes');
            
            $reporte = $reporte->select("catalogo_clinica_covid.*",
                                        DB::RAW("(select count(*) from vigilancia_clinica where clinica_id=catalogo_clinica_covid.id) as camas_ocupadas"),
                                        DB::RAW("(select if(sum(vigilancia_clinica.no_bombas) is null, 0, sum(vigilancia_clinica.no_bombas)) from vigilancia_clinica where estatus_egreso_id=1 and clinica_id=catalogo_clinica_covid.id) as bombas_ocupadas"),
                                        DB::RAW("(select if(sum(vigilancia_clinica.ventilador) is null, 0, sum(vigilancia_clinica.ventilador)) from vigilancia_clinica where estatus_egreso_id=1 and clinica_id=catalogo_clinica_covid.id) as ventiladores_ocupados"),
                                        DB::RAW("(select if(sum(vigilancia_clinica.monitor) is null, 0, sum(vigilancia_clinica.monitor)) from vigilancia_clinica where estatus_egreso_id=1 and clinica_id=catalogo_clinica_covid.id) as monitores_ocupados"),
                                        DB::RAW("(select count(*) from vigilancia_clinica where estatus_egreso_id=2 and clinica_id=catalogo_clinica_covid.id) as alta"),
                                        DB::RAW("(select count(*) from vigilancia_clinica where estatus_egreso_id=3 and clinica_id=catalogo_clinica_covid.id) as defunciones")
                                    );

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                if(isset($parametros['clinica_id']) && $parametros['clinica_id']){

                    $reporte = $reporte->where("catalogo_clinica_covid.id", "=", $parametros['clinica_id']);

                }
            
            }
                                    
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;

                $reporte = $reporte->paginate($resultadosPorPagina);
            } else {
                $reporte = $reporte->get();
            }

            // if (isset($parametros['query']) && $parametros['query']) {
            //     $reporte = $reporte->where("catalogo_clinica_covid.id", "=", $parametros['clinica_id']);
            // }
            
            return response()->json(['data' => $reporte], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getFilterCatalogsVc(){

        try{

            $clinicas_covid               = CatalogoClinicaCovid::orderBy('nombre_unidad');



            $catalogos_filtros = [

                'clinicas_covid'                     => $clinicas_covid->get(),
                
            ];

            return response()->json($catalogos_filtros, HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }
}
