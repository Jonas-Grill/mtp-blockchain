// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

error SoulBoundRestriction();

import "../contracts/BaseConfig.sol";

contract SBCoin is BaseConfig {
    //EVENTS
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 amount
    );

    //METADATA STORAGE
    string private _name;
    string private _symbol;

    uint8 private immutable _decimals;

    //ERC20 STORAGE
    uint256 private _totalSupply;

    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    //TIME VALIDATION STORAGE
    mapping(address => mapping(uint256 => int256)) private _timeStamps;

    //CONSTRUCTOR
    constructor(
        string memory name_,
        string memory symbol_,
        address _configContractAddress
    ) {
        _name = name_; //KnowledgeCoin
        _symbol = symbol_; //NOW
        _decimals = 18;
        _totalSupply = 0;

        initAdmin(
            _configContractAddress,
            string(abi.encodePacked("SBCoin", "_", _name))
        );

        getConfigStorage().setKnowledgeCoinContractAdress(address(this));
    }

    //ERC20SB LOGIC
    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        address spender = msg.sender;

        uint256 currentAllowance = allowance(from, spender);

        if (currentAllowance != type(uint256).max) {
            require(
                currentAllowance >= amount,
                "ERC20: insufficient allowance"
            );
            unchecked {
                _approve(from, spender, currentAllowance - amount);
            }
        }

        _transfer(from, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    //MINT LOGIC
    function mint(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "ERC20: mint to the zero address");
        require(
            getConfigStorage().isAdmin(msg.sender),
            "ERC20: only admin can mint"
        );

        _totalSupply += amount;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            _balances[to] += amount;
        }

        _timeStamps[to][block.number] = int256(amount);

        emit Transfer(address(0), to, amount);

        return true;
    }

    //TIME VALIDATION LOGIC
    function coinsInBlockNumberRange(
        address account,
        uint256 startBlock,
        uint256 endBlock
    ) public view returns (uint256) {
        int256 amount = 0;
        for (uint256 i = startBlock; i <= endBlock; i++) {
            amount += _timeStamps[account][i];
        }

        return amount > 0 ? uint256(amount) : 0;
    }

    //INTERNAL LOGIC

    //UTILITY
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(
            getConfigStorage().isAdmin(msg.sender),
            "SoulBound Restriction: only admin can transfer"
        );

        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = _balances[from];

        require(
            fromBalance >= amount,
            "ERC20: transfer amount exceeds balance"
        );

        // Cannot overflow or underflow because a user's balance
        // will never be larger than the total supply.
        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }

        _timeStamps[from][block.number] = -int256(amount);
        _timeStamps[to][block.number] = int256(amount);

        emit Transfer(from, to, amount);
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(
            getConfigStorage().isAdmin(msg.sender),
            "SoulBound Restriction: only admin can approve"
        );

        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}
