const checkUserList = {
    ta: '/set',
    // teacher: `/grouping?date=${todayDate}`,
    teacher: `/select`,
};
const signIn = () => {
    const data = {
        userId: document.getElementById('userId').value,
    };
    fetch('/checkUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(async (response) => {
            if (!response.ok) {
                const error = await response.text();
                document.getElementById('error_signIn').innerHTML = error;
            } else {
                return response.json();
            }
        })
        .then((data) => {
            if (data.userId === 'ta' || data.userId === 'teacher') {
                localStorage.setItem('userId', data.userId);
                window.location = `/select`;
            } else {
                const teamId = data.userId;
                fetch('/findTeamName', {
                    method: 'post',
                    body: JSON.stringify({ teamId }),
                    headers: {
                        'content-type': 'application/json',
                    },
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((response) => {
                        localStorage.setItem('userId', response.teamId);
                        window.location = `/upload?teamId=${response.teamId}&teamName=${response.teamName}`;
                    })
                    .catch((error) => console.error('Error:', error));
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
