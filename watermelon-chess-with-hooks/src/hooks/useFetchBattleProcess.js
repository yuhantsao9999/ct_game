import { useEffect, useState } from 'react';
import fetchBattleDataStream from '../stream/fetchBattleProcess';

export const useFetchBattleData = (activityName, playerA, playerB) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState({ winner: '', process: [] });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBattleProcess = async () => {
            setIsLoading(true);
            try {
                const battleProcessResult = await fetchBattleDataStream(activityName, playerA, playerB).then(
                    (response) => response
                );
                setResult(battleProcessResult);
            } catch (error) {
                setError(error);
            }
            setIsLoading(false);
        };
        if (activityName && playerA && playerB) {
            fetchBattleProcess();
        }
    }, [activityName, playerA, playerB]);

    return { isLoading, result, error };
};
