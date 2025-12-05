from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta

studybot_bp = Blueprint('studybot', __name__)

@studybot_bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    reply = "I can help you create a study plan! Use the Quick Plan Creator on the right to get started."
    return jsonify({'reply': reply})

@studybot_bp.route('/plan', methods=['POST'])
def create_plan():
    data = request.json
    username = data.get('username')
    exam_name = data.get('examName')
    start_date = data.get('startDate')
    exam_date = data.get('examDate')
    daily_hours = data.get('dailyHours')
    topics = data.get('topics', [])
    
    start = datetime.strptime(start_date, '%Y-%m-%d')
    exam = datetime.strptime(exam_date, '%Y-%m-%d')
    total_days = (exam - start).days
    
    phases = [
        {'name': 'Foundation', 'startDay': 1, 'endDay': int(total_days * 0.4), 'focus': 'Learn basics and fundamentals'},
        {'name': 'Practice', 'startDay': int(total_days * 0.4) + 1, 'endDay': int(total_days * 0.8), 'focus': 'Solve problems and practice'},
        {'name': 'Revision', 'startDay': int(total_days * 0.8) + 1, 'endDay': total_days, 'focus': 'Review and mock tests'}
    ]
    
    daily_plan = []
    for i in range(1, min(total_days + 1, 11)):
        current_date = start + timedelta(days=i - 1)
        tasks = [f"Study {t['name']} ({daily_hours/2} hours)" for t in topics[:2]]
        daily_plan.append({
            'dayIndex': i,
            'date': current_date.strftime('%Y-%m-%d'),
            'tasks': tasks
        })
    
    plan = {
        'examName': exam_name,
        'startDate': start_date,
        'examDate': exam_date,
        'totalDays': total_days,
        'dailyHours': daily_hours,
        'topics': topics,
        'phases': phases,
        'dailyPlan': daily_plan
    }
    
    return jsonify({
        'message': f'Study plan created for {exam_name}! {total_days} days, {daily_hours} hours/day.',
        'plan': plan
    })
