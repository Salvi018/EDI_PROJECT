from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
import os
import ssl

db = None
client = None

def connect_db():
    """
    Connect to MongoDB Atlas using connection string from MONGODB_URI environment variable.
    
    Expected format: mongodb+srv://username:password@cluster-name.mongodb.net/database_name?retryWrites=true&w=majority
    
    For local development, create a .env file with:
        MONGODB_URI=your_atlas_connection_string
    """
    global db, client
    try:
        uri = os.getenv('MONGODB_URI')
        if not uri:
            raise ValueError(
                'MONGODB_URI environment variable not set. '
                'Please configure your MongoDB Atlas connection string.'
            )
        
        # Configure SSL/TLS for MongoDB Atlas connection
        client = MongoClient(
            uri,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            tlsAllowInvalidCertificates=True,
            tlsAllowInvalidHostnames=True
        )
        # Verify connection
        client.admin.command('ping')
        
        db = client['codecade']
        print('✅ MongoDB Atlas connected successfully')
        return db
    except ServerSelectionTimeoutError:
        print('❌ Failed to connect to MongoDB Atlas: Connection timeout')
        print('   Check your connection string and network access settings')
        raise
    except ConnectionFailure as e:
        print(f'❌ MongoDB connection failed: {e}')
        raise
    except ValueError as e:
        print(f'❌ Configuration error: {e}')
        raise

def get_db():
    """Get the current database connection"""
    if db is None:
        raise RuntimeError('Database not connected. Call connect_db() first.')
    return db

def close_db():
    """Close the database connection"""
    global client
    if client:
        client.close()
        print('✅ MongoDB connection closed')
