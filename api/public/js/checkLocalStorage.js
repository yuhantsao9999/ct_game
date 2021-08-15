window.addEventListener('load', () => {
    //TODO:需要重構，建立好資料庫的帳號密碼資料、token 過期資料，要用資料庫檢查
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const teamId = urlParams.get('teamId');
    const authority = {
        '/select': 'teacher',
        '/set': 'teacher',
        '/start': 'teacher',
        '/grouping': 'teacher',
        '/upload': teamId,
    };
    const pathname = window.location.pathname;
    const userId = localStorage.getItem('userId');
    if (checkLocalStorage() && userId == authority[pathname]) {
        console.log('authority[pathname]', authority[pathname]);
    } else {
        alert('權限錯誤！請重新登入');
        window.location = './main';
    }
});

const logOut = () => {
    localStorage.removeItem('userId');
    window.location = './main';
};

const checkLocalStorage = () => {
    const userId = localStorage.getItem('userId');
    return userId !== null;
};
