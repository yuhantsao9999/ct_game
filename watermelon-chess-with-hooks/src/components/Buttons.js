import React from 'react';
import styled from 'styled-components';

//  {/*  按钮区*/}
//  <div className="btns">
//  {/* <button disabled={history.length === 1} onClick={goBack}>
//      返回上一步
//  </button> */}
//  <button id="restart" onClick={replay}>
//      重頭
//  </button>
//  <button id="next" onClick={() => move()}>
//      下一步
//  </button>
//  <button id="play">播放</button>
//  <button id="stop">暫停</button>
//  <label>
//      Step :
//      <input id="step" type="number" />
//  </label>

//  {/* 調整速度 */}
//  <select id="speed">
//      <option value="1000">-- 速度 --</option>
//      <option value="2000">0.25</option>
//      <option value="1500">0.5</option>
//      <option value="1000">1</option>
//      <option value="500">1.5</option>
//      <option value="250">2</option>
//  </select>
// </div>
const Buttons = (props) => {
    let { move } = props;
    // 点击 重玩
    function replay() {
        window.location.reload();
    }

    return (
        <div className="btns">
            <button id="restart" onClick={replay}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-arrow-repeat"
                    viewBox="0 0 16 16"
                >
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                    <path
                        fill-rule="evenodd"
                        d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                    />
                </svg>
            </button>
            <button id="next" onClick={() => move()}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-skip-backward-btn-fill"
                    viewBox="0 0 16 16"
                >
                    <path d="M0 10V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.79-6.907A.5.5 0 0 0 4 3.5v5a.5.5 0 0 0 .79.407L7.5 6.972V8.5a.5.5 0 0 0 .79.407L11 6.972V8.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-1 0v1.528L8.29 3.093a.5.5 0 0 0-.79.407v1.528L4.79 3.093z" />
                </svg>
            </button>
            <button id="play">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-play-btn-fill"
                    viewBox="0 0 16 16"
                >
                    <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                </svg>
            </button>
            <button id="stop">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pause-btn-fill"
                    viewBox="0 0 16 16"
                >
                    <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.25-7C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
                </svg>
            </button>
            <label>
                步數:
                <input id="step" type="number" />
            </label>

            {/* 調整速度 */}
            <select id="speed">
                <option value="1000">-- 速度 --</option>
                <option value="2000">0.25</option>
                <option value="1500">0.5</option>
                <option value="1000">1</option>
                <option value="500">1.5</option>
                <option value="250">2</option>
            </select>
        </div>
    );
};

export default Buttons;
