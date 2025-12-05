from flask import Blueprint, jsonify

lesson_bp = Blueprint('lesson', __name__)

@lesson_bp.route('/', methods=['GET'])
def get_lessons():
    return jsonify({'lessons': []})
