// SPDX-License-Identifier: MIT
import "./interfaces.sol";

pragma solidity >=0.4.22 <0.9.0;

contract microcebus_main {
    //events
    event Response(bool success, bytes data);

    //structs
    struct Token {
        address adr;
        uint256 decimals;
    }

    struct Farm {
        address liquidityPoolToken;
        address compundPoolToken;
        address rewardToken;
        mapping(address => UserBalance) balances;
    }

    struct UserBalance {
        address adr;
        uint256 balance;
    }

  //mappings
  mapping(string => Token) tokenContracts;

  //third party addresses
  address constant UniswapV2Router02 = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
  address constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
  address constant USDC = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
  address constant DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
  address constant USDT = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
  address constant WBTC = 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6;
  address constant DQUICK = 0xf28164A485B0B2C90639E47b0f377b4a438a16B1;
  address constant WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

  //admin address
  address private admin;

  
  constructor() {

        admin = msg.sender;
        tokenContracts["DAI"] = Token({adr: DAI, decimals: 18});
        tokenContracts["WETH"] = Token({adr: WETH, decimals: 18});
        tokenContracts["WMATIC"] = Token({adr: WMATIC, decimals: 18});
        tokenContracts["USDC"] = Token({adr: USDC, decimals: 6});
        tokenContracts["USDT"] = Token({adr: USDT, decimals: 6});
        tokenContracts["WBTC"] = Token({adr: WBTC, decimals: 8});
        tokenContracts["DQUICK"] = Token({adr: DQUICK, decimals: 18});

  }

    //
    function getWMATIC() external payable {

            (bool success, bytes memory data) = tokenContracts["WMATIC"].adr.call{value: msg.value}(abi.encodeWithSignature(""));
            iERC20(tokenContracts["WMATIC"].adr).transferFrom(address(this), msg.sender, msg.value);
            emit Response(success, data);
        }


}
