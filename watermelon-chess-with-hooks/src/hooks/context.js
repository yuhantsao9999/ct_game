import * as React from 'react';
import { useState, createContext, useEffect, useMemo } from 'react';
import { useFetchBattleProcess } from './useFetchBattleProcess';

export const BattleProcessContext = createContext({
    activityName: '',
    playerA: '',
    playerB: '',
    winner: '',
    process: [],
});

export const BattleProcessProvider = ({ children }) => {
    const [activityName, setActivityName] = useState('');
    const [playerA, setPlayerA] = useState('');
    const [playerB, setPlayerB] = useState('');
    const [result, setResult] = useState({
        activityName: '',
        playerA: '',
        playerB: '',
        winner: '',
        process: [],
    });

    const { result: processData } = useFetchBattleProcess(activityName, playerA, playerB);

    useEffect(() => {
        setResult(processData);
    }, [processData]);

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
