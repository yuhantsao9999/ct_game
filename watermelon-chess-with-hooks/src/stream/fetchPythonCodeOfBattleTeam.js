// const fetchPythonCodeStream = async (player) => {
//     const data = {
//         teamName: player,
//     };
//     try {
//         return fetch('/api/findOnePythonCode', {
//             method: 'post',
//             body: JSON.stringify(data),
//             headers: {
//                 'content-type': 'application/json',
//             },
//         })
//             .then((response) => {
//                 return response.json();
//             })
//             .then((response) => {
//                 return response.pythonCode;
//             })
//             .catch((error) => console.error('Error:', error));
//     } catch (error) {
//         return;
//     }
// };

// export default fetchPythonCodeStream;
