import json
input_file=json.load(open("Fire Incidents Data.json", "r", encoding="utf-8"))

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

output_file = open("geodata.geojson", 'w')
json.dump(geojson, output_file)

# print geojson
print(output_file)