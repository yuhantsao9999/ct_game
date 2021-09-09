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
            .then(async (response) => {
                if (!response.ok) {
                    document.getElementById('error_signIn').innerHTML = '無此使用者代碼';
                } else {
                    return response.json();
                }
            })
            .then(async (response) => {
                localStorage.setItem('userId', response.userId);
                window.location = `/upload?teamId=${response.userId}&activityName=${response.activityName}&teamName=${response.teamName}`;
            })
            .catch((error) => console.error('Error:', error));
    }
};
