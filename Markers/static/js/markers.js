// Define the layer groups and marker cluster groups
var layers = {
    FIRE_STATION: new L.LayerGroup(),
    FIRE_HYDRANT: new L.LayerGroup()
  };
  

  //Create a cluster group for the fire hydrants
    var fireHydrantMarkers = L.markerClusterGroup();

  // Create the map object with layers
  var myMap = L.map("map", {
    center: [43.6532, -79.3832],
    zoom: 10,
    layers: [
      layers.FIRE_STATION,
      layers.FIRE_HYDRANT
    ]
  });
  
  // Add the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Define the overlays for the layer control
  var overlays = {  
    "Fire Stations": layers.FIRE_STATION,
    "Fire Hydrants": layers.FIRE_HYDRANT
  };
  
  // Add the layer control to the map
  L.control.layers(null, overlays).addTo(myMap);
  
  // Define the icon for the markers
  var icons = {  
    FIRE_STATION: L.ExtraMarkers.icon({
      icon: "ion-fireball",
      iconColor: "white",
      markerColor: "red",
      shape: "circle"
    }),
    FIRE_HYDRANT: L.ExtraMarkers.icon({
      icon: "ion-waterdrop",
      iconColor: "white",
      markerColor: "blue",
      shape: "circle"
    })
  };
  
  // Create a legend control
  var info = L.control({
    position: "bottomright"
  });
  
  // Add the legend to the map
  info.onAdd = function() {
    var div = L.DomUtil.create('div', 'legend');
    return div;
  };
  info.addTo(myMap);
  
  // Read the GeoJSON data and add markers to the map
  var stationData = "http://127.0.0.1:5000/fire_station_location";
  var hydrantData = "http://127.0.0.1:5000/fire_hydrants";
  
  d3.json(stationData).then(function(fireStations) {
    // Loop through the data and add markers to the marker cluster group
    for (var i = 0; i < fireStations.features.length; i++) {
      var location = fireStations.features[i].geometry;
      if (location) {
        var marker = L.marker([location.coordinates[1], location.coordinates[0]], { icon: icons.FIRE_STATION })
          .bindPopup(fireStations.features[i].properties.ADDRESS);
          layers.FIRE_STATION.addLayer(marker);
      }
    }
 
  });
  
  d3.json(hydrantData).then(function(fireHydrants) {
    // Loop through the data and add markers to the marker cluster group
    for (var i = 0; i < fireHydrants.features.length; i++) {
      var location = fireHydrants.features[i].geometry;
      if (location) {
        var marker = L.marker([location.coordinates[1], location.coordinates[0]], { icon: icons.FIRE_HYDRANT })
          .bindPopup(fireHydrants.features[i].properties.LOCDESC);
        fireHydrantMarkers.addLayer(marker);
      }
    }
    // Add the marker cluster group to the layer group and the map
    layers.FIRE_HYDRANT.addLayer(fireHydrantMarkers);
  });

  
  