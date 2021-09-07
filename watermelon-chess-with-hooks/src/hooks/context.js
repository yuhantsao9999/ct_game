import * as React from 'react';
import { useState, createContext, useEffect, useMemo } from 'react';
import { blackBoxData } from '../constant/chessIndex';
import { useFetchBattleData } from './useFetchBattleProcess';

//建立對戰過程的 context
export const BattleProcessContext = createContext({
    activityName: '',
    playerA: '',
    playerB: '',
    result: {
        winner: '',
        process: [],
    },
    totalSteps: -1,
});

export const BattleProcessProvider = ({ children }) => {
    const [activityName, setActivityName] = useState('');
    const [playerA, setPlayerA] = useState('');
    const [playerB, setPlayerB] = useState('');
    const [result, setResult] = useState({
        winner: '',
        process: [],
    });
    //dummydata 就是 blackBoxData
    // const processResult = blackBoxData;
    const { result: processResult } = useFetchBattleData(activityName, playerA, playerB);
    useEffect(() => {
        setResult({ process: processResult.process, winner: processResult.winner });
    }, [processResult]);

    const context = useMemo(
        () => ({
            activityName,
            playerA,
            playerB,
            result,
            setActivityName,
            setPlayerA,
            setPlayerB,
            setResult,
        }),
        [activityName, playerA, playerB, result]
    );
    return <BattleProcessContext.Provider value={context}>{children}</BattleProcessContext.Provider>;
};

//建立淘汰棋的 Context
export const ContextStore = createContext(null);

export const ContextStoreProvider = ({ children }) => {
    const [red, setRed] = useState([]);
    const [yellow, setYellow] = useState([]);

    const context = {
        red,
        setRed,
        yellow,
        setYellow,
    };

    return <ContextStore.Provider value={context}>{children}</ContextStore.Provider>;
};

//建立速度的 Context
export const SliderContext = createContext(null);

export const SliderContextProvider = ({ children }) => {
    const [speed, setSpeed] = useState(1000);
    const [specifedStep, setSpecifedStep] = useState(0);

    const context = {
        speed,
        setSpeed,
        specifedStep,
        setSpecifedStep,
    };

    return <SliderContext.Provider value={context}>{children}</SliderContext.Provider>;
};
