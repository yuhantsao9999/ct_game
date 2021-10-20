//顯示所選取的檔案名稱
const fileInput = document.querySelector('.button-wrapper');
function processSelectedFiles(fileInput) {
    var files = fileInput.files;
    document.getElementById('file-return').innerHTML = files[0].name;
}

//獲得隨機對手 python code
const fetchPretestOpponentCode = async () => {
    try {
        return fetch('/api/getPretestOpponentCode', {
            mode: 'cors',
            method: 'post',
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                return response.pythonCode;
            })
            .catch(async (error) => {
                console.error('Error:', error);
            });
    } catch (error) {
        return;
    }
};

//獲得對戰過程
const fetchBattleProcess = async (pythonCodeData) => {
    if (pythonCodeData) {
        const formData = new FormData();
        formData.append('pythonCodeData', JSON.stringify(pythonCodeData));
        try {
            return fetch('http:140.122.164.194:5000/battle', {
                mode: 'cors',
                method: 'post',
                body: formData,
            })
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    return response;
                })
                .catch(async (error) => {
                    console.error('Error:', error);
                    return await fetchBattleProcess(pythonCodeData);
                });
        } catch (error) {
            return;
        }
    }
};

//將本次上傳檔案的 python code 輸入資料庫中
const insertPretestPythonCode = async (code) => {
    if (code) {
        try {
            return fetch('/api/insertPretestPythonCode', {
                method: 'POST',
                body: JSON.stringify({
                    pythonCode: code,
                }),
                headers: {
                    'content-type': 'application/json',
                },
            })
                .then((response) => {
                    console.log('response', response);
                    return response;
                })
                .catch(async (error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            return;
        }
    }
};

//進行檔案上傳與挑戰
const uploadTeamFile = async () => {
    const input = document.querySelector('input[type="file"]');
    const formDataforUpload = new FormData();
    for (file of input.files) {
        formDataforUpload.append('files', file, file.name);
    }
    //取得檔案轉換出的 xml
    fetch('http:140.122.164.194:5000/upload', {
        mode: 'cors',
        method: 'post',
        body: formDataforUpload,
    })
        .then((response) => {
            console.log('upload response', response);
            if (response.status !== 200) {
                throw error;
            }
            return response.text();
        })
        .then((response) => {
            let xml, code;
            try {
                xml = Blockly.Xml.textToDom(response);
            } catch (e) {
                console.log('xml error', e);
            }

            const demoWorkspace = new Blockly.Workspace();
            Blockly.Xml.domToWorkspace(xml, demoWorkspace);

            code = Blockly.Python.workspaceToCode(demoWorkspace);

            const pretestOpponentCode = await fetchPretestOpponentCode().then((response) => {
                return response;
            });
            // const code =
            //     'C0C1 = None\nC2C3 = None\nC4C5 = None\n\n\nfor C0C1 in board[yellow_player]:\n  if C0C1 != 0:\n    for C2C3 in Neighbor(C0C1):\n      if Exist_Chess(C2C3) == 0:\n        score = (score + 20)\n      elif Exist_Chess(C2C3) == 2:\n        score = (score + 15)\n      else:\n        score = (score - 20)\n';
            if (code === '') {
                throw error;
            }
            const pythonCodeData = {
                pythonCodeA: pretestOpponentCode,
                pythonCodeB: code,
            };
            const newFormData = new FormData();
            newFormData.append('pythonCodeData', JSON.stringify(pythonCodeData));
            //取得對戰過程;
            const fetchBattleProcessDataResult = await fetchBattleProcess(pythonCodeData).then((response) => {
                return response;
            });
            // Hint: fetchBattleProcessDataResult 上方是線上版，下方是測試資料
            // const fetchBattleProcessDataResult = {
            //     process: [
            //         {
            //             step: 1,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 5, 13],
            //                 [15, 17, 18, 19, 20, 21],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 2,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 5, 13],
            //                 [15, 14, 18, 19, 20, 21],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 3,
            //             moving: 'Red',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 5, 17],
            //                 [15, 14, 18, 19, 20, 21],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 4,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 5, 17],
            //                 [15, 14, 16, 19, 20, 21],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 5,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 9, 17],
            //                 [15, 14, 16, 19, 20, 21],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 6,
            //             moving: 'Yellow',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 9, 17],
            //                 [15, 13, 16, 19, 20, 21],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 7,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 9, 17],
            //                 [15, 13, 16, 19, 20, 21],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 8,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 9, 17],
            //                 [15, 13, 11, 19, 20, 21],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 9,
            //             moving: 'Red',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 9, 14],
            //                 [15, 13, 11, 19, 20, 21],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 10,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 9, 14],
            //                 [8, 13, 11, 19, 20, 21],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 11,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 15, 14],
            //                 [8, 13, 11, 19, 20, 21],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 12,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 15, 14],
            //                 [8, 13, 11, 19, 17, 21],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 13,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 14],
            //                 [8, 13, 11, 19, 17, 21],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 14,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 14],
            //                 [8, 13, 6, 19, 17, 21],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 15,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 17, 21],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 16,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 17, 20],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 17,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 17, 20],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 18,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 14, 20],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 19,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 14, 20],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 20,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 14, 18],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 21,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 14, 18],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 22,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 15, 7],
            //                 [5, 13, 6, 19, 14, 18],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 23,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [2, 9, 1, 4, 15, 7],
            //                 [5, 13, 6, 19, 14, 18],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 24,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 9, 1, 4, 15, 7],
            //                 [5, 13, 6, 21, 14, 18],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 25,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 15, 7],
            //                 [5, 13, 6, 21, 14, 18],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 26,
            //             moving: 'Yellow',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 21, 14, 18],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 27,
            //             moving: 'Red',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 19, 7],
            //                 [8, 13, 6, 21, 14, 18],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 28,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 19, 7],
            //                 [8, 13, 6, 21, 14, 20],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 29,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 9, 3, 1, 19, 7],
            //                 [8, 13, 6, 21, 14, 20],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 30,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [2, 9, 3, 1, 19, 7],
            //                 [8, 12, 6, 21, 14, 20],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 31,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 9, 3, 1, 19, 7],
            //                 [8, 12, 6, 21, 14, 20],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 32,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 9, 3, 1, 19, 7],
            //                 [15, 12, 6, 21, 14, 20],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 33,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 9, 3, 2, 19, 7],
            //                 [15, 12, 6, 21, 14, 20],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 34,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 9, 3, 2, 19, 7],
            //                 [15, 12, 6, 18, 14, 20],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 35,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 7],
            //                 [15, 12, 6, 18, 14, 20],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 36,
            //             moving: 'Yellow',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 7],
            //                 [15, 12, 6, 18, 13, 20],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 37,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 14],
            //                 [15, 12, 6, 18, 13, 20],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 38,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 14],
            //                 [15, 16, 6, 18, 13, 20],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 39,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 17],
            //                 [15, 16, 6, 18, 13, 20],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 40,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 17],
            //                 [15, 16, 11, 18, 13, 20],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 41,
            //             moving: 'Red',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 14],
            //                 [15, 16, 11, 18, 13, 20],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 42,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 14],
            //                 [15, 12, 11, 18, 13, 20],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 43,
            //             moving: 'Red',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 21, 14],
            //                 [15, 12, 11, 18, 13, 20],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 44,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 21, 14],
            //                 [15, 12, 11, 18, 13, 17],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 45,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 21, 7],
            //                 [15, 12, 11, 18, 13, 17],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 46,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 21, 7],
            //                 [15, 12, 11, 18, 13, 20],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 47,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 9, 1, 5, 21, 7],
            //                 [15, 12, 11, 18, 13, 20],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 48,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 9, 1, 5, 21, 7],
            //                 [15, 12, 11, 19, 13, 20],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 49,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 5, 21, 14],
            //                 [15, 12, 11, 19, 13, 20],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 50,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 9, 1, 5, 21, 14],
            //                 [8, 12, 11, 19, 13, 20],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 51,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 9, 1, 5, 21, 14],
            //                 [8, 12, 11, 19, 13, 20],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 52,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [6, 9, 1, 5, 21, 14],
            //                 [8, 12, 11, 19, 7, 20],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 53,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 9, 1, 5, 21, 13],
            //                 [8, 12, 11, 19, 7, 20],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 54,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 9, 1, 5, 21, 13],
            //                 [8, 16, 11, 19, 7, 20],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 55,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 10, 1, 5, 21, 13],
            //                 [8, 16, 11, 19, 7, 20],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 56,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 10, 1, 5, 0, 13],
            //                 [8, 18, 11, 19, 7, 20],
            //             ],
            //             movingTo: 18,
            //             kill: [21],
            //         },
            //         {
            //             step: 57,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 10, 1, 5, 0, 13],
            //                 [8, 18, 11, 19, 7, 20],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 58,
            //             moving: 'Yellow',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 10, 1, 5, 0, 13],
            //                 [8, 18, 11, 19, 3, 20],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 59,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 10, 2, 5, 0, 13],
            //                 [8, 18, 11, 19, 3, 20],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 60,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 10, 2, 5, 0, 13],
            //                 [9, 18, 11, 19, 3, 20],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 61,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [1, 10, 2, 5, 0, 13],
            //                 [9, 18, 11, 19, 3, 20],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 62,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [1, 10, 2, 5, 0, 13],
            //                 [9, 18, 11, 21, 3, 20],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 63,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 10, 4, 5, 0, 13],
            //                 [9, 18, 11, 21, 3, 20],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 64,
            //             moving: 'Yellow',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [1, 10, 4, 5, 0, 13],
            //                 [9, 18, 11, 21, 7, 20],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 65,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 10, 3, 5, 0, 13],
            //                 [9, 18, 11, 21, 7, 20],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 66,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [1, 10, 3, 5, 0, 13],
            //                 [9, 18, 11, 19, 7, 20],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 67,
            //             moving: 'Red',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 6, 3, 5, 0, 13],
            //                 [9, 18, 11, 19, 7, 20],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 68,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 6, 3, 5, 0, 13],
            //                 [9, 16, 11, 19, 7, 20],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 69,
            //             moving: 'Red',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 6, 3, 5, 0, 14],
            //                 [9, 16, 11, 19, 7, 20],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 70,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 6, 3, 5, 0, 14],
            //                 [9, 16, 10, 19, 7, 20],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 71,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 4, 3, 5, 0, 14],
            //                 [9, 16, 10, 19, 7, 20],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 72,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [1, 4, 3, 5, 0, 14],
            //                 [9, 16, 10, 18, 7, 20],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 73,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [2, 4, 3, 5, 0, 14],
            //                 [9, 16, 10, 18, 7, 20],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 74,
            //             moving: 'Yellow',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [2, 4, 3, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 20],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 75,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [2, 4, 1, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 20],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 76,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [2, 4, 1, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 21],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 77,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [2, 3, 1, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 21],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 78,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 3, 1, 5, 0, 14],
            //                 [9, 16, 10, 20, 13, 21],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 79,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [2, 7, 1, 5, 0, 14],
            //                 [9, 16, 10, 20, 13, 21],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 80,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 7, 1, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 21],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 81,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [2, 7, 3, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 21],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 82,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [2, 7, 3, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 19],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 83,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 7, 3, 8, 0, 14],
            //                 [9, 16, 10, 18, 13, 19],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 84,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [2, 7, 3, 8, 0, 14],
            //                 [5, 16, 10, 18, 13, 19],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 85,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [2, 7, 1, 8, 0, 14],
            //                 [5, 16, 10, 18, 13, 19],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 86,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [2, 7, 1, 8, 0, 14],
            //                 [5, 12, 10, 18, 13, 19],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 87,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 7, 1, 9, 0, 14],
            //                 [5, 12, 10, 18, 13, 19],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 88,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [2, 7, 1, 9, 0, 14],
            //                 [5, 12, 10, 18, 17, 19],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 89,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 14],
            //                 [5, 12, 10, 18, 17, 19],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 90,
            //             moving: 'Yellow',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 14],
            //                 [8, 12, 10, 18, 17, 19],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 91,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 13],
            //                 [8, 12, 10, 18, 17, 19],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 92,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 13],
            //                 [8, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 93,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [3, 7, 1, 9, 0, 13],
            //                 [8, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 94,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [3, 7, 1, 9, 0, 13],
            //                 [8, 12, 10, 16, 20, 19],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 95,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 13],
            //                 [8, 12, 10, 16, 20, 19],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 96,
            //             moving: 'Yellow',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 13],
            //                 [8, 12, 6, 16, 20, 19],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 97,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 7, 2, 9, 0, 13],
            //                 [8, 12, 6, 16, 20, 19],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 98,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 7, 2, 9, 0, 13],
            //                 [8, 12, 6, 16, 21, 19],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 99,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [8, 12, 6, 16, 21, 19],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 100,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [8, 12, 6, 11, 21, 19],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 101,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [4, 14, 2, 5, 0, 13],
            //                 [8, 12, 6, 11, 21, 19],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 102,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 14, 2, 5, 0, 13],
            //                 [8, 12, 6, 16, 21, 19],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 103,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [8, 12, 6, 16, 21, 19],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 104,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [8, 12, 6, 16, 21, 15],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 105,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 2, 5, 0, 13],
            //                 [8, 12, 6, 16, 21, 15],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 106,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 14, 2, 5, 0, 13],
            //                 [8, 12, 6, 18, 21, 15],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 107,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [3, 14, 2, 5, 0, 13],
            //                 [8, 12, 6, 18, 21, 15],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 108,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [3, 14, 2, 5, 0, 13],
            //                 [8, 11, 6, 18, 21, 15],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 109,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [3, 7, 2, 5, 0, 13],
            //                 [8, 11, 6, 18, 21, 15],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 110,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [3, 7, 2, 5, 0, 13],
            //                 [8, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 111,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [1, 7, 2, 5, 0, 13],
            //                 [8, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 112,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [1, 7, 2, 5, 0, 13],
            //                 [15, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 113,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [15, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 114,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [9, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 115,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 7, 2, 8, 0, 13],
            //                 [9, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 116,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 7, 2, 8, 0, 13],
            //                 [9, 11, 10, 18, 21, 19],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 117,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [9, 11, 10, 18, 21, 19],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 118,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [15, 11, 10, 18, 21, 19],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 119,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [3, 7, 2, 5, 0, 13],
            //                 [15, 11, 10, 18, 21, 19],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 120,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [3, 7, 2, 5, 0, 13],
            //                 [15, 16, 10, 18, 21, 19],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 121,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [3, 14, 2, 5, 0, 13],
            //                 [15, 16, 10, 18, 21, 19],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 122,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [3, 14, 2, 5, 0, 13],
            //                 [15, 16, 10, 18, 20, 19],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 123,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [3, 14, 1, 5, 0, 13],
            //                 [15, 16, 10, 18, 20, 19],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 124,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [3, 14, 1, 5, 0, 13],
            //                 [15, 16, 10, 18, 20, 21],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 125,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [3, 14, 1, 8, 0, 13],
            //                 [15, 16, 10, 18, 20, 21],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 126,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [3, 14, 1, 8, 0, 13],
            //                 [15, 16, 10, 18, 20, 19],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 127,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 14, 1, 8, 0, 13],
            //                 [15, 16, 10, 18, 20, 19],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 128,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [4, 14, 1, 8, 0, 13],
            //                 [15, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 129,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [15, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 130,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [9, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 131,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 13],
            //                 [9, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 132,
            //             moving: 'Yellow',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 13],
            //                 [9, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 133,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [9, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 134,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [8, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 135,
            //             moving: 'Red',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 17],
            //                 [8, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 136,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 17],
            //                 [15, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 137,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 17],
            //                 [15, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 138,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 17],
            //                 [15, 12, 11, 18, 21, 19],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 139,
            //             moving: 'Red',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 20],
            //                 [15, 12, 11, 18, 21, 19],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 140,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 20],
            //                 [9, 12, 11, 18, 21, 19],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 141,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [4, 7, 3, 5, 0, 20],
            //                 [9, 12, 11, 18, 21, 19],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 142,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 7, 3, 5, 0, 20],
            //                 [9, 12, 11, 16, 21, 19],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 143,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 20],
            //                 [9, 12, 11, 16, 21, 19],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 144,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 20],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 145,
            //             moving: 'Red',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 17],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 146,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 17],
            //                 [9, 12, 11, 16, 21, 19],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 147,
            //             moving: 'Red',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 14],
            //                 [9, 12, 11, 16, 21, 19],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 148,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 14],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 149,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 14],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 150,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 14],
            //                 [9, 13, 11, 16, 21, 18],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 151,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 17],
            //                 [9, 13, 11, 16, 21, 18],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 152,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 17],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 153,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 14, 3, 5, 0, 17],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 154,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 14, 3, 5, 0, 17],
            //                 [10, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 155,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 17],
            //                 [10, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 156,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 17],
            //                 [10, 13, 11, 16, 21, 15],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 157,
            //             moving: 'Red',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 17],
            //                 [10, 13, 11, 16, 21, 15],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 158,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 17],
            //                 [10, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 159,
            //             moving: 'Red',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 14],
            //                 [10, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 160,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 14],
            //                 [10, 13, 11, 16, 20, 8],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 161,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [6, 7, 1, 5, 0, 14],
            //                 [10, 13, 11, 16, 20, 8],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 162,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [6, 7, 1, 5, 0, 14],
            //                 [10, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 163,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [6, 7, 2, 5, 0, 14],
            //                 [10, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 164,
            //             moving: 'Yellow',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 7, 2, 5, 0, 14],
            //                 [9, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 165,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [6, 7, 4, 5, 0, 14],
            //                 [9, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 166,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [6, 7, 4, 5, 0, 14],
            //                 [9, 13, 11, 16, 19, 8],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 167,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [10, 7, 4, 5, 0, 14],
            //                 [9, 13, 11, 16, 19, 8],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 168,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 7, 4, 5, 0, 14],
            //                 [9, 13, 12, 16, 19, 8],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 169,
            //             moving: 'Red',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 7, 4, 5, 0, 14],
            //                 [9, 13, 12, 16, 19, 8],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 170,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 7, 4, 5, 0, 14],
            //                 [9, 17, 12, 16, 19, 8],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 171,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 7, 4, 2, 0, 14],
            //                 [9, 17, 12, 16, 19, 8],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 172,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 7, 4, 2, 0, 14],
            //                 [9, 13, 12, 16, 19, 8],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 173,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 3, 4, 2, 0, 14],
            //                 [9, 13, 12, 16, 19, 8],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 174,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 3, 4, 2, 0, 14],
            //                 [9, 13, 12, 18, 19, 8],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 175,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [6, 3, 1, 2, 0, 14],
            //                 [9, 13, 12, 18, 19, 8],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 176,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 3, 1, 2, 0, 14],
            //                 [9, 13, 12, 20, 19, 8],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 177,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 3, 1, 2, 0, 7],
            //                 [9, 13, 12, 20, 19, 8],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 178,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [6, 3, 1, 2, 0, 7],
            //                 [9, 13, 12, 20, 18, 8],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 179,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [6, 3, 4, 2, 0, 7],
            //                 [9, 13, 12, 20, 18, 8],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 180,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 3, 4, 2, 0, 7],
            //                 [9, 13, 12, 17, 18, 8],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 181,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [11, 3, 4, 2, 0, 7],
            //                 [9, 13, 12, 17, 18, 8],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 182,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [11, 3, 4, 2, 0, 7],
            //                 [9, 13, 6, 17, 18, 8],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 183,
            //             moving: 'Red',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 3, 4, 2, 0, 7],
            //                 [9, 13, 6, 17, 18, 8],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 184,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 3, 4, 2, 0, 7],
            //                 [5, 13, 6, 17, 18, 8],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 185,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 1, 4, 2, 0, 7],
            //                 [5, 13, 6, 17, 18, 8],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 186,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [12, 1, 4, 2, 0, 7],
            //                 [5, 13, 6, 17, 19, 8],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 187,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [12, 1, 3, 2, 0, 7],
            //                 [5, 13, 6, 17, 19, 8],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 188,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 1, 3, 2, 0, 7],
            //                 [5, 14, 6, 17, 19, 8],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 189,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [12, 1, 4, 2, 0, 7],
            //                 [5, 14, 6, 17, 19, 8],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 190,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 1, 4, 2, 0, 7],
            //                 [5, 14, 6, 17, 19, 9],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 191,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 3, 4, 2, 0, 7],
            //                 [5, 14, 6, 17, 19, 9],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 192,
            //             moving: 'Yellow',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 3, 4, 2, 0, 7],
            //                 [8, 14, 6, 17, 19, 9],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 193,
            //             moving: 'Red',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [16, 3, 4, 2, 0, 7],
            //                 [8, 14, 6, 17, 19, 9],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 194,
            //             moving: 'Yellow',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 3, 4, 2, 0, 7],
            //                 [8, 13, 6, 17, 19, 9],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 195,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [16, 3, 4, 5, 0, 7],
            //                 [8, 13, 6, 17, 19, 9],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 196,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [16, 3, 4, 5, 0, 7],
            //                 [15, 13, 6, 17, 19, 9],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 197,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [16, 3, 4, 5, 0, 14],
            //                 [15, 13, 6, 17, 19, 9],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 198,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 3, 4, 5, 0, 14],
            //                 [15, 12, 6, 17, 19, 9],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 199,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 1, 4, 5, 0, 14],
            //                 [15, 12, 6, 17, 19, 9],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 200,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 1, 4, 5, 0, 14],
            //                 [15, 12, 10, 17, 19, 9],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 201,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 1, 2, 5, 0, 14],
            //                 [15, 12, 10, 17, 19, 9],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 202,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [16, 1, 2, 5, 0, 14],
            //                 [15, 12, 10, 17, 21, 9],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 203,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 1, 4, 5, 0, 14],
            //                 [15, 12, 10, 17, 21, 9],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 204,
            //             moving: 'Yellow',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 1, 4, 5, 0, 14],
            //                 [15, 12, 6, 17, 21, 9],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 205,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 2, 4, 5, 0, 14],
            //                 [15, 12, 6, 17, 21, 9],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 206,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [16, 2, 4, 5, 0, 14],
            //                 [15, 12, 6, 17, 20, 9],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 207,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [16, 2, 4, 8, 0, 14],
            //                 [15, 12, 6, 17, 20, 9],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 208,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [16, 2, 4, 8, 0, 14],
            //                 [15, 12, 6, 17, 20, 5],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 209,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 2, 3, 8, 0, 14],
            //                 [15, 12, 6, 17, 20, 5],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 210,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [16, 2, 3, 8, 0, 14],
            //                 [19, 12, 6, 17, 20, 5],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 211,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [16, 2, 3, 8, 0, 13],
            //                 [19, 12, 6, 17, 20, 5],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 212,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 2, 3, 8, 0, 13],
            //                 [19, 11, 6, 17, 20, 5],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 213,
            //             moving: 'Red',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [10, 2, 3, 8, 0, 13],
            //                 [19, 11, 6, 17, 20, 5],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 214,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 2, 3, 8, 0, 13],
            //                 [19, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 215,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [10, 2, 3, 9, 0, 13],
            //                 [19, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 216,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [10, 2, 3, 9, 0, 13],
            //                 [21, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 217,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [10, 2, 3, 8, 0, 13],
            //                 [21, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 218,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [10, 2, 3, 8, 0, 13],
            //                 [18, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 219,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [10, 1, 3, 8, 0, 13],
            //                 [18, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 220,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 3, 8, 0, 13],
            //                 [18, 11, 6, 17, 20, 5],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 221,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 4, 8, 0, 13],
            //                 [18, 11, 6, 17, 20, 5],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 222,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [10, 1, 4, 8, 0, 13],
            //                 [18, 16, 6, 17, 20, 5],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 223,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [10, 1, 4, 9, 0, 13],
            //                 [18, 16, 6, 17, 20, 5],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 224,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [10, 1, 4, 9, 0, 13],
            //                 [18, 16, 6, 17, 21, 5],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 225,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 3, 9, 0, 13],
            //                 [18, 16, 6, 17, 21, 5],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 226,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [10, 1, 3, 9, 0, 13],
            //                 [18, 11, 6, 17, 21, 5],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 227,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 7, 9, 0, 13],
            //                 [18, 11, 6, 17, 21, 5],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 228,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 7, 9, 0, 13],
            //                 [18, 11, 12, 17, 21, 5],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 229,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 3, 9, 0, 13],
            //                 [18, 11, 12, 17, 21, 5],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 230,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 3, 9, 0, 13],
            //                 [18, 11, 6, 17, 21, 5],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 231,
            //             moving: 'Red',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [16, 1, 3, 9, 0, 13],
            //                 [18, 11, 6, 17, 21, 5],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 232,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 1, 3, 9, 0, 13],
            //                 [18, 11, 10, 17, 21, 5],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 233,
            //             moving: 'Red',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 1, 3, 9, 0, 13],
            //                 [18, 11, 10, 17, 21, 5],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 234,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [12, 1, 3, 9, 0, 13],
            //                 [18, 11, 10, 20, 21, 5],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 235,
            //             moving: 'Red',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 1, 3, 9, 0, 13],
            //                 [18, 11, 10, 20, 21, 5],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 236,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 1, 3, 9, 0, 13],
            //                 [18, 11, 10, 17, 21, 5],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 237,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 1, 3, 8, 0, 13],
            //                 [18, 11, 10, 17, 21, 5],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 238,
            //             moving: 'Yellow',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 1, 3, 8, 0, 13],
            //                 [18, 11, 10, 17, 21, 9],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 239,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 1, 3, 8, 0, 13],
            //                 [18, 11, 10, 17, 21, 9],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 240,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 1, 3, 8, 0, 13],
            //                 [18, 6, 10, 17, 21, 9],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 241,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 13],
            //                 [18, 6, 10, 17, 21, 9],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 242,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 13],
            //                 [18, 6, 10, 17, 21, 8],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 243,
            //             moving: 'Red',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 7],
            //                 [18, 6, 10, 17, 21, 8],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 244,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 7],
            //                 [18, 6, 10, 17, 21, 9],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 245,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 2, 3, 5, 0, 7],
            //                 [18, 6, 10, 17, 21, 9],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 246,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [12, 2, 3, 5, 0, 7],
            //                 [18, 6, 10, 17, 19, 9],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 247,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 7],
            //                 [18, 6, 10, 17, 19, 9],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 248,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 7],
            //                 [20, 6, 10, 17, 19, 9],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 249,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [12, 1, 3, 2, 0, 7],
            //                 [20, 6, 10, 17, 19, 9],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 250,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 1, 3, 2, 0, 7],
            //                 [20, 11, 10, 17, 19, 9],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 251,
            //             moving: 'Red',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [16, 1, 3, 2, 0, 7],
            //                 [20, 11, 10, 17, 19, 9],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 252,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 1, 3, 2, 0, 7],
            //                 [20, 12, 10, 17, 19, 9],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 253,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 4, 3, 2, 0, 7],
            //                 [20, 12, 10, 17, 19, 9],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 254,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [16, 4, 3, 2, 0, 7],
            //                 [20, 12, 10, 17, 15, 9],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 255,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 6, 3, 2, 0, 7],
            //                 [20, 12, 10, 17, 15, 9],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 256,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [16, 6, 3, 2, 0, 7],
            //                 [20, 12, 10, 17, 15, 5],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //     ],
            //     totalSteps: 256,
            //     win: 'randomTeam',
            // };
            if (fetchBattleProcessDataResult) {
                localStorage.removeItem('challengeProcess');
                localStorage.setItem('challengeProcess', JSON.stringify(fetchBattleProcessDataResult));
                insertPretestPythonCode(code);
                window.location.href =
                    window.location.protocol +
                    '' +
                    window.location.hostname +
                    `:3080/watermelonChess/improve/youself/randomTeam`;
            }
        })
        .catch((error) => alert('上傳程式碼有誤，請檢查後再重新挑戰'));
};
