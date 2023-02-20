// Creating the map object
var myMap = L.map("map", {
  center: [43.6532, -79.3832],
  zoom: 12
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
var fireData = "static/data/Fire_Incidents_Data.geojson";

var neighbourhoodData = "static/data/Neighbourhoods.geojson";

//Read the GeoJSON data. and console log the first element of each array to verify the data is being read correctly
d3.json(fireData).then(function(incidents_data) {
  console.log(incidents_data.features[0]);
});

d3.json(neighbourhoodData).then(function(boroughs_data) {
  console.log(boroughs_data.features[0]);
 
});


//starting with creating a list of all fire incidents in the city and their associated dollar loss
d3.json(neighbourhoodData).then(function (boroughs_data) {
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
    var boroughs_info = [];
    for (var i = 0; i < boroughs_data.features.length; i++) {
      var polygon = [];
      for (var j = 0; j < boroughs_data.features[i].geometry.coordinates[0].length; j++) {
        polygon.push(L.latLng(boroughs_data.features[i].geometry.coordinates[0][j][1], boroughs_data.features[i].geometry.coordinates[0][j][0]));
      }
            
      //For loop to add the dollar_damage of each fire incident to the boroughs_info list
      for (var k = 0; k < fireIncidentData.length; k++) {
        if (L.polygon(polygon).contains(L.latLng(fireIncidentData[k].latitude, fireIncidentData[k].longitude))) {
          var boroughName = boroughs_data.features[i].properties.AREA_NAME;
          var found = false;
          for (var l = 0; l < boroughs_info.length; l++) {
            if (boroughs_info[l].borough === boroughName) {
              boroughs_info[l].dollar_loss += fireIncidentData[k].dollar_loss;
              found = true;
              break;
            }
          }
          if (!found) {
            boroughs_info.push({borough: boroughName, dollar_loss: fireIncidentData[k].dollar_loss});
          }
        }
      }
    }
    console.log(boroughs_info);


    
//Create a for loop to create a popup for each borough that shows the dollar loss using boroughs_data.features[i].properties.AREA_NAME as the key and boroughs_info.dollar_loss as the value

var boroughsLayer= L.geoJson(boroughs_data, {
  onEachFeature: function(feature, layer) {
    // Find the corresponding borough info from the boroughs_info list.
    var borough = feature.properties.AREA_NAME;
    var boroughInfo = boroughs_info.find(function(info) {
      return info.borough === borough;
    });
    // If there is corresponding borough info, bind a popup to the layer with the dollar loss information.
    if (boroughInfo) {
      layer.bindPopup(borough + ": $" + boroughInfo.dollar_loss.toLocaleString());
    }
  }
}).addTo(myMap);


var colors = chroma.scale(['#ffe0b2', '#ff5722']).colors(15);
// Create a choropleth map with the boroughsLayer and color scale
var choropleth = L.choropleth(boroughs_data, {
  valueProperty: function(feature) {
    var borough = feature.properties.AREA_NAME;
    var boroughInfo = boroughs_info.find(function(info) {
      return info.borough === borough;
      
    });
    console.log("borough: " + borough + " | boroughInfo: " + boroughInfo);
    // Return the dollar loss information for the borough
    return boroughInfo ? boroughInfo.dollar_loss : null;
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
    // Bind a popup to the layer with the dollar loss information
    var borough = feature.properties.AREA_NAME;
    var boroughInfo = boroughs_info.find(function(info) {
      return info.borough === borough;
    });
    if (boroughInfo) {
      layer.bindPopup(borough + ": $" + boroughInfo.dollar_loss.toLocaleString());
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

      var legendInfo = "<h1>Fire Dollar Damage by Neighbourhood<br />($)</h1>" +
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
  








