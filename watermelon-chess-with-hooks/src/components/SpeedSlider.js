import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: '50vh',
    },
    input: {
        width: 42,
    },
});

export default function InputSlider(prop) {
    let { title, _id } = prop;
    const classes = useStyles();
    const [value, setValue] = React.useState(Number(1));

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    function valuetext(value) {
        return `${value}`;
    }

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
                        class="bi bi-stopwatch"
                        viewBox="0 0 16 16"
                    >
                        <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z" />
                        <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z" />
                    </svg>
                </Grid>
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : 1}
                        defaultValue={1.0}
                        getAriaValueText={valuetext}
                        onChange={handleSliderChange}
                        aria-labelledby="discrete-slider-small-steps"
                        step={0.25}
                        marks
                        min={0.25}
                        max={3}
                        valueLabelDisplay="auto"
                    />
                </Grid>
                <Grid item id={_id}>
                    {value}
                </Grid>
            </Grid>
        </div>
    );
}
