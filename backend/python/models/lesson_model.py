from db.mongodb import get_db
from bson import ObjectId
from datetime import datetime

def complete_lesson(user_id, lesson_id):
    db = get_db()
    existing = db.completed_lessons.find_one({'user_id': ObjectId(user_id), 'lesson_id': lesson_id})
    if existing:
        return None
    
    completed = {
        'user_id': ObjectId(user_id),
        'lesson_id': lesson_id,
        'completed_at': datetime.utcnow()
    }
    result = db.completed_lessons.insert_one(completed)
    completed['_id'] = result.inserted_id
    return completed

def get_completed_lessons(user_id):
    db = get_db()
    lessons = list(db.completed_lessons.find({'user_id': ObjectId(user_id)}))
    return lessons
