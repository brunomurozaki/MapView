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
        console.log(data);
    });
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

        if(features[0].relevance == 1){
            positionMapByFeature(features[0]);
        } else {
            var li, a, ul=$("#endSuggest");
            
            //var dataList = $(document.getElementById('endSuggest'));
            //var option;
            
            for(var i = 0; i < features.length; i++){
                li = $(document.createElement("li"));
                a = $(document.createElement("a"));
                
                a.html(features[i].place_name);
                possibleAddresses[features[i].place_name] = features[i];
                
                /*
                option = $(document.createElement('option'));
                option.val(features[i].place_name);
                */
                
                a.on("click", {name: features[i].place_name}, function(e){
                    positionMapByFeature(possibleAddresses[e.data.name]);
                });
                
                //dataList.append(option);

                li.append(a);
                ul.append(li);
                $(".result").append(JSON.stringify(features[i]));
            }
        }
    });

}