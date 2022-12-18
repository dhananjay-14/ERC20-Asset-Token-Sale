pragma solidity ^0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract Wallet is Ownable {
    function viewBalance () public view returns(uint256){
        return address(this).balance;
    }
    receive() external payable {

    }
}