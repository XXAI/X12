<?php

namespace App\Http\Controllers\API;

use App\Models\CasosCovid\EstatusCovid;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Input;
use DB;

class EstatusCovidController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $estatus_covid = EstatusCovid::all();
    
            return response()->json(['estatus_covid' => $estatus_covid], 200);

        } catch (\Exception $e) {
            return response()->json(['error' =>$e, 404]);
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
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\CasosCovid\EstatusCovid  $estatusCovid
     * @return \Illuminate\Http\Response
     */
    public function show(EstatusCovid $estatusCovid)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CasosCovid\EstatusCovid  $estatusCovid
     * @return \Illuminate\Http\Response
     */
    public function edit(EstatusCovid $estatusCovid)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CasosCovid\EstatusCovid  $estatusCovid
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, EstatusCovid $estatusCovid)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CasosCovid\EstatusCovid  $estatusCovid
     * @return \Illuminate\Http\Response
     */
    public function destroy(EstatusCovid $estatusCovid)
    {
        //
    }
}
