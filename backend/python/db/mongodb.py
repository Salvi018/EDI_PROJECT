from pymongo import MongoClient
import os

db = None

def connect_db():
    global db
    uri = os.getenv('MONGODB_URI')
    client = MongoClient(uri)
    db = client['codecade']
    print('✅ MongoDB connected')
    return db

def get_db():
    return db
