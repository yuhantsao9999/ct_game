const fetchBattleDataStream = async (activityName, playerA, playerB) => {
    if (activityName && playerA && playerB) {
        const data = {
            activityName,
            playerA,
            playerB,
            game: '西瓜棋',
        };
        return fetch('/api/getBattleData', {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                console.log('response in fetchBattleDataStream', response);
                return response;
            })
            .catch((error) => console.error('Error:', error));
    }
};

export default fetchBattleDataStream;
