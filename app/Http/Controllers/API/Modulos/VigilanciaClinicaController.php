<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use \DB, \Response, \Exception; 

use App\Http\Controllers\Controller;
use App\Models\VigilanciaClinica\Vigilancia;

use App\Helpers\HttpStatusCodes;

class VigilanciaClinicaController extends Controller
{
    public function index()
    {
        $params = $request->input();
        if(isset($params["all"])){
            
            return response()->json(["data"=>Vigilancia::all()]);
        } else {
            if(!isset($params['pageSize'])){
                $params['pageSize'] = 1;
            }
            
            
            $items = Vigilancia::select();
            
            if(isset($params['filter']) && trim($params['filter'])!= ""){
                $items = $items->where("descripcion","LIKE", "%".$params['filter']."%");
            }
            
            $items = $items->paginate($params['pageSize']);
            
            return response()->json($items);
        }
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
            'fecha_inicio' => ['required'],
            'municipio_id' => ['required'],
            'sexo' => ['required'],
            'folio_pcr' => ['required'],
            'no_caso' => ['required'],
            'estatus_paciente_id' => ['required'],
            'estatus_egreso_id' => ['required'],
            'intubado' => ['required'],
            'fecha_inicio' => ['required'],
            'servicio_cama' => ['required'],
            'pco_fipco' => ['required'],
            'saturado_02' => ['required'],
            'ventilador' => ['required'],
            'monitor' => ['required'],
            'bomba_infusion' => ['required'],
            'edad' => ['required']
        ];
        $messages = [
            'required' => 'required',
            'numeric' => 'numeric',
        ];
        $validator = Validator::make($request->all(), $rules,$messages);

        if ($validator->fails()) {
            return  response()->json($validator->messages(), 409);
        }

        DB::beginTransaction();
        try {
            $data = [];
            $data['nombre_paciente'] = $request['nombre_paciente'];
            $data['municipio_id'] = $request['municipio_id'];
            $data['edad'] = $request['edad'];
            $data['sexo'] = $request['sexo'];
            $data['fecha_inicio'] = $request['fecha_inicio'];
            $data['fecha_ingreso'] = $request['fecha_ingreso'];
            $data['fecha_intubado'] = $request['fecha_intubado'];
            $data['folio_pcr'] = $request['folio_pcr'];
            $data['no_caso'] = $request['no_caso'];
            $data['diagnostico'] = $request['diagnostico'];
            $data['estatus_paciente_id'] = $request['estatus_paciente_id'];
            $data['estatus_egreso_id'] = $request['estatus_egreso_id'];
            $data['intubado'] = $request['intubado'];
            $data['servicio_cama'] = $request['servicio_cama'];
            $data['pco_fipco'] = $request['pco_fipco'];
            $data['saturado_02'] = $request['saturado_02'];
            $data['observaciones'] = $request['observaciones'];
            $data['ventilador'] = $request['ventilador'];
            $data['monitor'] = $request['monitor'];
            $data['bomba_infusion'] = $request['bomba_infusion'];
            
            $object = Vigilancia::create($data);
            DB::commit();
        }catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
        
        return $object;
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
        try{
            DB::beginTransaction();

            $auth_user = auth()->user();
            $parametros = Input::all();
            $result = [];
            
            $datos = $parametros['all'];

            $object = Vigilancia::find($id);

            $data = [];
            $object->nombre_paciente= $request['nombre_paciente'];
            $object->municipio_id= $request['municipio_id'];
            $object->edad= $request['edad'];
            $object->sexo= $request['sexo'];
            $object->fecha_inicio= $request['fecha_inicio'];
            $object->fecha_ingreso= $request['fecha_ingreso'];
            $object->fecha_intubado= $request['fecha_intubado'];
            $object->folio_pcr= $request['folio_pcr'];
            $object->no_caso= $request['no_caso'];
            $object->diagnostico= $request['diagnostico'];
            $object->estatus_paciente_id= $request['estatus_paciente_id'];
            $object->estatus_egreso_id= $request['estatus_egreso_id'];
            $object->intubado= $request['intubado'];
            $object->servicio_cama= $request['servicio_cama'];
            $object->pco_fipco= $request['pco_fipco'];
            $object->saturado_02= $request['saturado_02'];
            $object->observaciones= $request['observaciones'];
            $object->ventilador= $request['ventilador'];
            $object->monitor= $request['monitor'];
            $object->bomba_infusion= $request['bomba_infusion'];
            $persona->save();
            

            DB::commit();

            return response()->json(['data'=>$result],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
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
            $object = Vigilancia::find($id);
            $object->delete();

            return response()->json(['data'=>'Registro eliminado'], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
