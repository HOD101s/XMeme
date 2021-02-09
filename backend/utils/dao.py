import os
import datetime
from bson import objectid
from pymongo import MongoClient


class XmemeDb:
    def __init__(self):
        # Creating Mongo Connection Client
        self.client = MongoClient(os.environ.get('MONGO_XMEME_CONNECT_URI'))
        self.db = self.client.crio_xmeme

    def count_meme_documents(self, name, url, caption):
        '''Counts number of documents matching params'''
        search_object = {}
        if name:
            search_object['name'] = name
        if url:
            search_object['url'] = url
        if caption:
            search_object['caption'] = caption
        return int(self.db.memes.count_documents(search_object))

    def insert_meme(self, name, url, caption):
        '''Insert meme document in Db'''
        dtime = datetime.datetime.utcnow()
        insert_response = self.db.memes.insert_one({
            'name': name,
            'url': url,
            'caption': caption,
            'created': dtime,
            'updated': dtime,
            'comments': []
        })
        self.db.logs.insert_one({
            'action': 'insertion',
            'meme_id': str(insert_response.inserted_id),
            'name': name,
            'url': url,
            'caption': caption,
            'log_time': dtime,
        })
        return insert_response

    def find_memes(self, skip=0, limit=100):
        '''Fetch memes from db. Apply skip, limit and sort operations'''
        # if sort:
        #     print(sort)
        #     self.db.memes.aggregate([{"$sort": sort}, {"$skip": skip}, {"$limit": limit}, {
        #                             "$addFields": {"id": {"$toString": "$_id"}}}, {"$project": {"_id": 0}}])
        return self.db.memes.aggregate([{"$sort": {"created": -1}}, {"$skip": skip}, {"$limit": limit}, {"$addFields": {"id": {"$toString": "$_id"}}}, {"$project": {"_id": 0}}])

    def find_memes_by_id(self, _id):
        '''Fetch meme data by id'''
        return self.db.memes.aggregate([{"$addFields": {"id": {"$toString": "$_id"}}}, {"$project": {"_id": 0}}, {"$match": {"id": _id}}])

    def update_meme(self, _id, caption='', url='', upsert=False):
        '''Update meme caption and/or url'''
        _set = {}
        if caption:
            _set['caption'] = caption
        if url:
            _set['url'] = url
        _set['updated'] = datetime.datetime.utcnow()
        self.db.memes.update_one({'_id': objectid.ObjectId(_id)}, {
            '$set': _set
        }, upsert=upsert)
        self.db.logs.insert_one({
            'action': 'update',
            'meme_id': objectid.ObjectId(_id),
            'log_time': datetime.datetime.utcnow(),
            'update_fields': _set
        })

    def get_contributors(self):
        '''Get all meme Owners'''
        return self.db.memes.aggregate([{"$group": {"_id": "$name", "count": {"$sum": 1}}}])

    def add_comment(self, _id, name, comment):
        '''Add comment to meme with specified id'''
        response = self.db.memes.update_one({'_id': objectid.ObjectId(_id)}, {
                                            '$push': {'comments': {'name': name, 'comment': comment}}})
        self.db.logs.insert_one({
            'action': 'comment',
            'meme_id': objectid.ObjectId(_id),
            'log_time': datetime.datetime.utcnow(),
            'comment_data': {'name': name, 'comment': comment}
        })
        return response
