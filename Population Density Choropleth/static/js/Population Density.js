// var layers = {
//   FIRE_STATION: new L.LayerGroup(),
//   FIRE_HYDRANT: new L.LayerGroup()
// };


// Creating the map object
var myMap = L.map("map", {
  center: [43.6532, -79.3832],
  zoom: 11
  // layers: [
  //   layers.FIRE_STATION,
  //   layers.FIRE_HYDRANT
  // ]
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Load the GeoJSON data.
// var fireData = "http://127.0.0.1:5000/fire_incidents";

var wardData = "http://127.0.0.1:5000/toronto_wards";

//Read the GeoJSON data. and console log the first element of each array to verify the data is being read correctly
// d3.json(fireData).then(function(incidents_data) {
//   console.log(incidents_data.features[0]);
// });

d3.json(wardData).then(function(wards_data) {
  console.log(wards_data.features[0]);
 
});


//starting with creating a list of all fire incidents in the city and their associated dollar loss
d3.json(wardData).then(function (wards_data) {


    //populate wards_info with the NAME of each feature in wards_data.features and the population density of each feature
    var wards_info = [];
    for (var i = 0; i < wards_data.features.length; i++) {
      wards_info.push({ward: wards_data.features[i].properties.NAME,density:wards_data.features[i].properties.Pop_Density})
      var polygon = [];
      for (var j = 0; j < wards_data.features[i].geometry.coordinates[0].length; j++) {
        polygon.push(L.latLng(wards_data.features[i].geometry.coordinates[0][j][1], wards_data.features[i].geometry.coordinates[0][j][0]));
        
      }

          }
          console.log(wards_info);
        

    
var colors = chroma.scale(['#ffe0b2', '#ff5722']).colors(15);
// Create a choropleth map with the wardsLayer and color scale
var choropleth = L.choropleth(wards_data, {
  valueProperty: function(feature) {
    var ward = feature.properties.NAME;
    var wardInfo = wards_info.find(function(info) {
      return info.ward === ward;
      
    });
  
    // Return the dollar loss information for the ward
    return wardInfo ? wardInfo.density : null;
  },
  scale: colors,
  steps: 15,
  mode: 'q',
  style: {
    color: '#fff',
    weight: 2,
    fillOpacity: 0.7
  },

  onEachFeature: function(feature, layer) {
    var ward = feature.properties.NAME;
    var wardInfo = wards_info.find(function(info) {
      return info.ward === ward;
    });
  
    if (wardInfo) {
      var popupContent = document.createElement('div');
  

      // // Create the chart data and layout
      // var data = [{
      //   values: [wardInfo.density],
      //   labels: [ward + " (" + Pop_Density + "%)"],
      //   type: 'pie'
      // }];
      // var layout = {
      //   title: 'Density by Ward'
      // };
  
      // Create the chart and append it to the popup content
      // Plotly.newPlot(popupContent, data, layout, {responsive: true});
  // Append the dollar loss information to the popup content
      var density_info = document.createElement('p');
      density_info.innerText = ward + ": "+ wardInfo.density.toLocaleString() ;
      //make the text bold
      density_info.style.fontWeight = "bold";
      popupContent.appendChild(density_info);
      // Bind the popup to the layer
      layer.bindPopup(popupContent);
    }
    
  }
 



}).addTo(myMap);

// Create a legend for the choropleth map
var legend = L.control({position: 'bottomright'});



legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'info legend'),
      limits = choropleth.options.limits,
      colors = choropleth.options.colors,
      labels = [];

      var legendInfo = "<h1>Density by Ward<br />(persons/ha)</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + 18 + "</div>" +
        "<div class=\"max\">" + 127 + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);






  });


  
// var markersScript=document.createElement('script');
// markersScript.setAttribute('src','Markers/static/js/markers.js');
// document.head.appendChild(markersScript);