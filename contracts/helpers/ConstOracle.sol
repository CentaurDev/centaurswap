// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;


contract ConstOracle {
    uint256 public tokenPrice;
    uint256 constant public decimals = 18;

    constructor(uint256 _price) public {
        tokenPrice = _price;
    }

    function latestRoundData()
		external
		view
		returns (
		  uint80 roundId,
		  int256 answer,
		  uint256 startedAt,
		  uint256 updatedAt,
		  uint80 answeredInRound
	) {
		return (0, int(tokenPrice), block.timestamp, block.timestamp, 0);
	}
}
