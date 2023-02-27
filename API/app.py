from flask import Flask,jsonify, json
from pymongo import MongoClient
from bson import json_util

# The following code is run in the command line to convert GeoJSON to a format that is readable for MongoDB

#Download jq (it's sed-like program but for JSON)
# Then run:
# jq --compact-output ".features" input.geojson > output.geojson
# then
# mongoimport --db dbname -c collectionname --file "output.geojson" --jsonArray


def parse_json(data):
    return json.loads(json_util.dumps(data))

app = Flask(__name__)

# Set up the MongoDB client
client = MongoClient("mongodb+srv://Eric:102030@cluster0.qltok.mongodb.net/test")

# Connect to the MongoDB database
db = client.fires_dB

    
# Define static routes
@app.route("/")
def Home():
    """List of all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/fire_hydrants<br/>"
        f"/api/v1.0/fire_incidents<br/>"
        f"/api/v1.0/fire_station_location<br/>"
        f"/api/v1.0/toronto_wards"
    )

@app.route('/fire_hydrants')
def get_collection():
    collection = db['fire_hydrants_data']
    documents = collection.find()
    result = []
    for document in documents:
        result.append(document)
    result = parse_json(result)
    return {'features': result}


@app.route('/fire_incidents')
def get_fire_incidents():
    collection = db['fire_incidents_data']
    documents = collection.find()
    result = []
    for document in documents:
        result.append(document)
    result = parse_json(result)
    return {'features': result}


@app.route('/fire_station_location')
def get_fire_station_location():
    collection = db['fire_station_locations']
    documents = collection.find()
    result = []
    for document in documents:
        result.append(document)
    result = parse_json(result)
    return {'features': result}



@app.route('/toronto_wards')
def get_neighbourhoods():
    collection = db['toronto_ward']
    documents = collection.find()
    result = []
    for document in documents:
        result.append(document)
    result = parse_json(result)
    return {'features': result}

    
if __name__ == "__main__":
    app.run()