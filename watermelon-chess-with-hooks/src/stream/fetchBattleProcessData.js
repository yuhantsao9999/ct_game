const fetchBattleProcessStream = async (pythonCodeData) => {
    console.log('do fetchBattleProcessStream');
    console.log('pythonCodeData', pythonCodeData);
    console.log('pythonCodeA', pythonCodeA);
    console.log('pythonCodeB', pythonCodeB);
    if (pythonCodeData) {
        const formData = new FormData();
        formData.append('pythonCodeData', JSON.stringify(pythonCodeData));
        fetch('http://140.122.164.194:5000/battle', {
            mode: 'cors',
            method: 'post',
            body: formData,
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                console.log('battle response', response);
                return response;
            })
            .catch((error) => console.error('Error:', error));
    }
};

export default fetchBattleProcessStream;
