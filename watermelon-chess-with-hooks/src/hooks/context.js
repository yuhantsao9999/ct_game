import * as React from 'react';
import { useState, createContext, useEffect } from 'react';
import { useFetchPythonCodeData } from './useFetchPythonCodeOfBattleTeam';
import { useFetchBattleProcessData } from './useFetchBattleProcessData';
import { useParams } from 'react-router-dom';

export const BattleProcessProviderContext = createContext(null);

export const BattleProcessProvider = ({ children }) => {
    const { playerA, playerB } = useParams();
    const [pythonCode, setPythonCodeOfBattleTeam] = useState('');
    const [battleProcess, setBattleProcess] = useState([]);

    const { result: pythonCodeData } = useFetchPythonCodeData(playerA, playerB);
    useEffect(() => {
        if (pythonCodeData.pythonCodeA !== '' && pythonCodeData.pythonCodeB !== '') {
            setPythonCodeOfBattleTeam(pythonCodeData);
        }
    }, [pythonCodeData]);

    const { result: battleProcessData } = useFetchBattleProcessData(pythonCode);

    useEffect(() => {
        if (battleProcessData) {
            console.log('battleProcessData', battleProcessData);
            setBattleProcess(battleProcessData);
        }
    }, [battleProcessData]);

    return (
        <BattleProcessProviderContext.Provider value={battleProcess}>{children}</BattleProcessProviderContext.Provider>
    );
};
