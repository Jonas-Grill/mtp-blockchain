// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

error SoulBoundRestriction();

abstract contract ERC20SB {

    //EVENTS
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    //METADATA STORAGE
    string private _name = "SoulBound Coin";
    string private _symbol = "SBC";

    uint8 private immutable _decimals = 18;

    //METADATA ACCESSORS
    address private immutable admin;

    //ERC20 STORAGE
    uint256 private _totalSupply;

    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    //CONSTRUCTOR
    constructor() {
        admin = msg.sender;
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

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        address spender = msg.sender;

        uint256 currentAllowance = allowance(from, spender);

        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
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

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    //INTERNAL MINT / BURN LOGIC
    function _mint(address to, uint256 amount) internal virtual {
        require(to != address(0), "ERC20: mint to the zero address");
        require(msg.sender == admin, "ERC20: only admin can mint");

        _totalSupply += amount;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            _balances[to] += amount;
        }

        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal virtual {
        _balances[from] -= amount;

        // Cannot underflow because a user's balance
        // will never be larger than the total supply.
        unchecked {
            _totalSupply -= amount;
        }

        emit Transfer(from, address(0), amount);
    }

    //UTILITY
    function _transfer(address from, address to, uint256 amount) internal virtual {
        if (msg.sender != admin) {
            revert SoulBoundRestriction();
        }

        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = _balances[from];

        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");

        // Cannot overflow or underflow because a user's balance
        // will never be larger than the total supply.
        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal virtual {
        if (msg.sender != admin) {
            revert SoulBoundRestriction();
        }

        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}
