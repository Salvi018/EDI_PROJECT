from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_folder='../../frontend')
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'codecade_secret_key')
CORS(app)

# Connect to MongoDB Atlas
try:
    from db.mongodb import connect_db, close_db
    if os.getenv('MONGODB_URI'):
        connect_db()
    else:
        print('⚠️  Warning: MONGODB_URI not set. Database features will not work.')
        print('   Please configure your MongoDB Atlas connection string in .env')
except Exception as e:
    print(f'❌ MongoDB connection failed: {e}')
    print('   Please ensure your MongoDB Atlas is properly configured.')
    import sys
    sys.exit(1)

# Register blueprints
try:
    from routes.auth_routes import auth_bp
    from routes.user_routes import user_bp
    from routes.problem_routes import problem_bp
    from routes.lesson_routes import lesson_bp
    from routes.battle_routes import battle_bp
    from routes.studybot_routes import studybot_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(problem_bp, url_prefix='/problems')
    app.register_blueprint(problem_bp, url_prefix='/api/practice', name='practice')
    app.register_blueprint(lesson_bp, url_prefix='/lessons')
    app.register_blueprint(battle_bp, url_prefix='/battle')
    app.register_blueprint(studybot_bp, url_prefix='/studybot')
except Exception as e:
    print(f'Blueprint registration error: {e}')

@app.route('/health')
def health():
    return jsonify({'status': 'OK', 'message': 'CODECADE Backend Running'})

@app.route('/')
def index():
    return send_from_directory('../../frontend/pages', 'index.html')

@app.route('/pages/<path:filename>')
def serve_pages(filename):
    return send_from_directory('../../frontend/pages', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('../../frontend/js', filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('../../frontend/assets', filename)

@app.route('/<path:filename>')
def serve_static(filename):
    if filename.endswith('.html'):
        return send_from_directory('../../frontend/pages', filename)
    return send_from_directory('../../frontend', filename)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
