import os
import json
import datetime
from bson import json_util, objectid
from pymongo import MongoClient
from flask_cors import CORS
from flask import Flask, jsonify, request, make_response, Response
from flask.wrappers import Response as FlaskResponse
from flask_restx import Resource, Api, fields, reqparse

from utils.image_url_validation import validate_image_url


# Init flask app
app = Flask(__name__)
# Secret_key for jwt
app.config['SECRET_KEY'] = os.environ.get('XMEME_JWT_SECRET')
app.config['RESTX_MASK_HEADER'] = None
app.config['RESTX_MASK_SWAGGER'] = False


# Init flask-restx api
api = Api(app, title='Xmeme-Manas-Acharya', doc='/swagger-ui/',
          description='Meme Stream api built by Manas Acharya from Crio Winter of Doing Stage 2B', contact='Manas Acharya', contact_url='https://manasacharya.ml/', contact_email='manasacharya.101@gmail.com', default='xmeme', default_label='api')


# Creating Mongo Connection Client
try:
    client = MongoClient(os.environ.get('MONGO_XMEME_CONNECT_URI'))
    db = client.crio_xmeme
except Exception as e:
    print(f'DB Connect Exception: {e}')


# Flask Restx Request Parsers
# /memes POST parameters
memes_post = reqparse.RequestParser(bundle_errors=True)
memes_post.add_argument(
    'name', type=str, required=True)
memes_post.add_argument(
    'url', type=str, required=True)
memes_post.add_argument(
    'caption', type=str, required=True)


# Flask Restx models
memes_post_response_model = api.model('Memes Post Response Model', {
    "id": fields.String,
})
mongo_id_model = api.model(
    'ObjectId Model', {"$oid": fields.String('ObjectId from Mongo')})
mongo_datetime_model = api.model('Datetime Model', {
                                 "$date": fields.Integer})
memes_get_response_model = api.model('Memes Get Response Model', {
    "_id": fields.Nested(mongo_id_model),
    "name": fields.String('Meme Owner Name'),
    "url": fields.String,
    "caption": fields.String('Meme Caption'),
    "created": fields.Nested(mongo_datetime_model),
    "updated": fields.Nested(mongo_datetime_model)
})
memes_update_model = api.model('Memes update Input', {
    'caption': fields.String,
    'url': fields.String
})


# ENDPOINTS

@api.route('/memes')
class MemesRoute(Resource):
    @api.doc(responses={422: "Resource isn't valid or of expected type", 200: "Meme uploaded", 500: "Internal Server Error", 409: "Entry already exists"})
    @ api.doc(params={'name': "Meme Owner's Name",  'url': "Meme image URL", 'caption': "meme caption"})
    @api.expect(memes_post)
    def post(self):
        '''Endpoint to send a meme to the backend.
        Returns: Unique ID for the uploaded meme.
        Expects: Meme Owner Name, Valid Image URL, Meme Caption'''

        # validate content at url is image
        validation_status, validation_response = validate_image_url(
            request.args.get('url'))
        if not validation_status:
            return validation_response

        # check if entry has already been made
        if db.memes.count_documents({'name': request.args.get('name'), 'url': request.args.get('url'), 'caption': request.args.get('caption')}) > 0:
            return make_response(jsonify({'msg': 'Entry already exists'}), 409)

        try:
            # insert record into db
            insert_info = db.memes.insert_one({
                'name': request.args.get('name'),
                'url': request.args.get('url'),
                'caption': request.args.get('caption'),
                'created': datetime.datetime.now(),
                'updated': datetime.datetime.now()
            })
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': str(e)}), 500)

        # return Object id as String
        _id = str(insert_info.inserted_id)
        return make_response(jsonify(({'id': _id})), 200)

    @ api.doc(responses={200: "Fetched Meme Data", 500: "Internal Server Error"})
    @ api.marshal_list_with(memes_get_response_model, code=200)
    def get(self):
        '''Endpoint to fetch the latest 100 memes'''
        try:
            # Get latest 100 memes from db
            meme_data = db.memes.find().sort([('created', 1)]).limit(100)
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': str(e)}), 500)

        # return meme data
        return json.loads(json_util.dumps(meme_data)), 200


@ api.route('/memes/<_id>')
class MemesIDRoutes(Resource):
    @ api.doc(responses={404: "Meme with specified ID doesn't exist", 200: "Fetched specified Meme Data", 500: "Internal Server Error"})
    def get(self, _id):
        '''Endpoint to specify a particular id to fetch a single Meme'''

        try:
            # Convert string id to bson Object for mongo
            # if it fails that means passed id didn't conform to mongo ObjectId standard therefore Meme doesn't exist
            _id = objectid.ObjectId(_id)
        except Exception as e:
            return make_response(jsonify({'msg': "Meme with specified ID does not exist"}), 404)

        try:
            # Get meme data
            meme_data = db.memes.find_one(
                {"_id": objectid.ObjectId(_id)})
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': str(e)}), 500)

        # check is query response is None ie. image exists or not
        if not meme_data:
            return make_response(jsonify({'msg': "Meme with specified ID does not exist"}), 404)

        # return meme data
        return json.loads(json_util.dumps(meme_data)), 200

    @ api.expect(memes_update_model)
    def patch(self, _id):
        '''Endpoint to update the caption or url for an existing meme'''
        # Check if Meme exists for ID and get relevant data
        meme_data = self.get(_id)

        # if get() returns response type returns it
        if isinstance(meme_data, FlaskResponse):
            return meme_data

        # jsonify response
        req_data = json.loads(request.data)
        caption = meme_data[0]['caption']
        url = meme_data[0]['url']

        # extract caption and url info for request data
        # assign value if passed value is not empty string or doesn't exist
        if 'caption' in req_data and len(req_data['caption'].split()) > 0:
            caption = req_data['caption']
        if 'url' in req_data and len(req_data['url'].split()) > 0:
            url = req_data['url']

        # check if requested changes are updating to same existing values
        if caption == meme_data[0]['caption'] and url == meme_data[0]['url']:
            return make_response(jsonify({'msg': 'Field values identical to original meme data'}), 409)

        # validate content at url is image if new url is passed
        if url != meme_data[0]['url']:
            validation_status, validation_response = validate_image_url(url)
            if not validation_status:
                return validation_response

        try:
            # update meme
            db.memes.update_one({'_id': objectid.ObjectId(_id)}, {
                '$set': {
                    'caption': caption,
                    'url': url,
                    'updated': datetime.datetime.now()
                }
            }, upsert=False)
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': str(e)}), 500)

        # update successful
        return make_response(jsonify({'msg': f'Updated image {_id}'}), 200)


# Flask error handling
@app.errorhandler(404)
def resource_not_found(e):
    return jsonify({'msg': 'Resource not found'}), 404


if __name__ == "__main__":
    app.run(debug=True, port=8080)