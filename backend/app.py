import os
import re
import json
import requests
import datetime
from bson import json_util, objectid
from pymongo import MongoClient
from flask_cors import CORS
from flask import Flask, jsonify, request, make_response, Blueprint
from flask.wrappers import Response
from flask_restx import Resource, Api, fields, reqparse


# Init flask app
app = Flask(__name__)
# Secret_key for jwt
app.config['SECRET_KEY'] = os.environ.get('XMEME_JWT_SECRET')
app.config['RESTX_MASK_HEADER'] = None
app.config['RESTX_MASK_SWAGGER'] = False

# Configuring Flask Blueprint
blueprint = Blueprint('api', __name__, url_prefix='/swagger-ui')

# Init flask-restx api
api = Api(blueprint, title='Xmeme-Manas-Acharya',
          description='Meme directory api built by Manas Acharya from Crio Winter of Doing Stage 2B', contact='Manas Acharya', contact_url='https://manasacharya.ml/', contact_email='manasacharya.101@gmail.com')

# Register blueprint
app.register_blueprint(blueprint)

# Creating Mongo Connection Client
try:
    client = MongoClient(os.environ.get('MONGO_XMEME_CONNECT_URI'))
    db = client.crio_xmeme
except Exception as e:
    print(f'DB Connect Exception: {e}')


# Flask Restx Request Parsers
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
    'Mongo ID Model', {"$oid": fields.String('ObjectId from Mongo')})
mongo_datetime_model = api.model('Mongo_Datetime_Model', {
                                 "$date": fields.Integer})
memes_get_response_model = api.model('Memes Get Response Model', {
    "_id": fields.Nested(mongo_id_model),
    "name": fields.String('Meme Owner Name'),
    "url": fields.String,
    "caption": fields.String('Meme Caption'),
    "created": fields.Nested(mongo_datetime_model),
    "updated": fields.Nested(mongo_datetime_model)
})
memes_update_model = api.model('Memes update Model', {
    'caption': fields.String,
    'url': fields.String
})


# ENDPOINTS

@api.route('/memes')
class MemesRoute(Resource):
    @api.doc(responses={422: "Resource isn't valid or of expected type", 200: "Meme uploaded", 500: "Internal Server Error", 409: "Entry already exists"})
    @ api.doc(params={'name': "Meme Owner's Name",  'url': "Meme image URL", 'caption': "meme caption"})
    @ api.expect(memes_post)
    def post(self):
        '''Endpoint to send a meme to the backend.
        Returns: Unique ID for the uploaded meme.
        Expects: Meme Owner Name, Valid Image URL, Meme Caption'''

        # validate if url is actually url source: https://github.com/django/django/blob/stable/1.3.x/django/core/validators.py#L45
        image_url_regex = re.compile(
            r'^(?:http|ftp)s?://'  # http:// or https://
            # domain
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        # validate url with regex
        if not re.match(image_url_regex, request.args.get('url')):
            return make_response(jsonify({'msg': "Url isn't valid"}), 422)

        # check if content at url is of image type
        if not self.is_url_image(request.args.get('url')):
            return make_response(jsonify({'msg': "Url isn't valid image"}), 422)

        # check if entry has already been made
        if db.memes.count_documents({'name': request.args.get('name'), 'url': request.args.get('url'), 'caption': request.args.get('caption')}) > 0:
            return make_response(jsonify({'msg': 'Entry already exists'}), 409)

        try:
            insert_info = db.memes.insert_one({
                'name': request.args.get('name'),
                'url': request.args.get('url'),
                'caption': request.args.get('caption'),
                'created': datetime.datetime.now(),
                'updated': datetime.datetime.now()
            })
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': e}), 500)

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
            return make_response(jsonify({'msg': 'DB Error', 'exception': e}), 500)

        # return response
        return json.loads(json_util.dumps(meme_data)), 200

    def is_url_image(self, url):
        image_formats = ("image/png", "image/jpeg", "image/jpg", "image/gif",
                         "image/apng", "image/avif", "image/jfif", "image/webp")
        resp = requests.head(url)
        return resp.headers['content-type'] in image_formats


@ api.route('/memes/<_id>')
class MemesIDRoutes(Resource):
    @ api.doc(responses={404: "Meme with specified ID doesn't exist", 200: "Fetched specified Meme Data", 500: "Internal Server Error"})
    def get(self, _id):
        '''Endpoint to specify a particular id to fetch a single Meme'''

        # Convert string id to bsn Object for mongo
        # if it fails that means id didn't conform to mongo ObjectId standard
        try:
            _id = objectid.ObjectId(_id)
        except Exception as e:
            return make_response(jsonify({'msg': "Meme with specified ID does not exist"}), 404)

        # Get meme data
        try:
            meme_data = db.memes.find_one(
                {"_id": objectid.ObjectId(_id)})
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': e}), 500)

        # check is query response is None ie. image exists or not
        if not meme_data:
            return make_response(jsonify({'msg': "Meme with specified ID does not exist"}), 404)

        # return meme data
        return json.loads(json_util.dumps(meme_data)), 200

    @api.expect(memes_update_model)
    def patch(self, _id):
        '''Endpoint to update the caption or url for an existing meme'''
        # Check if Meme exists for ID
        meme_data = self.get(_id)

        if isinstance(meme_data, Response):
            return meme_data

        req_data = json.loads(request.data)

        if 'caption' in req_data and not req_data['caption'].isspace():
            meme_data[0]['caption'] = req_data['caption']
        if 'url' in req_data and not req_data['url'].isspace():
            meme_data[0]['url'] = req_data['url']
            # validate if url is actually url source: https://github.com/django/django/blob/stable/1.3.x/django/core/validators.py#L45
            image_url_regex = re.compile(
                r'^(?:http|ftp)s?://'  # http:// or https://
                # domain
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'
                r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
                r'(?::\d+)?'  # optional port
                r'(?:/?|[/?]\S+)$', re.IGNORECASE)
            # validate url with regex
            if not re.match(image_url_regex, meme_data[0]['url']):
                return make_response(jsonify({'msg': "Url isn't valid"}), 422)
            # check if content at url is of image type
            if not self.is_url_image(meme_data[0]['url']):
                return make_response(jsonify({'msg': "Url isn't valid image"}), 422)

        try:
            db.memes.update_one({'_id': objectid.ObjectId(_id)}, {
                '$set': {
                    'caption': meme_data[0]['caption'],
                    'url': meme_data[0]['url']
                }
            }, upsert=False)
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': e}), 500)

        return make_response(jsonify({'msg': f'Updated image {_id}'}), 200)

    def is_url_image(self, url):
        image_formats = ("image/png", "image/jpeg", "image/jpg", "image/gif",
                         "image/apng", "image/avif", "image/jfif", "image/webp")
        resp = requests.head(url)
        return resp.headers['content-type'] in image_formats


if __name__ == "__main__":
    app.run(debug=True, port=8080)
