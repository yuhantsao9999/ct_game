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
                console.log('checkUser data.userId', data.userId);
                localStorage.setItem('userId', data.userId);
                window.location = `/upload?userId=${data.userId}`;
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
