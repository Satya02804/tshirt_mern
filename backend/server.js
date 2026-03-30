import app from './src/app.js';
import sequelize, { testConnection } from './src/config/database.js';
import './src/models/index.js'; // Import models to register associations

const PORT = process.env.APP_PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection
        const connected = await testConnection();

        if (!connected) {
            console.error('❌ Failed to connect to database. Exiting...');
            process.exit(1);
        }

        // Sync database schema with models (adds missing columns automatically)
        await sequelize.sync({ alter: true });
        console.log('✅ Database schema synced successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 Environment: ${process.env.APP_ENV || 'development'}`);
            console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
            console.log(`\nAvailable routes:`);
            console.log(`  - POST   /api/auth/register`);
            console.log(`  - POST   /api/auth/login`);
            console.log(`  - GET    /api/products`);
            console.log(`  - POST   /api/orders`);
            console.log(`  - GET    /api/dashboard/stats`);
            console.log(`\nPress Ctrl+C to stop the server\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
