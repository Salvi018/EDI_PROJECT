from flask import Blueprint, jsonify

problem_bp = Blueprint('problem', __name__)

@problem_bp.route('/', methods=['GET'])
def get_problems():
    return jsonify({'problems': []})

@problem_bp.route('/<problem_id>', methods=['GET'])
def get_problem(problem_id):
    return jsonify({'problem': {}})
