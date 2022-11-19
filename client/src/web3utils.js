
import Microcebus from './contracts/microcebus_main.json';
import iERC20 from './contracts/iERC20.json'
import Web3 from "web3/dist/web3.min.js";
//import Web3 from "web3";

const getWeb3 = () => {
    return new Web3('http://127.0.0.1:8545');
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