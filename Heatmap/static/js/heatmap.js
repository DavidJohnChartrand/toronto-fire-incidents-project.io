// Creating the map object
var myMap = L.map("map", {
  center: [43.6532, -79.3832],
  zoom: 11
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// // Load the GeoJSON data.
var fireData = "static/data/Fire_Incidents_Data.geojson";


//Read the GeoJSON data. and console log the first element of each array to verify the data is being read correctly
d3.json(fireData).then(function (incidents_data) {
  console.log(incidents_data.features[0]);
});

function CreateHeatMap(incidents_data){
  var heatArray = [];


  for (var i = 0; i < incidents_data.features.length; i++) {
    var fireLocation = incidents_data.features[i].geometry.coordinates;
    if (fireLocation[0] !== null &&
      fireLocation[1] !== null) {

      heatArray.push(L.latLng([fireLocation[0], fireLocation[1]]));

    }

  }

  console.log(heatArray)
  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);
}

// Load URL
var fireIncidentUrl = "http://127.0.0.1:5000/fire_incidents"

d3.json(fireIncidentUrl).then(function (incidents_data) {
  CreateHeatMap(incidents_data)
});

function CreateTimeLine(incidents_data) {
  incidents_data.features.forEach((feat, idx, arr)=>{

    var lat = feat.geometry.coordinates[1]
    feat.geometry.coordinates[1] = feat.geometry.coordinates[0];
    feat.geometry.coordinates[0]=lat

    //if the dates are fucked, remove data 
  if(!feat.properties.TFS_Arrival_Time || !feat.properties.Fire_Under_Control_Time){
    arr.splice(idx,1);//removes the whole ass object
  }
});
var timelineControl = L.timelineSliderControl({
  formatOutput: function (date) {
    return new Date(date).toLocaleDateString();
  }
});

var events = incidents_data

var timelineLayer = L.timeline(events, {
  getInterval: function (event) {
     return {
        start: new Date(event.properties.TFS_Arrival_Time),
        end: addDays(new Date(event.properties.Fire_Under_Control_Time), 1)
      };
  },
  pointToLayer: function (event, latlng) {
    return L.circleMarker(latlng, null).bindPopup(`<h3>${event.properties.Intersection}</h3> <hr>
      <h3>Time Under Control: ${event.properties.Fire_Under_Control_Time}<h3/>
      <h3>Ignition Source: ${event.properties.Ignition_Source}<h3/>
      <h3>Estimated Dollar Damage: ${event.properties.Estimated_Dollar_Loss}<h3/>`
      );
   }
});

timelineLayer.addTo(myMap);
timelineControl.addTo(myMap);
timelineControl.addTimelines(timelineLayer);

console.log("hello");
}

// d3.json(fireData).then(function (incidents_data) {
//   CreateTimeLine(incidents_data)
//   });


addDays = (date, days) => {
  date = date.setDate(date.getDate()+days);
  return date;
}

d3.json(fireIncidentUrl).then(function (incidents_data) {
  console.log(incidents_data.features);
  CreateTimeLine(incidents_data);
});