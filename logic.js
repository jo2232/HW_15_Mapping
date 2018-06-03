// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
var plates_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

var dataSet = []
var myMap = L.map("map", {
  center: [18, 13.180],
  zoom: 2
  // layers: [streetMap, earthquakes, fault_lines]
});

let mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
let accessToken = 'pk.eyJ1IjoicmluY2tkIiwiYSI6ImNpamc3ODR1aDAxMmx0c2x0Zm9lc3E1OTAifQ.pIkP7PdJMrR5TBIp93Dlbg';
let myLayer = L.tileLayer(mapboxUrl, {id: 'mapbox.streets-basic', maxZoom: 20, accessToken: accessToken});
myLayer.addTo(myMap);

function markerSize(magnitude) {
  return magnitude *100000;
}
// Perform a GET request to the query URL


// console.log(dataSet)

// function createFeatures(earthquakeData) {
//   console.log(earthquakeData);
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  // function onEachFeature(feature, layer) {
  //   layer.bindPopup("<h3>" + feature.properties.place +
  //     "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + ". " + new Date(feature.properties.time) + "</p>")
  //   };

// var geojsonMarkerOptions = {
//   radius: markerSize(dataSet.magnitude),
//   fillColor: "#ff4958",
//   color: "#0000",
//   weight: 1,
//   opacity: .5,
//   fillOpacity: .5
// };
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature
  //   // pointToLayer: function (feature, latlng) {
  //   //   return L.circleMarker(latlng, geojsonMarkerOptions);
  //   })
  // };

  // Sending our earthquakes layer to the createMap function
  // createMap(earthquakeData);


function createMap() {
  // Define variables for our base layers
  console.log('----------------------------');
  let mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
  let accessToken = 'pk.eyJ1IjoicmluY2tkIiwiYSI6ImNpamc3ODR1aDAxMmx0c2x0Zm9lc3E1OTAifQ.pIkP7PdJMrR5TBIp93Dlbg';
  let streetMap = L.tileLayer(mapboxUrl, {id: 'mapbox.light', maxZoom: 20, accessToken: accessToken});
  let darkMap = L.tileLayer(mapboxUrl, {id: 'mapbox.dark', maxZoom: 20, accessToken: accessToken});

  

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetMap,
    "Dark Map": darkMap
  };

  var earthquakes = d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    var earthquakeData = data.features;
    var color = ""
    // var earthquakeLatLng = data.features.geometry.coordinates;
    for (var i=0; i < data.features.length; i++){
      if (earthquakeData[i].properties.mag < 4.7) {
        color = "yellow";
      } else if (4.7 < earthquakeData[i].properties.mag < 5.1 ) {
        color = "orange";
      } else {
        color = "red";
      }
      L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]] , {
        fillOpacity: 0.75,
        color: color,
        radius: markerSize(earthquakeData[i].properties.mag),
        fillcolor: color   
      }).bindPopup("<h3>" + earthquakeData[i].properties.place +
      "</h3><hr><p>" + "Magnitude: " + earthquakeData[i].properties.mag + ". " + new Date(earthquakeData[i].properties.time) + "</p>").addTo(myMap);
  
    // createMap(earthquakeData);
    }
  console.log(earthquakeData)
  });

  var fault_lines = d3.json(plates_url, function(data){
    console.log(data)
    var faultFeatures = data.features;
    var styling = {
        "fillOpacity": .5
    };

    var faults = L.geoJSON(faultFeatures, {
        style: function(feature){
            return {
              fillcolor: "green",
              fillOpacity: 0.5,
              weight: 1.5,
            };
        }
    }).addTo(myMap);
  });

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Fault_Lines: fault_lines
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
createMap()