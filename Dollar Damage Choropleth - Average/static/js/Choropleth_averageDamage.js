var layers = {
  FIRE_STATION: new L.LayerGroup(),
  FIRE_HYDRANT: new L.LayerGroup()
};


// Creating the map object
var myMap = L.map("map", {
  center: [43.6532, -79.3832],
  zoom: 11,
  layers: [
    layers.FIRE_STATION,
    layers.FIRE_HYDRANT
  ]
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Load the GeoJSON data.
var fireData = "http://127.0.0.1:5000/fire_incidents";

var wardData = "http://127.0.0.1:5000/toronto_wards";

//Read the GeoJSON data. and console log the first element of each array to verify the data is being read correctly
d3.json(fireData).then(function(incidents_data) {
  console.log(incidents_data.features[0]);
});

d3.json(wardData).then(function(ward_data) {
  console.log(ward_data.features[0]);
 
});


//starting with creating a list of all fire incidents in the city and their associated dollar loss
d3.json(wardData).then(function (ward_data) {
  d3.json(fireData).then(function (incidents_data) {

    //all_info will be a combination of lists fireIncidentData and boroughs_info
    var fireIncidentData = [];
    for (var i = 0; i < incidents_data.features.length; i++) {
      //if the dollar loss, latitude, and longitude are not null, add the data to fireIncidentData
        if (incidents_data.features[i].properties.Estimated_Dollar_Loss != null
        && incidents_data.features[i].geometry.coordinates[0] != null
        && incidents_data.features[i].geometry.coordinates[1] != null) {

        //create a list of lists that contains the coordinates of the fire incident and the dollar loss
        //inverting the coordinates to match the format of the neighbourhood data
        var longitude= incidents_data.features[i].geometry.coordinates[1];
        var latitude = incidents_data.features[i].geometry.coordinates[0];
        var dollar_loss = incidents_data.features[i].properties.Estimated_Dollar_Loss;
        fireIncidentData.push({latitude: latitude, longitude: longitude, dollar_loss: dollar_loss});
      }
    }
    console.log(fireIncidentData.length);

    //populate boroughs_info with the AREA_NAME of each feature in boroughs_data.features
    var ward_info = [];


    for (var i = 0; i < ward_data.features.length; i++) {
          var wardName = ward_data.features[i].properties.NAME;
    var polygon = [];
      for (var j = 0; j < ward_data.features[i].geometry.coordinates[0].length; j++) {
        polygon.push(L.latLng(ward_data.features[i].geometry.coordinates[0][j][1], ward_data.features[i].geometry.coordinates[0][j][0]));
      }
            

      var dollarLossTotal = 0;
      var count = 0;
      
      //For loop to add the dollar_damage of each fire incident to the boroughs_info list
      for (var k = 0; k < fireIncidentData.length; k++) {
        if (L.polygon(polygon).contains(L.latLng(fireIncidentData[k].latitude, fireIncidentData[k].longitude))) {
          dollarLossTotal += fireIncidentData[k].dollar_loss;
          count++;
        
          }
          if (count>0) {
            var dollarLossAvg = dollarLossTotal / count;
            ward_info.push({ward: wardName, dollar_loss: dollarLossAvg});
          }
        }
      }
    



    //rank and print the boroughs by dollar loss
    ward_info.sort(function(a, b) {
      return b.dollar_loss - a.dollar_loss;
    });


    
var colors = chroma.scale(['#ffe0b2', '#ff5722']).colors(15);
// Create a choropleth map with the boroughsLayer and color scale
var choropleth = L.choropleth(ward_data, {
  valueProperty: function(feature) {
    var ward = feature.properties.NAME;
    var wardInfo = ward_info.find(function(info) {
      return info.ward === ward;
      
    });
  
    // Return the dollar loss information for the borough
    return wardInfo ? wardInfo.dollar_loss : null;
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
    var wardInfo = ward_info.find(function(info) {
      return info.ward === ward;
    });
  
    if (wardInfo) {
      var popupContent = document.createElement('div');
  
      // Calculate the percentage of total dollar loss attributed to the borough
      var totalDollarLoss = ward_info.reduce(function(acc, info) {
        return acc + info.dollar_loss;
      }, 0);
      var wardPercentage = ((wardInfo.dollar_loss / totalDollarLoss) * 100).toFixed(2);
      var remainingPercentage = (100 - wardPercentage).toFixed(2);
  
      // Create the chart data and layout
      var data = [{
        values: [wardPercentage, remainingPercentage],
        labels: [ward + " (" + wardPercentage + "%)", "Remaining (" + remainingPercentage + "%)"],
        type: 'pie'
      }];
      var layout = {
        title: 'Dollar Loss by Borough'
      };
  
      // Create the chart and append it to the popup content
      // Plotly.newPlot(popupContent, data, layout, {responsive: true});
  // Append the dollar loss information to the popup content
      var dollarLoss = document.createElement('p');
      dollarLoss.innerText = ward + ": $" + wardInfo.dollar_loss.toLocaleString();
      popupContent.appendChild(dollarLoss);
      // Bind the popup to the layer
      layer.bindPopup(popupContent);
    }
    
  }
 



}).addTo(myMap);

// Create a legend for the choropleth map
var legend = L.control({position: 'bottomright'});

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'info legend'),
      limits = choropleth.options.limits,
      colors = choropleth.options.colors,
      labels = [];

      var legendInfo = "<h1>Average Fire Dollar Damage by Ward<br />($)</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + formatNumber(Math.round(limits[0]/1000) * 1000) + "</div>" +
        "<div class=\"max\">" + formatNumber(Math.round(limits[limits.length - 1]/1000) * 1000) + "</div>" +
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






  })

});
  
var markersScript=document.createElement('script');
markersScript.setAttribute('src','Markers/static/js/markers.js');
document.head.appendChild(markersScript);