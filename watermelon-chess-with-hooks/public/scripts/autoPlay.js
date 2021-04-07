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
const speedIndex = {
    2: 250,
    1: 500,
};

const play = () => {
    // console.log('step: ', document.getElementById('step').innerHTML);
    // console.log('speed2: ', speedIndex[document.getElementById('speed').innerHTML]);
    // <option value="1000">-- 速度 --</option>
    // <option value="2000">0.25</option>
    // <option value="1500">0.5</option>
    // <option value="1000">1</option>
    // <option value="500">1.5</option>
    // <option value="250">2</option>
    const step =
        document.getElementById('step').innerHTML <= 100 && document.getElementById('step').innerHTML > 0
            ? document.getElementById('step').innerHTML
            : 100;
    if (step <= 100)
        for (let i = currentStep; i < step * 2; i++) {
            const next = document.getElementById('next');
            timer.push(setTimeout(click, speedIndex[document.getElementById('speed').innerHTML] * i, next));
        }
};

const stop = () => {
    timer.map((timer) => clearTimeout(timer));
};
