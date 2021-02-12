import os
import json
import datetime
import threading
from bson import json_util, objectid
from flask_cors import CORS
from flask import Flask, jsonify, request, make_response, Response
from flask.wrappers import Response as FlaskResponse
from flask_restx import Resource, Api, fields, reqparse
from flask_cors import CORS
from utils.dao import XmemeDb
from utils.image_url_validation import validate_image_url


# Init flask app
app = Flask(__name__)
cors = CORS(app)
app.config['RESTX_MASK_HEADER'] = None
app.config['RESTX_MASK_SWAGGER'] = False
app.config['CORS_HEADERS'] = 'Content-Type'

# Init flask-restx api
api = Api(app, title='Xmeme-Manas-Acharya', doc='/swagger-ui/',
          description='Meme Stream api built by Manas Acharya from Crio Winter of Doing Stage 2B', contact='Manas Acharya', contact_url='https://manasacharya.ml/', contact_email='manasacharya.101@gmail.com', default='xmeme', default_label='api')

# Creating Xmeme - DAO object
xdao = XmemeDb()

# Flask Restx Request Parsers
# /memecount GET Query parameters
memes_count = reqparse.RequestParser(bundle_errors=True)
memes_count.add_argument(
    'name', type=str)
memes_count.add_argument(
    'url', type=str)
memes_count.add_argument(
    'caption', type=str)
# /memes GET Query parameters
get_memes = reqparse.RequestParser(bundle_errors=True)
get_memes.add_argument(
    'page', type=str)
get_memes.add_argument(
    'limit', type=str)


# Flask Restx models
memes_post_response_model = api.model('Memes Post Response Model', {
    "id": fields.String,
})
mongo_datetime_model = api.model('Datetime Model', {
                                 "$date": fields.Integer})
memes_get_response_model = api.model('Memes Get Response Model', {
    "id": fields.String,
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
memes_post_model = api.model('Memes post Input', {
    'name': fields.String,
    'caption': fields.String,
    'url': fields.String
})
memes_contributors_model = api.model('Memes Contributors Model', {
    '_id': fields.String,
    'count': fields.String
})
memes_comments_model = api.model('Memes Comments Model', {
    '_id': fields.String,
    'name': fields.String,
    'comment': fields.String(default='this is comment')
})

# API ENDPOINTS


@api.route('/memes')
class MemesRoute(Resource):
    @api.doc(responses={400: "Not received all required parameters", 422: "Resource isn't valid or of expected type", 200: "Meme uploaded", 500: "Internal Server Error", 409: "Entry already exists"})
    @api.expect(memes_post_model)
    def post(self):
        '''Endpoint to send a meme to the backend.
        Returns: Unique ID for the uploaded meme.
        Expects: Meme Owner Name, Valid Image URL, Meme Caption'''

        req_data = json.loads(request.data)

        # check if string is empty or emptyspace
        def checkNoValue(x): return x.isspace() or not x

        # check if all fields have values and are not empty strings
        if (not all(param in req_data for param in ['name', 'url', 'caption'])) or checkNoValue(req_data['name']) or checkNoValue(req_data['url']) or checkNoValue(req_data['caption']):
            return make_response(jsonify({'msg': 'Enter values for all: name, url, caption'}), 400)

        # DISABLED IMAGE URL VERIFICATION FOR CRIO AUTOMATION TESTS
        # validate content at url is image
        validation_status, validation_response = validate_image_url(
            req_data['url'])
        if not validation_status:
            return validation_response

        # check if entry has already been made
        if xdao.count_meme_documents(req_data['name'], req_data['url'], req_data['caption']) > 0:
            return make_response(jsonify({'msg': 'Entry already exists'}), 409)

        try:
            # insert record into db
            insert_info = xdao.insert_meme(
                req_data['name'], req_data['url'], req_data['caption'])
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': str(e)}), 500)

        # return Object id as String
        _id = str(insert_info.inserted_id)
        return make_response(jsonify(({'id': _id})), 200)

    @api.doc(responses={200: "Fetched Meme Data", 500: "Internal Server Error"})
    @api.doc(parser=get_memes)
    def get(self):
        '''Endpoint to fetch the latest 100 memes : Optionally can enable pagination by passing page and limit value. Default limit if not passed is taken as 100'''
        try:
            # Get latest memes from db with specified page number and limit
            skip = int(request.args.get('page')) - \
                1 if request.args.get('page') and int(
                    request.args.get('page')) > 0 else 0
            limit = int(request.args.get('limit')
                        ) if request.args.get('limit') else 100
            meme_data = xdao.find_memes(skip=skip*limit, limit=limit)
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': str(e)}), 500)

        # return meme data
        return json.loads(json_util.dumps(meme_data)), 200


@api.route('/memes/<_id>')
class MemesIDRoutes(Resource):
    @api.doc(responses={404: "Meme with specified ID doesn't exist", 200: "Fetched specified Meme Data", 500: "Internal Server Error"})
    def get(self, _id):
        '''Endpoint to fetch a particular Meme with passed ID'''

        try:
            # Convert string id to bson Object for mongo
            # if it fails that means passed id didn't conform to mongo ObjectId standard therefore Meme doesn't exist
            objectid.ObjectId(_id)
        except Exception as e:
            return make_response(jsonify({'msg': "Meme with specified ID does not exist"}), 404)

        try:
            # Get meme data
            meme_data = xdao.find_memes_by_id(_id)
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': str(e)}), 500)

        # check is query response is None ie. image exists or not
        if not meme_data:
            return make_response(jsonify({'msg': "Meme with specified ID does not exist"}), 404)

        # return meme data
        return json.loads(json_util.dumps(meme_data)), 200

    @api.doc(responses={409: 'Passed Existing Values', 200: 'Meme updated'})
    @api.expect(memes_update_model)
    def patch(self, _id):
        '''Endpoint to update the caption or url for an existing meme'''
        # Check if Meme exists for ID and get relevant data
        meme_data = self.get(_id)

        # if get() returns response type returns it
        if isinstance(meme_data, FlaskResponse):
            return meme_data

        # jsonify response
        req_data = json.loads(request.data)
        caption = meme_data[0][0]['caption']
        url = meme_data[0][0]['url']

        # extract caption and url info for request data
        # assign value if passed value is not empty string or doesn't exist
        if 'caption' in req_data and len(req_data['caption'].split()) > 0:
            caption = req_data['caption']
        if 'url' in req_data and len(req_data['url'].split()) > 0:
            url = req_data['url']

        # check if requested changes are updating to same existing values
        if caption == meme_data[0][0]['caption'] and url == meme_data[0][0]['url']:
            return make_response(jsonify({'msg': 'Field values identical to original meme data'}), 409)

        # DISABLED IMAGE URL VERIFICATION FOR CRIO AUTOMATION TESTS
        # validate content at url is image if new url is passed
        if url != meme_data[0][0]['url']:
            validation_status, validation_response = validate_image_url(url)
            if not validation_status:
                return validation_response

        # check if entry has already been made
        if xdao.count_meme_documents(meme_data[0][0]['name'], url, caption) > 0:
            return make_response(jsonify({'msg': 'Entry already exists'}), 409)

        try:
            # update meme
            xdao.update_meme(_id, caption=caption, url=url)
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': str(e)}), 500)

        # update successful
        return make_response(jsonify({'msg': f'Updated image {_id}'}), 200)


@api.route('/contributors')
class Contributors(Resource):
    @api.doc(responses={200: "Fetched Meme Owner Data", 500: "Internal Server Error"})
    @api.marshal_with(memes_contributors_model)
    def get(self):
        '''Fetch all Meme Owners and Submission Count'''
        try:
            # Get latest 100 memes from db
            contributors_data = xdao.get_contributors()
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': str(e)}), 500)

        # return meme data
        return json.loads(json_util.dumps(contributors_data)), 200


@api.route('/memecount')
@api.doc(responses={200: "Fetched Meme Owner Data", 500: "Internal Server Error"})
class SubmissionCount(Resource):
    @api.doc(parser=memes_count)
    def get(self):
        '''Get Count of documents by name or url or caption as params'''
        name = request.args.get('name')
        url = request.args.get('url')
        caption = request.args.get('caption')
        try:
            resp = xdao.count_meme_documents(name, url, caption)
            return make_response(jsonify({'count': resp}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': 'DB Error', 'exception': str(e)}), 500)


@api.route('/addcomment')
class AddComment(Resource):
    @api.doc(responses={200: "Added Comment", 500: "Internal Server Error", 400: "Incomplete Data", 404: "Meme not Found"})
    @api.expect(memes_comments_model)
    def post(self):
        '''Endpoint to post Comments'''
        req_data = json.loads(request.data)

        # check if string is empty or emptyspace
        def checkNoValue(x): return x.isspace() or not x

        # check if all fields have values and are not empty strings
        if (not all(param in req_data for param in ['name', 'comment', '_id'])) or checkNoValue(req_data['name']) or checkNoValue(req_data['comment']) or checkNoValue(req_data['_id']):
            return make_response(jsonify({'msg': 'Enter values for fields'}), 400)

        # checks if meme exists. if get() returns response type we return it
        midRoute = MemesIDRoutes()
        response = midRoute.get(req_data['_id'])
        if isinstance(response, FlaskResponse):
            return response

        response = xdao.add_comment(
            req_data['_id'], req_data['name'], req_data['comment'])

        return make_response(jsonify({'msg': 'Inserted Comment'}), 200)


# Flask error handling
@app.errorhandler(404)
def resource_not_found(e):
    return jsonify({'msg': 'Resource not found'}), 404


if __name__ == "__main__":
    app.run()
