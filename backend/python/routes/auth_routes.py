from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import os
from models.user_model import create_user, find_user_by_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'error': 'All fields required'}), 400
    
    if find_user_by_email(email):
        return jsonify({'error': 'Email already registered'}), 400
    
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = create_user(username, email, password_hash)
    user_id = str(user['_id'])
    
    token = jwt.encode({
        'userId': user_id,
        'username': user['username'],
        'level': user['level']
    }, os.getenv('JWT_SECRET', 'codecade_secret_key'), algorithm='HS256')
    
    return jsonify({
        'message': 'User created successfully',
        'token': token,
        'user': {
            'id': user_id,
            'username': user['username'],
            'email': user['email'],
            'level': user['level'],
            'xp': user['xp']
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    user = find_user_by_email(email)
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    user_id = str(user['_id'])
    token = jwt.encode({
        'userId': user_id,
        'username': user['username'],
        'level': user['level']
    }, os.getenv('JWT_SECRET', 'codecade_secret_key'), algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user_id,
            'username': user['username'],
            'email': user['email'],
            'level': user['level'],
            'xp': user['xp'],
            'streak_days': user.get('streak_days', 0)
        }
    })

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logout successful'})
