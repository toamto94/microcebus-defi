
import Microcebus from './contracts/microcebus_main.json';
import iERC20 from './contracts/iERC20.json'
import Web3 from "web3/dist/web3.min.js";
//import Web3 from "web3";

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            await window.ethereum.enable();
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        }
        else if (window.web3) {
          const web3 = window.web3;
          console.log("Injected web3 detected.");
          resolve(web3);
        }
      });
    });
  };

const getMicrocebus = async web3 => {
    const networkId = await web3.eth.net.getId();
    const contract_deployment = Microcebus.networks[networkId];
    return new web3.eth.Contract(Microcebus.abi,
        contract_deployment && contract_deployment.address);
};

const getERC20 = async (web3, contract_deployment_address) => {
    return new web3.eth.Contract(iERC20.abi,
        contract_deployment_address);
};


export { getWeb3, getMicrocebus, getERC20 };