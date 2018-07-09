/*Map controls*/

markers = {};


function addMarker(center, name){
    var  marker  =  new  mapboxgl.Marker()  
                                .setLngLat(center)  
                                .addTo(map);  
    markers[name] = marker;
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