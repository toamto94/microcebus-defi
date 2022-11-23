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

    struct LPToken {
        Token token0;
        Token token1;
        address adr;
        uint256 decimals;
        mapping(address => uint256) user_deposits;
        uint256 contract_deposit;
    }

  //mappings
  mapping(string => Token) private token_contracts;
  mapping(string => mapping(string => LPToken)) private lp_token_contracts;
  

  //third party addresses
  address constant UniswapV2Router02 = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
  address constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
  address constant USDC = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
  address constant DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
  address constant USDT = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
  address constant WBTC = 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6;
  address constant DQUICK = 0xf28164A485B0B2C90639E47b0f377b4a438a16B1;
  address constant WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

  address constant WMATIC_DAI = 0xEEf611894CeaE652979C9D0DaE1dEb597790C6eE;

  //admin address
  address private admin;

  //contract constructor
  constructor() {
        admin = msg.sender;
        token_contracts["DAI"] = Token({adr: DAI, decimals: 18});
        token_contracts["WETH"] = Token({adr: WETH, decimals: 18});
        token_contracts["WMATIC"] = Token({adr: WMATIC, decimals: 18});
        token_contracts["USDC"] = Token({adr: USDC, decimals: 6});
        token_contracts["USDT"] = Token({adr: USDT, decimals: 6});
        token_contracts["WBTC"] = Token({adr: WBTC, decimals: 8});
        token_contracts["DQUICK"] = Token({adr: DQUICK, decimals: 18});

        lp_token_contracts["WMATIC"]["DAI"].adr = WMATIC_DAI;
        lp_token_contracts["WMATIC"]["DAI"].decimals = 18;
        lp_token_contracts["WMATIC"]["DAI"].contract_deposit = 0;
        lp_token_contracts["WMATIC"]["DAI"].token0 = token_contracts["WMATIC"];
        lp_token_contracts["WMATIC"]["DAI"].token1 = token_contracts["DAI"];



  }

  //Add functions which add tokens, contracts and lp tokens/contracts

    //modifiers
    modifier check_token_approval(address _token_address, address _token_sender, address _token_receiver, uint256 _amount) {
        require(iERC20(_token_address).allowance(_token_sender, _token_receiver) >= _amount,
        "ERC20 contract has not given permission to this address.");
        _;
    }

    modifier check_enough_balance_withdraw(string memory _tokenA_in_identifier, string memory _tokenB_in_identifier, uint256 _amount, address _user) {
        require(lp_token_contracts[_tokenA_in_identifier][_tokenB_in_identifier].user_deposits[_user] >= _amount,
        "User does not have enough balance to withdraw this amount.");
        _;
    }

    modifier check_enough_balance_add(string memory _tokenA_in_identifier, string memory _tokenB_in_identifier, uint256 _amount0, uint256 _amount1, address _user) {
        require(iERC20(token_contracts[_tokenA_in_identifier].adr).balanceOf(_user) >= _amount0,
        "User does not have enough balance to add liquidity.");
        require(iERC20(token_contracts[_tokenB_in_identifier].adr).balanceOf(_user) >= _amount1,
        "User does not have enough balance to add liquidity.");
        _;
    }


    //developer function to get WMATIC to an address for testing reasons
    function receive_wmatic() external payable {
            (bool success, bytes memory data) = token_contracts["WMATIC"].adr.call{value: msg.value}(abi.encodeWithSignature(""));
            iERC20(token_contracts["WMATIC"].adr).transferFrom(address(this), msg.sender, msg.value);
            emit Response(success, data);
        }

    //send ERC20 token to a destination address
    function transfer_token(string memory _token_in_identifier, address _token_receiver, uint256 _amount)
      check_token_approval(token_contracts[_token_in_identifier].adr, msg.sender, _token_receiver, _amount) public {
            iERC20(token_contracts[_token_in_identifier].adr).transferFrom(msg.sender, _token_receiver, _amount);
        }

    //send ERC20 token to this contract
    function transfer_token_to_contract(string memory _token_in_identifier, uint256 _amount)
      check_token_approval(token_contracts[_token_in_identifier].adr, msg.sender, address(this), _amount) public {
            iERC20(token_contracts[_token_in_identifier].adr).transferFrom(msg.sender, address(this), _amount);
        }



    //swap exact tokens for tokens
    function swap_exact_tokens_for_tokens(uint256 _amount_in, uint _amount_out_min, string memory _token_in_identifier,
        string memory _token_out_identifier, uint deadline) external {
        transfer_token_to_contract(_token_in_identifier, _amount_in);
        address[] memory path = new address[](2);
        path[0] = token_contracts[_token_in_identifier].adr;
        path[1] = token_contracts[_token_out_identifier].adr;
        iERC20(token_contracts[_token_in_identifier].adr).approve(UniswapV2Router02, _amount_in);     
        IUniswapV2Router02(UniswapV2Router02).swapExactTokensForTokens(
          _amount_in,
          _amount_out_min,
          path,
          msg.sender,
          deadline);
    }

    //add liquidity
    function add_liquidity(string memory _tokenA_in_identifier, string memory _tokenB_in_identifier,
        uint256 _amountA_desired, uint256 _amountB_desired, uint256 _amountA_Min, uint256 _amountB_Min, uint deadline)
         check_enough_balance_add(_tokenA_in_identifier, _tokenB_in_identifier, _amountA_desired, _amountB_desired, msg.sender) external {

            transfer_token_to_contract(_tokenA_in_identifier, _amountA_desired);
            transfer_token_to_contract(_tokenB_in_identifier, _amountB_desired);

            iERC20(token_contracts[_tokenA_in_identifier].adr).approve(UniswapV2Router02, _amountA_desired);
            iERC20(token_contracts[_tokenB_in_identifier].adr).approve(UniswapV2Router02,_amountB_desired);

            IUniswapV2Router02(UniswapV2Router02).addLiquidity(
                token_contracts[_tokenA_in_identifier].adr,
                token_contracts[_tokenB_in_identifier].adr,
                _amountA_desired,
                _amountB_desired,
                _amountA_Min,
                _amountB_Min,
                address(this),
                deadline
            );
            update_deposit(_tokenA_in_identifier, _tokenB_in_identifier, msg.sender);
        }


    //add liquidity
    function withdraw_liquidity(string memory _tokenA_in_identifier, string memory _tokenB_in_identifier,
        uint256 _liquidity, uint256 _amountA_Min, uint256 _amountB_Min, uint deadline)
            check_enough_balance_withdraw(_tokenA_in_identifier, _tokenA_in_identifier, _liquidity, msg.sender) external {

            IUniswapV2Router02(UniswapV2Router02).removeLiquidity(
                token_contracts[_tokenA_in_identifier].adr,
                token_contracts[_tokenB_in_identifier].adr,
                _liquidity,
                _amountA_Min,
                _amountB_Min,
                msg.sender,
                deadline
            );
            update_deposit(_tokenA_in_identifier, _tokenB_in_identifier, msg.sender);
        }

    //update users farm deposit
    function update_deposit(string memory _tokenA_in_identifier, string memory _tokenB_in_identifier, address _user) private {
        uint256 amount = iERC20(lp_token_contracts[_tokenA_in_identifier][_tokenB_in_identifier].adr).balanceOf(address(this));
        uint256 user_deposit = amount - lp_token_contracts[_tokenA_in_identifier][_tokenB_in_identifier].contract_deposit;
        lp_token_contracts[_tokenA_in_identifier][_tokenB_in_identifier].user_deposits[_user] += user_deposit;
        lp_token_contracts[_tokenA_in_identifier][_tokenB_in_identifier].contract_deposit = amount;
    }


    //get amounts out
    function get_amounts_out(
    uint256 _amount_in,
    string memory _token_in_identifier,
    string memory _token_out_identifier) public view returns(uint256) {
        address[] memory path;
        path = new address[](2);
        path[0] = token_contracts[_token_in_identifier].adr;
        path[1] = token_contracts[_token_out_identifier].adr;
        return(IUniswapV2Router02(UniswapV2Router02).getAmountsOut(_amount_in, path)[1]);
    }

    //get balance of ERC20 token
    function get_token_balance(string memory _token_identifier, address _token_owner) external view returns(uint256) {
            return(iERC20(token_contracts[_token_identifier].adr).balanceOf(_token_owner));
        }

    //get balance of ERC20 token (sender)
    function get_token_balance_sender(string memory _token_identifier) external view returns(uint256) {
            return(iERC20(token_contracts[_token_identifier].adr).balanceOf(msg.sender));
        }

    //get balance of ERC20 token (contract)
    function get_token_balance_contract(string memory _token_identifier) external view returns(uint256) {
            return(iERC20(token_contracts[_token_identifier].adr).balanceOf(address(this)));
        }

    //get balance of LP token
    function get_lp_token_balance(string memory _tokenA_in_identifier, string memory _tokenB_in_identifier,
        address _token_owner) external view returns(uint256) {
            return(iERC20(lp_token_contracts[_tokenA_in_identifier][_tokenB_in_identifier].adr).balanceOf(_token_owner));
        }

    //get balance of LP token (sender)
    function get_lp_token_balance_sender(string memory _tokenA_in_identifier, string memory _tokenB_in_identifier) external view returns(uint256) {
            return(iERC20(lp_token_contracts[_tokenA_in_identifier][_tokenB_in_identifier].adr).balanceOf(msg.sender));
        }

    //get balance of LP token (contract)
    function get_lp_token_balance_contract(string memory _tokenA_in_identifier, string memory _tokenB_in_identifier) external view returns(uint256) {
            return(iERC20(lp_token_contracts[_tokenA_in_identifier][_tokenB_in_identifier].adr).balanceOf(address(this)));
        }

    //get user deposit
    function get_user_deposit(address _user, string memory _tokenA_in_identifier, string memory _tokenB_in_identifier) external view returns(uint256) {
            return(lp_token_contracts[_tokenA_in_identifier][_tokenB_in_identifier].user_deposits[_user]);
        }

    //send MATIC to contract
    receive() external payable {}


}
