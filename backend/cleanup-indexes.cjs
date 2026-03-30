const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'tshirt_store_node',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'Password@123',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
    }
);

async function cleanup() {
    try {
        const [results] = await sequelize.query(`
            SELECT INDEX_NAME 
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'tshirt_store_node'}' 
              AND TABLE_NAME = 'orders' 
              AND INDEX_NAME LIKE 'order_number_%'
        `);

        if (results.length === 0) {
            console.log('No redundant indexes found.');
            return;
        }

        console.log(`Found ${results.length} redundant indexes. Dropping...`);

        for (const row of results) {
            const indexName = row.INDEX_NAME;
            await sequelize.query(`ALTER TABLE orders DROP INDEX \`${indexName}\``);
            console.log(`Dropped index: ${indexName}`);
        }

        console.log('Cleanup complete.');
    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await sequelize.close();
    }
}

cleanup();
