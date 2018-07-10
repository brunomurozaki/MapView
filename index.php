<!DOCTYPE html>
<html>
    <?php

        $url = 'http://api.olhovivo.sptrans.com.br/v2.1';
        $loginURL = 'http://api.olhovivo.sptrans.com.br/v2.1/Login/Autenticar?token=351cf23405f3af731712cbace009b8966406e073098e80b107a519132a7ba50c';

        function GetParadas($input){
            $chave_api = "351cf23405f3af731712cbace009b8966406e073098e80b107a519132a7ba50c";
            $loginURL = 'http://api.olhovivo.sptrans.com.br/v2.1/Login/Autenticar?token=351cf23405f3af731712cbace009b8966406e073098e80b107a519132a7ba50c';
            $ch = curl_init(); 
            curl_setopt($ch, CURLOPT_URL, $loginURL);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_AUTOREFERER, true );
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true );
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3000);
            curl_setopt($ch, CURLOPT_COOKIEJAR, "cookie.ck");
            curl_setopt($ch, CURLOPT_COOKIEFILE, "cookie.ck");
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Length: 0'));
            
            curl_exec($ch);

            $paradasURL = "http://api.olhovivo.sptrans.com.br/v2.1/Parada/Buscar?termosBusca=*";

            //$ch = curl_init(); 
            # pega ônibus
            curl_setopt($ch, CURLOPT_URL, $paradasURL);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
            curl_setopt($ch, CURLOPT_POST, false);
            $response = curl_exec($ch);
            $response = json_decode($response, true);

            curl_close($ch);
        }

        error_reporting(E_ALL);
        ini_set('display_errors', 'On');

        if (empty($_GET)) {
            include "mapa.html";
            exit;
        }

        if($_GET["buscarPontos"] != null && $_GET["buscarPontos"] != ""){
            GetParadas($_GET["buscarPontos"] );
        }
    ?>