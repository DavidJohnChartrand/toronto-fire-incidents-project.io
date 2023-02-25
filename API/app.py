from flask import Flask,jsonify, json
from pymongo import MongoClient
from bson import json_util

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
    collection = db['Fire_hydrants_data']
    documents = collection.find()
    result = []
    for document in documents:
        result.append(document)
    result = parse_json(result)
    return {'result': result}


@app.route('/fire_incidents')
def get_fire_incidents():
    collection = db['fire_incidents_data']
    documents = collection.find()
    result = []
    for document in documents:
        result.append(document)
    result = parse_json(result)
    return {'result': result}


@app.route('/fire_station_location')
def get_fire_station_location():
    collection = db['fire_station_location']
    documents = collection.find()
    result = []
    for document in documents:
        result.append(document)
    return {'result': result}


@app.route('/toronto_wards')
def get_neighbourhoods():
    collection = db['Toronto_ward']
    documents = collection.find()
    result = []
    for document in documents:
        result.append(document)
    return {'result': result}

    
if __name__ == "__main__":
    app.run(debug=True)