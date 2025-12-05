from flask import Blueprint, request, jsonify
from middleware.auth import auth_required
from models.user_model import find_user_by_id, update_streak, delete_user
from models.problem_model import get_solved_problems
from models.lesson_model import get_completed_lessons

user_bp = Blueprint('user', __name__)

@user_bp.route('/stats', methods=['GET'])
@auth_required
def get_user_stats():
    user = find_user_by_id(request.user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    update_streak(request.user_id)
    user = find_user_by_id(request.user_id)
    
    return jsonify({
        'level': user['level'],
        'xp': user['xp'],
        'streak_days': user.get('streak_days', 0),
        'username': user['username'],
        'college': user.get('college', '')
    })

@user_bp.route('/progress', methods=['GET'])
@auth_required
def get_user_progress():
    solved_problems = get_solved_problems(request.user_id)
    completed_lessons = get_completed_lessons(request.user_id)
    
    return jsonify({
        'solvedProblems': solved_problems,
        'completedLessons': completed_lessons,
        'totalSolved': len(solved_problems),
        'totalLessons': len(completed_lessons)
    })

@user_bp.route('/profile', methods=['DELETE'])
@auth_required
def delete_user_profile():
    delete_user(request.user_id)
    return jsonify({'message': 'Profile deleted successfully'})
