/*Map controls*/

markers = {};
proximity = "-46.642090, -23.505630"; //Alterar com o 
possibleAddresses = {};

posicao = [];
paradas = [];


function addMarker(center, name, type){

    var el = document.createElement("div");

    if(type == "ponto"){
        el.className = "markerLr";    
    } else if(type == "posicao") {
        el.className = "markerRx";
    } else {
        el.className = "markerAz";
    }

    var  marker  =  new  mapboxgl.Marker(el)  
                                .setLngLat(center)
                                .setPopup(new mapboxgl.Popup({ offset: 25 })) 
                                .addTo(map);  
    markers[name] = marker;
    return markers[name];
}

function getParadas(){
    limpaParadas();
    var url = "/?buscarPontos=";
    var bounds = map.getBounds();

    url += bounds._ne.lng+","+bounds._ne.lat+","+bounds._sw.lng+","+bounds._sw.lat;

    $.get( url, function( data ) {
        data = data.replace("<!DOCTYPE html>", "");
        data = data.replace("<html>", "");
        data = JSON.parse(data);    
        AddStopMarkers(data);
    });
}



function getPosicao(){
    limpaPosicao();
    var url = "/posicao.php?buscarOnibus=";

    var bounds = map.getBounds();

    url += bounds._ne.lng+","+bounds._ne.lat+","+bounds._sw.lng+","+bounds._sw.lat;

    $.get( url, function( data ) {
        data = JSON.parse(data);
        var i,j=0;
        var result = [];
        posicao = [];
        for(i = 0 ;i < data.l.length ; i++){
            var array = data.l[i].vs
            for(j = 0 ; j < array.length ; j++){
                var position = array[j]
                if(position.px <= bounds._ne.lng && position.px >= bounds._sw.lng
                    && position.py <= bounds._ne.lat && position.py >= bounds._sw.lat){
                    result.push(position);
                    var pos = addMarker([position.px, position.py], data.l[i].lt0, "posicao");
                    pos.getPopup().setHTML("<h2>" + data.l[i].c + "</h2><p>" + data.l[i].lt0 + " - " + data.l[i].lt1 + "</p>")
                    posicao.push(pos);
                }
            }
        }
        //console.log(posicao);
    });
}

function limpaParadas(){
    for(var i = 0; i < paradas.length; i++){
        paradas[i].remove();
    }

    paradas = [];
}

function limpaPosicao(){
    for(var i = 0; i < posicao.length; i++){
        posicao[i].remove();
    }

    posicao = [];
}

function AddStopMarkers(data){
    var bounds = map.getBounds();
    var stopInBounds = [];
    paradas = [];
    var parada;

    for(var i = 0; i < data.length; i++){
        parada = data[i];
        if(bounds._ne.lng > parada.px && bounds._sw.lng < parada.px && bounds._ne.lat > parada.py && bounds._sw.lat < parada.py){
            stopInBounds[stopInBounds.length] = parada;
        }
    }

    for(var i = 0; i < stopInBounds.length; i++){
        var stop = addMarker([stopInBounds[i].px, stopInBounds[i].py], stopInBounds[i].ed + stopInBounds[i].cp, "ponto");
        stop.getPopup().setHTML("<h3>" + stopInBounds[i].np + "</h3><p>" + stopInBounds[i].ed + "</p>");
        paradas[paradas.length] = stop;
    }
}

function removeMarker(name){
    markers[name].remove();
}

function removeAllMarkers(){
    var arr = Object.keys(markers);
    for(var i = 0; i < arr.length; i++){
        markers[arr[i]].remove();
    }
}

function positionMapByFeature(feature){
    map.setCenter(feature.center);
    removeAllMarkers();
    var marker = addMarker(feature.center, feature.place_name);
    marker.setHTML(feature.place_name);
}

function getAddress(address){
    var request = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + address + "?access_token=" + mapboxgl.accessToken + "&country=br&proximity=" + proximity;

    $.get( request, function( data ) {
        var features = data.features;
        
        if(features.length > 0){

            if(features[0].relevance == 1){
                if(features.length > 1){

                    var li, a, ul=$("#endSuggest");

                    if(features.length > 0){
                        $("#endSuggest").empty();
                        $("#sugestoes").val("Você quis dizer...");
                        $("#sugestoes").css("display", "block");
                    } else {
                        $("#sugestoes").css("display", "none");
                    }

                    for(var i = 0; i < features.length; i++){
                        li = $(document.createElement("li"));
                        a = $(document.createElement("a"));

                        a.html(features[i].place_name);
                        possibleAddresses[features[i].place_name] = features[i];

                        a.on("click", {name: features[i].place_name}, function(e){
                            positionMapByFeature(possibleAddresses[e.data.name]);
                        });

                        li.append(a);
                        ul.append(li);
                        $(".result").append(JSON.stringify(features[i]));
                    }
                } else {
                    positionMapByFeature(features[0]);
                }
            } else {
                var li, a, ul=$("#endSuggest");

                if(features.length > 0){
                    $("#endSuggest").empty();
                    $("#sugestoes").val("Você quis dizer...");
                    $("#sugestoes").css("display", "block");
                } else {
                    $("#sugestoes").css("display", "none");
                }

                for(var i = 0; i < features.length; i++){
                    li = $(document.createElement("li"));
                    a = $(document.createElement("a"));

                    a.html(features[i].place_name);
                    possibleAddresses[features[i].place_name] = features[i];

                    a.on("click", {name: features[i].place_name}, function(e){
                        positionMapByFeature(possibleAddresses[e.data.name]);
                    });

                    li.append(a);
                    ul.append(li);
                    $(".result").append(JSON.stringify(features[i]));
                }
            }
        }
    });

}