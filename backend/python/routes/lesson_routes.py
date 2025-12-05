from flask import Blueprint, jsonify, request
from middleware.auth import auth_required
from models.lesson_model import complete_lesson, get_completed_lessons
from models.user_model import update_user_xp

lesson_bp = Blueprint('lesson', __name__)

@lesson_bp.route('/', methods=['GET'])
def get_lessons():
    return jsonify({'lessons': []})

@lesson_bp.route('/complete', methods=['POST'])
@auth_required
def mark_lesson_completed():
    data = request.json
    lesson_id = data.get('lessonId')
    xp_reward = data.get('xpReward', 5)
    
    if not lesson_id:
        return jsonify({'error': 'Lesson ID required'}), 400
    
    completed = complete_lesson(request.user_id, lesson_id)
    
    if not completed:
        return jsonify({'message': 'Lesson already completed'})
    
    user_stats = update_user_xp(request.user_id, xp_reward)
    
    return jsonify({
        'message': 'Lesson marked as completed',
        'completed': True,
        'level': user_stats['level'],
        'xp': user_stats['xp'],
        'xpGained': xp_reward
    })

@lesson_bp.route('/completed', methods=['GET'])
@auth_required
def get_all_completed_lessons():
    lessons = get_completed_lessons(request.user_id)
    return jsonify({'lessons': lessons, 'total': len(lessons)})
