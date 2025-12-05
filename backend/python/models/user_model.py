from db.mongodb import get_db
from bson import ObjectId
from datetime import datetime

def create_user(username, email, password_hash):
    db = get_db()
    user = {
        'username': username,
        'email': email,
        'password_hash': password_hash,
        'level': 1,
        'xp': 0,
        'streak_days': 0,
        'college': '',
        'battle_rating': 1200,
        'battle_wins': 0,
        'battle_losses': 0,
        'created_at': datetime.utcnow()
    }
    result = db.users.insert_one(user)
    user['_id'] = result.inserted_id
    return user

def find_user_by_email(email):
    db = get_db()
    return db.users.find_one({'email': email})

def find_user_by_id(user_id):
    db = get_db()
    return db.users.find_one({'_id': ObjectId(user_id)})

def update_user_xp(user_id, xp_gained):
    db = get_db()
    user = find_user_by_id(user_id)
    new_xp = (user.get('xp', 0) or 0) + xp_gained
    new_level = new_xp // 100 + 1
    db.users.update_one({'_id': ObjectId(user_id)}, {'$set': {'xp': new_xp, 'level': new_level}})
    return {'level': new_level, 'xp': new_xp}

def update_streak(user_id):
    db = get_db()
    user = find_user_by_id(user_id)
    today = datetime.utcnow().date()
    last_active = user.get('last_active')
    streak_days = user.get('streak_days', 0)
    
    if last_active:
        last_date = last_active.date() if isinstance(last_active, datetime) else last_active
        if last_date != today:
            from datetime import timedelta
            yesterday = today - timedelta(days=1)
            if last_date == yesterday:
                streak_days += 1
            else:
                streak_days = 1
    else:
        streak_days = 1
    
    db.users.update_one({'_id': ObjectId(user_id)}, {'$set': {'streak_days': streak_days, 'last_active': datetime.utcnow()}})
    return {'streak_days': streak_days}

def delete_user(user_id):
    db = get_db()
    db.users.delete_one({'_id': ObjectId(user_id)})
    return {'success': True}
