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
        if name:
            search_object['caption'] = caption
        return int(self.db.memes.count_documents(search_object))

    def insert_meme(self, name, url, caption):
        '''Insert meme document in Db'''
        return self.db.memes.insert_one({
            'name': name,
            'url': url,
            'caption': caption,
            'created': datetime.datetime.now(),
            'updated': datetime.datetime.now()
        })

    def find_memes(self, sort=[], skip=0, limit=100):
        '''Fetch memes from db. Apply skip, limit and sort operations'''
        if sort:
            return self.db.memes.find().sort(sort).skip(skip).limit(limit)
        return self.db.memes.find().skip(skip).limit(limit)

    def find_memes_by_id(self, _id):
        '''Fetch meme data by id'''
        return self.db.memes.find_one(
            {"_id": _id})

    def update_meme(self, _id, caption='', url='', upsert=False):
        '''Update meme caption and/or url'''
        _set = {}
        if caption:
            _set['caption'] = caption
        if url:
            _set['url'] = url
        _set['updated'] = datetime.datetime.now()
        self.db.memes.update_one({'_id': objectid.ObjectId(_id)}, {
            '$set': _set
        }, upsert=upsert)
