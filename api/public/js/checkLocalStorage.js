window.addEventListener('load', () => {
    if (checkLocalStorage()) {
        const userId = localStorage.getItem('userId');
    } else {
        alert('請重新登入');
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
