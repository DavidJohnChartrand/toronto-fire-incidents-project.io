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

//starting with creating a list of all fire incidents in the city and their fire under control time
d3.json(neighbourhoodData).then(function (boroughs_data) {
  d3.json(fireData).then(function (incidents_data) {

    //creating empty list to store the fire extinguishing data

    var fire_extinguishing_data = [];

    //Create a for loop to iterate through the incidents_data.features array
    for (var i = 0; i < incidents_data.features.length; i++) {
      //if the fire alarm time, fire under control time, latitude, and longitude are not null, add the data to fire_extinguishing_data
        if (incidents_data.features[i].properties.TFS_Alarm_Time !=null
        && incidents_data.features[i].properties.Fire_Under_Control_Time != null
        && incidents_data.features[i].geometry.coordinates[0] != null
        && incidents_data.features[i].geometry.coordinates[1] != null) {

        // Store the latitude and longitude of each fire incident
        var longitude= incidents_data.features[i].geometry.coordinates[1];
        var latitude = incidents_data.features[i].geometry.coordinates[0];

        // Calculate the difference between the fire under control time and the fire alarm time
        var alarmTime = new Date(incidents_data.features[i].properties.TFS_Alarm_Time);
        var underControlTime = new Date(incidents_data.features[i].properties.Fire_Under_Control_Time);
        var diffInMs = underControlTime - alarmTime;

        //converting the time into minutes for further calculations
        var extinguishingTime =diffInMs/(1000*60);

        fire_extinguishing_data.push({longitude: longitude, latitude: latitude, extinguishingTime: extinguishingTime});
      }
    }
    console.log(fire_extinguishing_data);

    

    //populate boroughs_info with the AREA_NAME of each feature in boroughs_data.features
    var boroughs_info = [];
    for (var i = 0; i < boroughs_data.features.length; i++) {
      var polygon = [];
      for (var j = 0; j < boroughs_data.features[i].geometry.coordinates[0].length; j++) {
        polygon.push(L.latLng(boroughs_data.features[i].geometry.coordinates[0][j][1], boroughs_data.features[i].geometry.coordinates[0][j][0]));
      }
      //declaring the borough name and the total extinguishing time for the borough as well as setting the counter for the number of fire incidents in the borough to 0
      var boroughName = boroughs_data.features[i].properties.AREA_NAME;
      var extinguishingTimeTotal= 0;
      var fireIncidentsCount=0;      
      
      //For loop to add the extinguishing time of each fire incident to the total extinguishing time for the borough
      for (var k = 0; k < fire_extinguishing_data.length; k++) {
        if (L.polygon(polygon).contains(L.latLng(fire_extinguishing_data[k].latitude, fire_extinguishing_data[k].longitude))) {
          extinguishingTimeTotal += fire_extinguishing_data[k].extinguishingTime;
          fireIncidentsCount++;
    }
  }
  //Averaging the total extinguishing time for the borough
      if (fireIncidentsCount > 0) {
        var averageExtinguishingTime = extinguishingTimeTotal / fireIncidentsCount;
        boroughs_info.push({borough: boroughName, extinguishing_time: averageExtinguishingTime});
      }
    }

console.log(boroughs_info);


    
    // Create a layer group for the boroughs

var boroughsLayer= L.geoJson(boroughs_data, {
  onEachFeature: function(feature, layer) {
    // Find the corresponding borough info from the boroughs_info list.
    var borough = feature.properties.AREA_NAME;
    var boroughInfo = boroughs_info.find(function(info) {
      return info.borough === borough;
    });
    // If there is corresponding borough info, bind a popup to the layer with the average extinghuishing time information.
    if (boroughInfo) {
      layer.bindPopup(borough + ":" + boroughInfo.extinguishing_time.toLocaleString()+"Minutes to Fire Under Control" );
    }
  }
}).addTo(myMap);

//color scale for the choropleth map (blue to white)
var colors = chroma.scale(['#f7fbff', '#08306b']).colors(15);

// Create a choropleth map with the boroughsLayer and color scale
var choropleth = L.choropleth(boroughs_data, {
  valueProperty: function(feature) {
    var borough = feature.properties.AREA_NAME;
    var boroughInfo = boroughs_info.find(function(info) {
      return info.borough === borough;
      
    });
    console.log("borough: " + borough + " | boroughInfo: " + boroughInfo);

    // Return the average extinguishing time information for the borough
    return boroughInfo ? boroughInfo.extinguishing_time : null;
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
      layer.bindPopup(borough + ": " + boroughInfo.extinguishing_time.toLocaleString()+ " Minutes to Fire Under Control ");
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

      var legendInfo = "<h1>Fire Under Control Time by Neighbourhood<br />in minutes</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + Math.round(limits[0]) + "</div>" +
        "<div class=\"max\">" + Math.round(limits[limits.length - 1]) + "</div>" +
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
