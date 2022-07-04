import { Button, Col, Row } from 'antd';
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import './App.css';


/**
 * 有 200 个人参加抽奖，每次抽出一个人，不能重复，必须每个人都要抽中奖
    前面 10 次抽奖要选中固定的 10 个人，每次就从这10 人中随机抽取一人，不能重复
    从第 11 次开始就从剩余的 190 人当中抽奖，不能重复，直到抽奖结束
    已经中过奖的人不能再次抽奖
*/

const allPeople = [];//所有人

const winner = [1, 11, 22, 33, 44, 55, 66, 77, 88, 99];//固定中奖人

for (let i = 1; i <= 200; i++) {
  allPeople.push(i);
}

const staticAllPeople = [...allPeople];

/**
 * 生成随机整数
 * @param {*} minNum 最大值
 * @param {*} maxNum 最小值
 * @returns 
 */
const randomNum = (minNum, maxNum) => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}


const App = () => {

  const _this = useRef({});

  const [lucky, setLucky] = useState([]);//中奖的人

  const [position, setPosition] = useState({left: 0, top: 0});//遮罩层位置

  const [loading,setLoading] = useState(false);//动画进行中

  const width = 68, height = 40;



  const handleClick = () => {
    setLoading(true);
    startAnimation();
    //抽奖动画持续5秒
    setTimeout(() => {
      clearInterval(_this.current.timer);
      let random, luckyOne;
      if (winner.length) {
        random = randomNum(0, winner.length - 1);
        luckyOne = winner[random];
        winner.splice(random, 1);
        allPeople.splice(allPeople.indexOf(luckyOne), 1);
      } else {
        random = randomNum(0, allPeople.length - 1);
        luckyOne = allPeople[random];
        allPeople.splice(random, 1);
      }
      let lucyClone = [...lucky]
      lucyClone.push(luckyOne);
      setLucky(lucyClone);

      //遮罩层消失
      setPosition({
        left: -200,
        top: 0,
      });

      setLoading(false);
    }, 1000);
  }

  // 抽奖动画
  const startAnimation = () => {
    _this.current.timer = setInterval(() => {
      let left = randomNum(0, 9),right = randomNum(0, 19);
      flushSync(() => {
        setPosition({
          left: width * left,
          top: height * right,
        });
      })
    }, 300);
  }

  return (
    <div className='app'>
      <div className='options'>
        <Button onClick={handleClick} type='primary' loading={loading}>抽奖</Button>
      </div>
      <div className='contain'>
        <div className='jackpot'>
          <p>奖池</p>
          <div className='jackpot-inner'>
            <span className='mark' style={position}></span>
            {
              staticAllPeople.map((item, index) => {
                return <Button key={index} >{item}</Button>
              })
            }
          </div>
        </div>
        <div className='lucks'>
          <p>幸运用户</p>
          {
            lucky.map((item, index) => {
              return <Button key={index} type='primary'>{item}</Button>
            })
          }
        </div>
      </div>

    </div>
  );
}

export default App;





