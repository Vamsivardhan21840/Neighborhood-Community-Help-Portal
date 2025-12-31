import axios from 'axios';

const testMyRequests = async () => {
    try {
        // vamsi is ID 1 (Resident)
        // joe is ID 5 (Resident)
        const userId = 1;
        const role = 'Resident';

        console.log(`Fetching requests for User ID: ${userId}, Role: ${role}`);
        const response = await axios.get(`http://localhost:3001/api/requests/my?user_id=${userId}&role=${role}`);

        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

    } catch (error: any) {
        console.error('Error testing API:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
};

testMyRequests();
