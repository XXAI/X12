<?php

namespace App\Http\Controllers\API\Servicios;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

use App\Models\Infografia;

class InfografiaController extends Controller
{
    public function getInfografias()
    {
        try{
            $parametros = Input::all();

            $infografias = Infografia::getModel();

            if(isset($parametros['tipos_id']) && $parametros['tipos_id']){
                $infografias = $infografias->whereIn('tipo_infografia_id',$parametros['tipos_id']);
            }
            $infografias = $infografias->get();
            
            return response()->json(['data' => $infografias],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
