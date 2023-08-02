from pymongo import MongoClient
import datetime
from django.conf import settings

client = MongoClient(getattr(settings, 'MONGO_HOST', None), getattr(settings, 'MONGO_PORT', None))
db = client.pirotchatdb

def test():
    bubble_collection = db.bubble

    bubble = {
        "user": "Mike",
        "room": "b123",
        "content": 'hello mongo',
        "is_delete": 0,
        "read_cnt": 2,
        "created_at": datetime.datetime.now(tz=datetime.timezone.utc),
        "updated_at": datetime.datetime.now(tz=datetime.timezone.utc),
    }

    bubble_id = bubble_collection.insert_one(bubble).inserted_id
    print(bubble_id)