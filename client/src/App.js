import { useEffect, useState } from 'react';
import Farm from './Farm.js';
import { getWeb3, getMicrocebus, getERC20 } from './web3utils.js';
import './styles.css';


function App() {
  const [farmList, setFarmList] = useState(undefined);
  const [erc20, setErc20] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [microcebus, setMicrocebus] = useState(undefined);
  const [b, setB] = useState(2);

  useEffect(() => {
    const init = async () => {

    const web3 = getWeb3();
    const microcebus = await getMicrocebus(web3);

    const erc20 = {
      WMATIC: {name: "WMATIC", address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"},
      DAI: {name: "DAI", address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"},
      WETH: {name: "WETH", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"},
      WBTC: {name: "WBTC", address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"}
    }

    for (const [key, _] of Object.entries(erc20)) {
      erc20[key].contract = await getERC20(web3, erc20[key].address);
    }
   
    const farmList = [
      {
      id: 0,
      name: "wmatic-dai",
      token0: erc20.WMATIC,
      token1: erc20.DAI,
    },
    {
      id: 0,
      name: "wbtc-weth",
      token0: erc20.WBTC,
      token1: erc20.WETH,
    }
  ]


    setFarmList(farmList);
    setErc20(erc20);
    setWeb3(web3);
    setMicrocebus(microcebus);

    };
    init();
  }, []);

  if (
    typeof farmList === 'undefined'
    || typeof web3 === 'undefined'
    || typeof microcebus === 'undefined'
  ) {
    return <div>Loading ...</div>;
  }

  const get_max = async () => {
    const max = await farmList[0].token1.contract.methods.balanceOf("0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270").call();
    setB(max);
  }


  return (
    <div className="container">
            <form onClick={e => get_max()}>
                <input type='button' value='max' />
            </form>
            <h4>{b}</h4>
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
