from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os

from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.problem_routes import problem_bp
from routes.lesson_routes import lesson_bp
from routes.battle_routes import battle_bp
from db.mongodb import connect_db

load_dotenv()

app = Flask(__name__, static_folder='../../frontend')
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'codecade_secret_key')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Connect to MongoDB
if os.getenv('DB_TYPE') == 'mongodb' or os.getenv('MONGODB_URI'):
    connect_db()

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(problem_bp, url_prefix='/problems')
app.register_blueprint(problem_bp, url_prefix='/api/practice')
app.register_blueprint(lesson_bp, url_prefix='/lessons')
app.register_blueprint(battle_bp, url_prefix='/battle')

# Health check
@app.route('/health')
def health():
    return jsonify({'status': 'OK', 'message': 'CODECADE Backend Running'})

# Serve frontend
@app.route('/')
def index():
    return send_from_directory('../../frontend/pages', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    if filename.endswith('.html'):
        return send_from_directory('../../frontend/pages', filename)
    return send_from_directory('../../frontend', filename)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    socketio.run(app, host='0.0.0.0', port=port, debug=False)
