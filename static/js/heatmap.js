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

// var neighbourhoodData = "static/data/Neighbourhoods.geojson";

var firepoint = {
  "type": "FeatureCollection", 
  "features": [
    {"type": "Feature", 
    "geometry": {
      "type": "Point", 
      "coordinates": [43.686558176999995, -79.599419224]},
      "properties": {
        "_id": 789121, 
        "Area_of_Origin": "81 - Engine Area", 
        "Building_Status": null, 
        "Business_Impact": null, 
        "Civilian_Casualties": 0.0, 
        "Count_of_Persons_Rescued": 0.0, 
        "Estimated_Dollar_Loss": 15000.0, 
        "Estimated_Number_Of_Persons_Displaced": null, 
        "Exposures": null, 
        "Ext_agent_app_or_defer_time": "2018-02-24T21:12:00", 
        "Extent_Of_Fire": null, 
        "Final_Incident_Type": "01 - Fire", 
        "Fire_Alarm_System_Impact_on_Evacuation": null, 
        "Fire_Alarm_System_Operation": null, 
        "Fire_Alarm_System_Presence": null, 
        "Fire_Under_Control_Time": "2018-02-24T21:15:40", 
        "Ignition_Source": "999 - Undetermined", 
        "Incident_Number": "F18020956", 
        "Incident_Station_Area": 441.0, 
        "Incident_Ward": 1.0, 
        "Initial_CAD_Event_Type": "Vehicle Fire", 
        "Intersection": "Dixon Rd / 427 N Dixon Ramp", 
        "Last_TFS_Unit_Clear_Time": "2018-02-24T21:38:31", 
        "Latitude": 43.686558176999995, 
        "Level_Of_Origin": null, 
        "Longitude": -79.599419224, 
        "Material_First_Ignited": "47 - Vehicle", 
        "Method_Of_Fire_Control": "1 - Extinguished by fire department", 
        "Number_of_responding_apparatus": 1.0, 
        "Number_of_responding_personnel": 4.0, 
        "Possible_Cause": "99 - Undetermined", 
        "Property_Use": "896 - Sidewalk, street, roadway, highway, hwy (do not use for fire incidents)", 
        "Smoke_Alarm_at_Fire_Origin": null, 
        "Smoke_Alarm_at_Fire_Origin_Alarm_Failure": null, 
        "Smoke_Alarm_at_Fire_Origin_Alarm_Type": null, 
        "Smoke_Alarm_Impact_on_Persons_Evacuating_Impact_on_Evacuation": null, 
        "Smoke_Spread": null, 
        "Sprinkler_System_Operation": null, 
        "Sprinkler_System_Presence": null, 
        "Status_of_Fire_On_Arrival": "7 - Fully involved (total structure, vehicle, spreading outdoor fire)", 
        "TFS_Alarm_Time": "2018-02-24T21:04:29", "TFS_Arrival_Time": "2018-02-24T21:10:11", 
        "TFS_Firefighter_Casualties": 0.0}
      }, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [43.766134781999995, -79.390039484]}, "properties": {"_id": 789122, "Area_of_Origin": "75 - Trash, rubbish area (outside)", "Building_Status": null, "Business_Impact": null, "Civilian_Casualties": 0.0, "Count_of_Persons_Rescued": 0.0, "Estimated_Dollar_Loss": 50.0, "Estimated_Number_Of_Persons_Displaced": null, "Exposures": null, "Ext_agent_app_or_defer_time": "2018-02-24T21:29:42", "Extent_Of_Fire": null, "Final_Incident_Type": "01 - Fire", "Fire_Alarm_System_Impact_on_Evacuation": null, "Fire_Alarm_System_Operation": null, "Fire_Alarm_System_Presence": null, "Fire_Under_Control_Time": "2018-02-24T21:32:24", "Ignition_Source": "999 - Undetermined", "Incident_Number": "F18020969", "Incident_Station_Area": 116.0, "Incident_Ward": 18.0, "Initial_CAD_Event_Type": "Fire - Grass/Rubbish", "Intersection": "Sheppard Ave E / Clairtrell Rd", "Last_TFS_Unit_Clear_Time": "2018-02-24T21:35:58", "Latitude": 43.766134781999995, "Level_Of_Origin": null, "Longitude": -79.390039484, "Material_First_Ignited": "97 - Other", "Method_Of_Fire_Control": "1 - Extinguished by fire department", "Number_of_responding_apparatus": 1.0, "Number_of_responding_personnel": 4.0, "Possible_Cause": "03 - Suspected Vandalism", "Property_Use": "896 - Sidewalk, street, roadway, highway, hwy (do not use for fire incidents)", "Smoke_Alarm_at_Fire_Origin": null, "Smoke_Alarm_at_Fire_Origin_Alarm_Failure": null, "Smoke_Alarm_at_Fire_Origin_Alarm_Type": null, "Smoke_Alarm_Impact_on_Persons_Evacuating_Impact_on_Evacuation": null, "Smoke_Spread": null, "Sprinkler_System_Operation": null, "Sprinkler_System_Presence": null, "Status_of_Fire_On_Arrival": "2 - Fire with no evidence from street", "TFS_Alarm_Time": "2018-02-24T21:24:43", "TFS_Arrival_Time": "2018-02-24T21:29:31", "TFS_Firefighter_Casualties": 0.0}}]
};

//Read the GeoJSON data. and console log the first element of each array to verify the data is being read correctly
// d3.json(fireData).then(function(incidents_data) {
//   console.log(incidents_data.features);
// });

// d3.json(neighbourhoodData).then(function(boroughs_data) {
//   console.log(boroughs_data.features[0]);
 
// });

d3.json(fireData).then(function(incidents_data) {
  console.log(incidents_data.features[0].geometry.coordinates);


var heatArray = [] 
// Loop through the fire data
for (let i = 0; i < incidents_data.features.length; i++) {
  console.log(incidents_data.features[i].geometry);
  var fireLocation = incidents_data.features[i].geometry;
    if (fireLocation) {
      heatArray.push([fireLocation.coordinates[0], fireLocation.coordinates[1]]);
    }

  //  Create a new marker cluster group
    var markers = L.markerClusterGroup();

    if (fireLocation) {
      marker = L.marker([fireLocation.coordinates[0], fireLocation.coordinates[1]]).addTo(myMap);
      
      var markeDiv = document.createElement('div',{className: 'large-popup'});
        marker.bindPopup(markeDiv);
        var trace = {
          values: [19, 26, 55],
          labels: ['Pizza', 'Burgers', 'Salad'],
          type: 'pie'
        };
        var layout = {
          legend:{
            "orientation":"h",
            bgcolor: "tranparent"
        },
          // showlegend:false,
          width: 300,
          height: 300,
          margin: { t: 0, r: 0, b: 0, l: 20 },
          autosize: false
        };
        Plotly.newPlot(markeDiv, [trace], layout);
      }
    }

console.log(heatArray)
var heat = L.heatLayer(heatArray, {
  radius: 20,
  blur: 35
}).addTo(myMap);
  





});


// var heatArray = [];

// console.log(firepoint.features[0].geometry.coordinates);

// for (let i = 0; i < firepoint.features.length; i++) {
//   console.log(firepoint.features[i].geometry);
//   var fireLocation = firepoint.features[i].geometry;
//   console.log(fireLocation);
//     if (fireLocation) {
//       heatArray.push([fireLocation.coordinates[0], fireLocation.coordinates[1]]);
//     }
//     if (fireLocation) {
//       marker = L.marker([fireLocation.coordinates[0], fireLocation.coordinates[1]]).addTo(myMap);
//       console.log(fireLocation.coordinates)
//       var markeDiv = document.createElement('div',{className: 'large-popup'});
//         marker.bindPopup(markeDiv);
//         var trace = {
//           values: [19, 26, 55],
//           labels: ['Pizza', 'Burgers', 'Salad'],
//           type: 'pie'
//         };
//         var layout = {
//           legend:{
//             "orientation":"h",
//             bgcolor: "tranparent"
//         },
//           // showlegend:false,
//           width: 300,
//           height: 300,
//           margin: { t: 0, r: 0, b: 0, l: 20 },
//           autosize: false
//         };
//         Plotly.newPlot(markeDiv, [trace], layout);
//       }
//     }

// console.log(heatArray)
// var heat = L.heatLayer(heatArray, {
//   radius: 20,
//   blur: 35
// }).addTo(myMap);

