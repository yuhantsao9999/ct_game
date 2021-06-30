const loginActivity = () => {
    const data = {
        activityName: document.getElementById('activityName').value,
    };
    fetch('/checkActivityExist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(async (response) => {
            if (!response.ok) {
                const error = await response.text();
                console.log(error);
                document.getElementById('error_Activity').innerHTML = error;
            } else {
                // window.location = `./grouping?id=${activityName}`;
                return response.json();
            }
        })
        .then((data) => {
            window.location = `./grouping?id=${data.activityName}`;
        })
        .catch((err) => {
            console.log(err);
        });
};
