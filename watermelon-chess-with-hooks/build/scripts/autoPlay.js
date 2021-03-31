window.onload = () => {
    const play = document.getElementById('play');
    const stop = document.getElementById('stop');
    const restart = document.getElementById('restart');
    play.setAttribute('onclick', 'play(speed)');
    stop.setAttribute('onclick', 'stop()');
    restart.setAttribute('onclick', 'restart()');
};
const timer = [];
let currentStep = 0;

const restart = () => {
    currentStep = 0;
};

const click = (next) => {
    next.click();
    currentStep = currentStep + 1;
};

const play = () => {
    console.log('speed: ', document.getElementById('speed').value);
    const step =
        document.getElementById('step').value <= 8 && document.getElementById('step').value > 0
            ? document.getElementById('step').value
            : 8;
    if (step <= 8)
        for (let i = currentStep; i < step * 2; i++) {
            const next = document.getElementById('next');
            timer.push(setTimeout(click, document.getElementById('speed').value * i, next));
        }
};

const stop = () => {
    timer.map((timer) => clearTimeout(timer));
};
