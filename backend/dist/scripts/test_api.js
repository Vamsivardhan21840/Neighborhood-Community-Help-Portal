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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const testMyRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // vamsi is ID 1 (Resident)
        // joe is ID 5 (Resident)
        const userId = 1;
        const role = 'Resident';
        console.log(`Fetching requests for User ID: ${userId}, Role: ${role}`);
        const response = yield axios_1.default.get(`http://localhost:3001/api/requests/my?user_id=${userId}&role=${role}`);
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
    }
    catch (error) {
        console.error('Error testing API:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
});
testMyRequests();
