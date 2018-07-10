/*Map controls*/

markers = {};
proximity = "-46.642090, -23.505630"; //Alterar com o 
possibleAddresses = {};


function addMarker(center, name){
    var  marker  =  new  mapboxgl.Marker()  
                                .setLngLat(center)  
                                .addTo(map);  
    markers[name] = marker;
}

function getParadas(){
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

function AddStopMarkers(data){
    var bounds = map.getBounds();
    var stopsInBound = [];
    var parada;

    for(var i = 0; i < data.length; i++){
        parada = data[i];
        if(bounds._ne.lng > parada.px && bounds._sw.lng < parada.px && bounds._ne.lat > parada.py && bounds._sw.lat < parada.py){
            stopsInBound[stopsInBound.length] = parada;
        }
    }

    for(var i = 0; i < stopsInBound.lenght; i++){
        addMarker([stopsInBound[i].px, stopsInBound[i].py], stopsInBound[i].ed + stopsInBound[i].cp);
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
    addMarker(feature.center, feature.place_name);
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