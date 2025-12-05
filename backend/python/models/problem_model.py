from db.mongodb import get_db
from bson import ObjectId
from datetime import datetime

def solve_problem(user_id, problem_id, attempts, time_taken):
    db = get_db()
    solved = {
        'user_id': ObjectId(user_id),
        'problem_id': problem_id,
        'attempts': attempts,
        'time_taken': time_taken,
        'solved_at': datetime.utcnow()
    }
    result = db.solved_problems.insert_one(solved)
    solved['_id'] = result.inserted_id
    return solved

def get_solved_problems(user_id):
    db = get_db()
    problems = list(db.solved_problems.find({'user_id': ObjectId(user_id)}))
    return problems
