import { pool } from '../config/db';

const updateSchema = async () => {
    try {
        console.log('Updating schema...');

        // Update HelpRequests attachments
        await pool.execute('ALTER TABLE HelpRequests MODIFY attachments MEDIUMTEXT');
        console.log('✅ HelpRequests table updated (attachments -> MEDIUMTEXT)');

        // Add email and password to Users
        try {
            await pool.execute('ALTER TABLE Users ADD COLUMN email VARCHAR(255) UNIQUE AFTER name');
            console.log('✅ Users table updated (added email)');
        } catch (e: any) {
            if (e.code === 'ER_DUP_COLUMN_NAME') console.log('ℹ️ Users.email already exists');
            else throw e;
        }

        try {
            await pool.execute('ALTER TABLE Users ADD COLUMN password VARCHAR(255) AFTER email');
            console.log('✅ Users table updated (added password)');
        } catch (e: any) {
            if (e.code === 'ER_DUP_COLUMN_NAME') console.log('ℹ️ Users.password already exists');
            else throw e;
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
};

updateSchema();
