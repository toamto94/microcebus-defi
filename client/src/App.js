import { useEffect, useState } from 'react';
import Farm from './Farm.js';
import { getWeb3, getMicrocebus } from './web3utils.js';


const wmatic_dai = {
  id: 0,
  token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  token1: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  token0_name: "WMATIC",
  token1_name: "DAI"
}


function App() {
  const [farmList, setFarmList] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);

  const updateFarmList = (token0, token1, token0_name, token1_name) => {
    const newFarm = {
      id: 0,
      token0: token0,
      token1: token1,
      token0_name: token0_name,
      token1_name: token1_name
    }
    setFarmList(farmList.push(newFarm))
  }
  useEffect(() => {
    const init = async () => {
      setFarmList([wmatic_dai]);
    };
    init();
  }, []);

  if (
    typeof farmList === 'undefined'
  ) {
    return <div>Loading ...</div>;
  }


  return (
    <div className="container">
      <div className="col">
        <ul className='farm-list'>
        {farmList.map(farm => {
          return(
            <li className='farm-list-item'>
              <div className='row'>
                <Farm farm={farm} />
              </div>
            </li>
          )
        })}
        </ul>
      </div>
    </div>
  )
}

export default App;
