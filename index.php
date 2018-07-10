<!DOCTYPE html>
<html>
    
    <?php
        error_reporting(E_ALL);
        ini_set('display_errors', 'On');

        $chave_api = "351cf23405f3af731712cbace009b8966406e073098e80b107a519132a7ba50c";

        $cookie = '/tmp/cookie.txt';
        $url = 'http://api.olhovivo.sptrans.com.br/v2.1';
        $loginURL = 'http://api.olhovivo.sptrans.com.br/v2.1/Login/Autenticar?token=351cf23405f3af731712cbace009b8966406e073098e80b107a519132a7ba50c';
        $positionURL = 'http://api.olhovivo.sptrans.com.br/v2.1/Linha/Buscar?termosBusca=Pinheiros';

        //echo $url . '/Login/Autenticar?token=' . $chave_api;

        // Login. Executar uma vez so.
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
    
        //echo "<hr>";

        $response = curl_exec($ch);

        # pega �nibus
        curl_setopt($ch, CURLOPT_URL, $positionURL);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
        curl_setopt($ch, CURLOPT_POST, false);
        $response = curl_exec($ch);

        curl_close($ch);

    ?>

    <head>
        <meta charset="utf-8"/>
        <title>Soluções Web 2018 - MapView</title>
        <script	src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.46.0/mapbox-gl.js'></script>
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.46.0/mapbox-gl.css' rel='stylesheet'/>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="mapControls.js"></script>

        <style>
        
            body{
                font-family: Tahoma;
                background-image: url(./bgWallpaper.jpg);
                background-repeat: repeat;
                background-size: 40%;
            }
            
            #header{
                width: 716px;
                height: 100px;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: 15px;
                padding: 10px 15px;
            }
            
            #wrapper{
                width: 750px;
                height: 100%; 
                padding: 0px;
                margin-top: 15px;
                margin-left: auto;
                margin-right: auto;
                background-color: white;
                border-radius: 25px;
                border-width: 2px;
                border-style: solid;
                border-color: black;
            }
            
            #map{
                width: 700px;
                height: 450px;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: 25px;
            }
            
            .divEsq{
                position: relative;
                float: left;
            }
            
            .divDir{
                position: relative;
                float: right;
            }
            
            .divLarg65{
                position: relative;
                width: 65%;
            }
            
            .divLarg35{
                position: relative;
                width: 35%;
            }
            
            .divMrgLeft15{
                margin-left: 15px;
            }
            
            #idMembros{
                
            }
            
            #controles{
                margin-right: 25px;
            }
            
            #idMembros h1{
                font-size: 14px;
            }
            
            #idMembros p{
                margin-left: 15px;
                margin-top: 10px;
                margin-bottom: 10px;
                font-size: 12px;
                
            }
            
            #campoBusca{
                width: 330px;
            }
            
            #controles p{
                margin-left: 15px;
                margin-top: 10px;
                margin-bottom: 10px;
                font-size: 12px;
            }
            
            #controles h1{
                font-size: 14px;
            }
            
        </style>
        
    </head>
    
    <body>
        
        <div id="wrapper">
            
            <div id="header">
                <div class="divEsq divLarg65">
                    <div id="controles">
                        <h1>Buscar Endereço:</h1>
                        <div class="divEsq divMrgLeft15">
                            <input list="endSuggest" id="campoBusca" type="search" name="campoBusca"
                               placeholder="Digite aqui o endereço..."
                               aria-label="Buscar Endereço."/>
                            <datalist id="endSuggest">
                            </datalist>
                        </div>
                        <div class="divEsq" style="margin-left: 15px;">
                            <button id="botaoBusca">Buscar!</button>
                        </div>
                        
                        <br/>
                        
                        <div class="divMrgLeft15">
                            <p>
                                <input id="onibusMov" type="checkbox" name="onibusMov" value="onibusMov"/> Ônibus em movimento
                            </p>
                            <p>
                                <input id="paradaOnibus" type="checkbox" name="paradaOnibus" value="paradaOnibus"/> Parada de ônibus
                            </p>
                        </div>
                    </div>
                </div>
                <div class="divDir divLarg35">
                    <div id="idMembros">
                        <h1>Integrantes do Grupo:</h1>
                        <p>Abel Rocha Espinosa - 9277513</p>
                        <p>Bruno Impossinato Murozaki - 8516476</p>
                        <p>Gabriel Henrique da Silva Pinto - 8516010</p>
                    </div>
                </div>
            </div>
            
            <div id='map'></div>
            
        </div>
        
        <script>
            
            /*document.getElementById("campoBusca").disabled = false;
            document.getElementById("botaoBusca").disabled = false;
            document.getElementById("onibusMov").disabled = false;
            document.getElementById("paradaOnibus").disabled = false;*/
            
            if (navigator.geolocation) {
                console.log('Geolocalização suportada!!! :)');
            }
            else {
                console.log('Geolocalização não suportada. Aplicação não funcionará como devido.');
                /*document.getElementById("campoBusca").disabled = true;
                document.getElementById("botaoBusca").disabled = true;
                document.getElementById("onibusMov").disabled = true;
                document.getElementById("paradaOnibus").disabled = false;*/
            }
            
            
            navigator.geolocation.getCurrentPosition(render, showError);
            
            render({coords: {latitude:-23.505630, longitude:-46.642090}}); //retirar esta linha
            
            function render(pos) {
                var lat = pos.coords.latitude;
                var lon = pos.coords.longitude;
                var z = 14;
                
                console.log('lat = '+ lat);
                console.log('lon = '+ lon);
                
                mapboxgl.accessToken = 'pk.eyJ1IjoiYWJlbHJvZXMiLCJhIjoiY2pqZXA2N2luMDR4MzNwcXN6NjAzZWJwYiJ9.QNVjpd5OKTqsx76RLwpMjA';	
                map	= new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v10',
                    center:	[lon, lat],
                    zoom: z
                 });	

                map.addControl(new mapboxgl.NavigationControl());
                addMarker([lon, lat], "initial")
            };
            
            function showError(error) {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        console.log("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        console.log("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.log("An unknown error occurred.");
                        break;
                }
                /*document.getElementById("campoBusca").disabled = true;
                document.getElementById("botaoBusca").disabled = true;
                document.getElementById("onibusMov").disabled = true;
                document.getElementById("paradaOnibus").disabled = true;*/
            }
            
            $("#botaoBusca").on("click", function(e){
                var add = $("#campoBusca").val() + ".json";
                getParadas();
                getAddress(add);
            });
        </script>
    </body>
</html>