pragma solidity ^0.5.11;

contract Add {
    uint num1;
    uint num2;
    uint num3;
    function Sum(uint _num1, uint _num2) public {
        num3 = _num1 + _num2;
    }
    function getSum() public view returns (uint) {
        return num3;
    }
}