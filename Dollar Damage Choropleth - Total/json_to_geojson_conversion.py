import json

input_file=json.load(open("static/data/Fire Incidents Data.json", "r", encoding="utf-8"))



geojson = {
    "type": "FeatureCollection",
    "features": [
    {
        "type": "Feature",
        "geometry" : {
            "type": "Point",
            "coordinates": [d["Latitude"], d["Longitude"]],
            },
        "properties" : d,
     } for d in input_file]
}


output_file = open("static/data/Fire_Incidents_Data.geojson", 'w')
json.dump(geojson, output_file)


