const loginActivity = () => {
    const activityName = document.getElementById('activityName').value;
    fetch('/api/checkActivityExist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activityName: activityName }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const error = await response.text();
                console.log(error);
                document.getElementById('error_Activity').innerHTML = '無此活動名稱';
            } else {
                window.location = `./grouping?id=${activityName}`;
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
