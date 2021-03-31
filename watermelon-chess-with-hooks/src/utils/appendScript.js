const appendScript = (scriptToAppend) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptToAppend;
    document.body.appendChild(script);
};

export default appendScript;
