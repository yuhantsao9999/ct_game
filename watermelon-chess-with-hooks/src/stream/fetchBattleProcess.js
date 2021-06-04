const fetchBattleProcessStream = async (activityName, playerA, playerB) => {
    if (activityName && playerA && playerB) {
        const data = {
            activityName,
            playerA,
            playerB,
        };
        return fetch('/api/getBattleProcess', {
            mode: 'cors',
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                return response;
            })
            .catch((error) => console.error('Error:', error));
    }
};

export default fetchBattleProcessStream;
