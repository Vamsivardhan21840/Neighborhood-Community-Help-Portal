"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const updateSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Updating schema...');
        // Update HelpRequests attachments
        yield db_1.pool.execute('ALTER TABLE HelpRequests MODIFY attachments MEDIUMTEXT');
        console.log('✅ HelpRequests table updated (attachments -> MEDIUMTEXT)');
        // Add email and password to Users
        try {
            yield db_1.pool.execute('ALTER TABLE Users ADD COLUMN email VARCHAR(255) UNIQUE AFTER name');
            console.log('✅ Users table updated (added email)');
        }
        catch (e) {
            if (e.code === 'ER_DUP_COLUMN_NAME')
                console.log('ℹ️ Users.email already exists');
            else
                throw e;
        }
        try {
            yield db_1.pool.execute('ALTER TABLE Users ADD COLUMN password VARCHAR(255) AFTER email');
            console.log('✅ Users table updated (added password)');
        }
        catch (e) {
            if (e.code === 'ER_DUP_COLUMN_NAME')
                console.log('ℹ️ Users.password already exists');
            else
                throw e;
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
});
updateSchema();
