const testApi = async () => {
    try {
        const response = await fetch('http://localhost:3002/api/requests/my?user_id=1&role=Resident');
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
};
testApi();
