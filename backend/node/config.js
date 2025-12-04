// CODECADE Backend Configuration
// Switch between PostgreSQL and CSV-based storage

module.exports = {
  // Database type: 'postgres' or 'csv'
  DB_TYPE: process.env.DB_TYPE || 'csv',
  
  // Server configuration
  PORT: process.env.PORT || 8080,
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'codecade_secret_key_change_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // Bcrypt configuration
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  
  // PostgreSQL configuration (if using postgres)
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'codecade',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  
  // File paths (if using csv)
  DATA_DIR: process.env.DATA_DIR || '../../database/codecade_db'
};
