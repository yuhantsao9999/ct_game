const signIn = () => {
    const data = {
        userId: document.getElementById('userId').value,
    };
    if (data.userId === 'teacher') {
        localStorage.setItem('userId', data.userId);
        window.location = `/select`;
    } else {
        fetch('/signIn', {
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
                localStorage.setItem('userId', response.userId);
                window.location = `/upload?teamId=${response.userId}&activityName=${response.activityName}&teamName=${response.teamName}`;
            })
            .catch((error) => console.error('Error:', error));
    }
};
