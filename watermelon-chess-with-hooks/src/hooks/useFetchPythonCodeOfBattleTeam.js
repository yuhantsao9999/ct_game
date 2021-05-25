import { useState, useEffect } from 'react';
import fetchPythonCodeStream from '../stream/fetchPythonCodeOfBattleTeam';

export const useFetchPythonCodeData = (playerA, playerB) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState({ pythonCodeA: '', pythonCodeB: '' });
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchPythonCodeData = async () => {
            setIsLoading(true);

            try {
                const fetchPythonCodeDataResultOfPlayerA = await fetchPythonCodeStream(playerA).then(
                    (response) => response
                );
                const fetchPythonCodeDataResultOfPlayerB = await fetchPythonCodeStream(playerB).then(
                    (response) => response
                );
                setResult({
                    pythonCodeA: fetchPythonCodeDataResultOfPlayerA,
                    pythonCodeB: fetchPythonCodeDataResultOfPlayerB,
                });
            } catch (error) {
                setError(error);
            }
            setIsLoading(false);
        };
        if (playerA && playerB) {
            fetchPythonCodeData();
        }
    }, [playerA, playerB]);

    return { isLoading, result, error };
};
