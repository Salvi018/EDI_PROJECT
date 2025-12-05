from flask import Blueprint, jsonify

battle_bp = Blueprint('battle', __name__)

@battle_bp.route('/queue', methods=['POST'])
def join_queue():
    return jsonify({'message': 'Joined battle queue'})
