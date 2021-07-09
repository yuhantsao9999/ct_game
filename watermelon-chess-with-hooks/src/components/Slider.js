import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { SliderContext } from '../hooks/context';
import { chessesDefault } from '../utils';
import { BattleProcessContext } from '../hooks/context';
import { matchBattleProcessData } from '../utils/matchBattleProcessData';

const useStyles = makeStyles({
    root: {
        width: '50vh',
    },
    input: {
        width: 42,
    },
});

export default function InputSlider(prop) {
    let { title, defaultValue, max, min, setIndex, setHistory, setWinnerSide, winnerSide, index, setYellow, setRed } =
        prop;
    const classes = useStyles();

    const { result: battleData } = useContext(BattleProcessContext);
    const convertBattleProcess = matchBattleProcessData(battleData.process);
    const [value, setValue] = useState(Number(defaultValue));

    useEffect(() => {
        setValue(index);
    }, [index]);

    const handleSliderChange = (event, newValue) => {
        //因為要 black box 是給移動後的狀態（才讓最後一部顯示 final 狀態），所以初始狀態自己加上
        if (newValue == 0) {
            setHistory([
                {
                    chesses: chessesDefault,
                    currentSide: 0, //初始旗子side 紅
                    latestMoveChessName: null, // 最新移动的棋子的名称
                },
            ]);
            setWinnerSide(null);
            setYellow([]);
            setRed([]);
            setIndex(newValue);
            setValue(newValue);
        } else {
            //magic number -1 ，因為要 black box 是給移動後的狀態（才讓最後一部顯示 final 狀態），所以要 -1 取得移動前的狀態
            let everyChessSizeInCurrentBoard = convertBattleProcess[newValue - 1].currentBoard.map((item) => item.side);
            //TODO:refactor 更好的寫法
            let beEatenZero = ['0', '0', '0', '0', '0', '0'];
            let beEatenOne = ['1', '1', '1', '1', '1', '1'];

            for (let i = 0; i < everyChessSizeInCurrentBoard.length; i++) {
                if (everyChessSizeInCurrentBoard[i] == 0) {
                    beEatenZero.pop();
                }
                if (everyChessSizeInCurrentBoard[i] == 1) {
                    beEatenOne.pop();
                }
            }
            setIndex(newValue);
            setHistory([
                {
                    //magic number -1 ，因為 blackBox 給的是那個 step 移動後的狀態（才能夠讓最後一步顯示 final 狀態），所以要 -1 取得移動前的狀態
                    chesses: convertBattleProcess[newValue - 1].currentBoard,
                    currentSide: newValue % 2 === 1 ? 0 : 1, //初始旗子side red:0 yellow:1
                    latestMoveChessName: null, // 最新移动的棋子的名称
                },
            ]);
            if (newValue !== convertBattleProcess.length) {
                setWinnerSide(null);
            }
            setYellow([...beEatenZero]);
            setRed([...beEatenOne]);
            setValue(newValue);
        }
    };

    return (
        <div className={classes.root}>
            <Typography id="input-slider" gutterBottom>
                {title}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-hand-index-thumb"
                        viewBox="0 0 16 16"
                    >
                        <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z" />
                    </svg>
                </Grid>
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        min={Number(min)}
                        max={Number(max)}
                    />
                </Grid>
                <Grid item>{value}</Grid>
            </Grid>
        </div>
    );
}
