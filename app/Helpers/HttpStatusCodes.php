<?php

namespace App\Helpers;


class HttpStatusCodes
{
    public static function parse($code){
        switch ($code) {
            case 100: 
            case 101: 
            case 200: 
            case 201: 
            case 202:
            case 203: 
            case 204: 
            case 205: 
            case 206: 
            case 300: 
            case 301: 
            case 302: 
            case 303: 
            case 304: 
            case 305: 
            case 400: 
            case 401: 
            case 402: 
            case 403: 
            case 404: 
            case 405: 
            case 406: 
            case 407: 
            case 408: 
            case 409: 
            case 410: 
            case 411: 
            case 412: 
            case 413: 
            case 414: 
            case 415: 
            case 500: 
            case 501: 
            case 502: 
            case 503: 
            case 504: 
            case 505: return $code; break;
            default: return 500;
        }
    }
}