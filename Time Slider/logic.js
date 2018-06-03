// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

var dataSet = []
var myMap = L.map("map", {
  center: [18, 13.180],
  zoom: 5
});
let mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
let accessToken = 'pk.eyJ1IjoicmluY2tkIiwiYSI6ImNpamc3ODR1aDAxMmx0c2x0Zm9lc3E1OTAifQ.pIkP7PdJMrR5TBIp93Dlbg';
let myLayer = L.tileLayer(mapboxUrl, {id: 'mapbox.streets-basic', maxZoom: 20, accessToken: accessToken});
myLayer.addTo(myMap);
function markerSize(magnitude) {
  return magnitude *100000;
}
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  var earthquakeData = data.features;
  var color = ""
  // var earthquakeLatLng = data.features.geometry.coordinates;
  for (var i=0; i < data.features.length; i++){
    // dataSet["coordinates"] = earthquakeData[i].geometry.coordinates,
    // dataSet["magnitude"] = earthquakeData[i].properties.mag,
    if (earthquakeData[i].properties.mag < 4.7) {
      color = "yellow";
    } else if (4.7 < earthquakeData[i].properties.mag < 5.1 ) {
      color = "orange";
    } else {
      color = "red";
    }
    L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]] , {
      fillOpacity: 0.75,
      color: "white",
      radius: markerSize(earthquakeData[i].properties.mag),
      fillcolor: color   
    }).bindPopup("<h3>" + earthquakeData[i].properties.place +
    "</h3><hr><p>" + "Magnitude: " + earthquakeData[i].properties.mag + ". " + new Date(earthquakeData[i].properties.time) + "</p>").addTo(myMap);

  // createMap(earthquakeData);
  }
console.log(earthquakeData)
});

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


function createMap(earthquakes) {

  // Define variables for our base layers
  let mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
  let accessToken = 'pk.eyJ1IjoicmluY2tkIiwiYSI6ImNpamc3ODR1aDAxMmx0c2x0Zm9lc3E1OTAifQ.pIkP7PdJMrR5TBIp93Dlbg';
  let streetMap = L.tileLayer(mapboxUrl, {id: 'mapbox.light', maxZoom: 20, accessToken: accessToken});
  let darkMap = L.tileLayer(mapboxUrl, {id: 'mapbox.dark', maxZoom: 20, accessToken: accessToken});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetMap,
    "Dark Map": darkMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      18, 13.180
    ],
    zoom: 2.5,
    layers: [streetMap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
