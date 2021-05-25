import { useState, useEffect } from 'react';
import fetchBattleProcessStream from '../stream/fetchBattleProcessData';

export const useFetchBattleProcessData = (pythonCodeData) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBattleProcessData = async () => {
            setIsLoading(true);

            try {
                const fetchBattleProcessDataResult = await fetchBattleProcessStream({
                    pythonCodeData,
                });
                setResult(fetchBattleProcessDataResult);
            } catch (error) {
                setError(error);
            }
            setIsLoading(false);
        };
        if (pythonCodeData) {
            fetchBattleProcessData();
        }
    }, [pythonCodeData]);

    return { isLoading, result, error };
};
