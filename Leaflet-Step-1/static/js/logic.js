// Use this link to get the geojson data.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  
//  Grab the data with d3
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
    function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
        function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.title +
        "</h3><hr><p>" + feature.properties.mag + "</p>");
        }
        var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
        var geojsonMarkerOptions = {
            radius: 5*feature.properties.mag,
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        };
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
});
createMap(earthquakes);


    // Adding Legend
    
};
function chooseColor(earthquakeDepth) {

    if (earthquakeDepth < 10) {
        return "#99ff00";
    }
    else if (earthquakeDepth < 30 ) {
        return "#c1d50b";
    }
    else if (earthquakeDepth < 50 ) {
        return "#f0c800";
    }
    else if (earthquakeDepth < 70 ) {
        return "#f0a800";
    }
    else if (earthquakeDepth < 90 ) {
        return "#dd8513";
    }
    else  {
        return "#f26464";
    }
}
function createMap(earthquakes){
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);   
  var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10,10,30,50,70,90],
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };

    legend.addTo(myMap);

};      


  
