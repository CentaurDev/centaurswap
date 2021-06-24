// SPDX-License-Identifier: MIT

pragma solidity =0.6.12;

import './libraries/AccessControl.sol';
import './libraries/SafeMath.sol';
import './interfaces/ICentaurFactory.sol';

contract CentaurFactoryTimeLock is AccessControl {

	using SafeMath for uint;

	bytes32 public constant TIMELOCK_ADMIN_ROLE = keccak256("TIMELOCK_ADMIN_ROLE");
    bytes32 public constant NORMAL_MAINTAINER_ROLE = keccak256("NORMAL_MAINTAINER_ROLE");
	bytes32 public constant EMERGENCY_MAINTAINER_ROLE = keccak256("EMERGENCY_MAINTAINER_ROLE");

	ICentaurFactory public centaurFactory;

	bool public PENDING_UNLOCK;
	uint public UNLOCK_TIMESTAMP;
	uint public TIMELOCK_PERIOD = 1 days;

	modifier hasTimeLock() {
		require(PENDING_UNLOCK, "CentaurFactoryTimeLock: UNLOCK_NOT_INITIATED");
		require(block.timestamp >= UNLOCK_TIMESTAMP, "CentaurFactoryTimeLock: PENDING_UNLOCK");
		_;
		PENDING_UNLOCK = false;
	}

	modifier onlyRole(bytes32 role) {
        require(hasRole(role, _msgSender()) || hasRole(role, address(0)), "CentaurFactoryTimeLock: NO_PERMISSION");
        _;
    }

	constructor(ICentaurFactory _centaurFactory, address _admin, address _normalMaintainer, address _emergencyMaintainer) public {
		centaurFactory = _centaurFactory;

		_setRoleAdmin(TIMELOCK_ADMIN_ROLE, TIMELOCK_ADMIN_ROLE);
        _setRoleAdmin(NORMAL_MAINTAINER_ROLE, TIMELOCK_ADMIN_ROLE);
        _setRoleAdmin(EMERGENCY_MAINTAINER_ROLE, TIMELOCK_ADMIN_ROLE);

        _setupRole(TIMELOCK_ADMIN_ROLE, _admin);
        _setupRole(NORMAL_MAINTAINER_ROLE, _normalMaintainer);
        _setupRole(EMERGENCY_MAINTAINER_ROLE, _emergencyMaintainer);

        PENDING_UNLOCK = false;
	}

	function unlock() external onlyRole(EMERGENCY_MAINTAINER_ROLE) {
		PENDING_UNLOCK = true;
		UNLOCK_TIMESTAMP = (block.timestamp).add(TIMELOCK_PERIOD);
	}

	// Factory Owner Functions

	function createPool(address _baseToken, address _oracle, uint _liquidityParameter) external onlyRole(NORMAL_MAINTAINER_ROLE) returns (address pool) {
    	return centaurFactory.createPool(_baseToken, _oracle, _liquidityParameter);
    }

    function addPool(address _pool) external onlyRole(NORMAL_MAINTAINER_ROLE) {
    	centaurFactory.addPool(_pool);
    }

    function removePool(address _pool) external onlyRole(NORMAL_MAINTAINER_ROLE) {
    	centaurFactory.removePool(_pool);
    }

    function transferOwnership(address _owner) external onlyRole(TIMELOCK_ADMIN_ROLE) {
    	centaurFactory.transferOwnership(_owner);
    }

    // Pool Functions
    function setPoolTradeEnabled(address _pool, bool _tradeEnabled) public onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setPoolTradeEnabled(_pool, _tradeEnabled);
    }

    function setPoolDepositEnabled(address _pool, bool _depositEnabled) public onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setPoolDepositEnabled(_pool, _depositEnabled);
    }

    function setPoolWithdrawEnabled(address _pool, bool _withdrawEnabled) public onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setPoolWithdrawEnabled(_pool, _withdrawEnabled);
    }

    function setPoolLiquidityParameter(address _pool, uint _liquidityParameter) public onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setPoolLiquidityParameter(_pool, _liquidityParameter);
    }

    function setAllPoolsTradeEnabled(bool _tradeEnabled) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setAllPoolsTradeEnabled(_tradeEnabled);
    }

    function setAllPoolsDepositEnabled(bool _depositEnabled) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setAllPoolsDepositEnabled(_depositEnabled);
    }

    function setAllPoolsWithdrawEnabled(bool _withdrawEnabled) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setAllPoolsWithdrawEnabled(_withdrawEnabled);
    }

    function emergencyWithdrawFromPool(address _pool, address _token, uint _amount, address _to) external onlyRole(EMERGENCY_MAINTAINER_ROLE) hasTimeLock {
        centaurFactory.emergencyWithdrawFromPool(_pool, _token, _amount, _to);
    }

    // Router Functions
    function setRouterOnlyEOAEnabled(bool _onlyEOAEnabled) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setRouterOnlyEOAEnabled(_onlyEOAEnabled);
    }

    function setRouterContractWhitelist(address _address, bool _whitelist) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setRouterContractWhitelist(_address, _whitelist);
    }

    // Settlement Functions
    function setSettlementDuration(uint _duration) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setSettlementDuration(_duration);
    }

    // Helper Functions
    function setPoolFee(uint _poolFee) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setPoolFee(_poolFee);
    }

    function setPoolLogic(address _poolLogic) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setPoolLogic(_poolLogic);
    }

    function setCloneFactory(address _cloneFactory) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setCloneFactory(_cloneFactory);
    }

    function setSettlement(address _settlement) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setSettlement(_settlement);
    }

    function setRouter(address payable _router) external onlyRole(NORMAL_MAINTAINER_ROLE) {
        centaurFactory.setRouter(_router);
    }
}