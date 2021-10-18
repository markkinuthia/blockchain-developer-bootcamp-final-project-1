// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// import EthCrypto from 'eth-crypto';
// // import 'eth-crypto';
// const EthCrypto = require('eth-crypto');

contract LandTitle {
  // Variables

  // Land Registry Address
  address payable public registryAddress;

  // Land Owner's Address
  address public owner;

  // Land Title Registry Fee
  uint256 public registryFee;

  // Land Title Transfer Fee
  uint256 public transferFee;

  // Nonce to prevent replay attacks
  /**
  * A replay attack is when a signature is used again (“replayed”) 
  * to claim authorization for a second action. Just as in Ethereum 
  * transactions themselves, messages typically include a nonce to 
  * protect against replay attacks. The smart contract checks 
  * that no nonce is reused.
   */
  uint256 public nonce;
  mapping(uint256 => bool) usedNonces;

  // The `signature` is passed along from off-chain operations. 
  bytes32 private signature;
  bytes32 private encrypted;

  /** Enums are useful to model choice and keep track of state */
  /** The order in which the enum is declared matters!! */
  /** The first item is the default of the State enum, in this case */
  enum State {
    ToBeRegistered,
    Signed,
    Registered,
    ToBeTransfered,
    Transfered
  }

  /** Struct types are used to represent a record */
  struct Title {
    string ID;
    address payable currOwner;
    uint256 size;
    string location;
    string image;
    State state;
    // Unit test for this: 
    uint nonce;
  }
  mapping(uint256 => Title) titles;

  /*
   * Events
   */
  event LogToBeRegistered(uint256 nonce);
  event LogSigned(uint256 nonce);
  event LogRegistered(uint256 nonce);
  event LogToBeTransfered(uint256 nonce);
  event LogTrasnfered(uint256 nonce);

  /*
   * Modifiers
   */
  // Create a modifer, `isOwner` that checks if the msg.sender is the owner of the contract
  // <modifier: isOwner
  modifier isOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
  }

// Do I need this one given the above
  modifier verifyCaller(address _address) {
    require(
      msg.sender == _address,
      "Only verified members can call this function"
    );
    _;
  }

  modifier paidEnough(uint256 _price) {
    require(
      msg.value >= _price,
      "the amount should be enough to cover the purchase"
    );
    _;
  }

  modifier checkValue(uint256 _nonce) {
    //refund them after pay for item (why it is before, _ checks for logic before func)
    _;
    uint256 amountToRefund = msg.value - transferFee;
    titles[_nonce].currOwner.transfer(amountToRefund);
  }

  modifier toBeRegistered(uint256 _nonce) {
    require(
      (titles[_nonce].currOwner != address(0) &&
        titles[_nonce].state == State.ToBeRegistered),
      "The title should be on added in order to be registered"
    );
    _;
  }

  modifier signed(uint256 _nonce) {
    require(titles[_nonce].state == State.Signed, "The title has been signed");
    _;
  }

  modifier registered(uint256 _nonce) {
    require(
      titles[_nonce].state == State.Registered,
      "The title has been registered"
    );
    _;
  }

  modifier toBeTransfered(uint256 _nonce) {
    require(
      titles[_nonce].state == State.ToBeTransfered,
      "The title is ready to be transfered"
    );
    _;
  }

  modifier transfered(uint256 _nonce) {
    require(
      titles[_nonce].state == State.Transfered,
      "The title has been transfered"
    );
    _;
  }

  constructor() public {
    // Set the owner to the transaction sender.
    owner = msg.sender;
    // Set the address for the "land registy office".
    registryAddress = address(1);
    // Set the registry fee, as determined by the "land registry office".
    registryFee = 1;
    // Set the transfer fee, as determined by the "land registry office".
    transferFee = 1;
    // Initialize the nonce to 0.
    nonce = 0;
  }

  function addTitle(
    string memory _ID,
    uint256 _size,
    string memory _location,  
    string memory _image
  ) public returns (bool) {
    titles[nonce] = Title(
      _ID,
      msg.sender,
      _size,
      _location,
      _image,
      State.ToBeRegistered,
      nonce
    );
    emit LogToBeRegistered(nonce);
    nonce = nonce + 1;
    return true;
  }

  /**
  * In general, ECDSA signatures consist of two parameters, r and s. 
  * Signatures in Ethereum include a third parameter, v, which provides 
  * additional information that can be used to recover which account’s 
  * private key was used to sign the message. This same mechanism is 
  * how Ethereum determines which account sent a given transaction.
  * Solidity provides a built-in function ecrecover that accepts a 
  * message along with the r, s, and v parameters and returns 
  * the address that was used to sign the message.
  *
  * Splitting the signature to obtain these params is, therefore, necessary.
  */

  function splitSignature(bytes memory sig)
        internal
        pure
        returns (uint8, bytes32, bytes32)
    {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;
        /**
        * r and s are 32 bytes each and together make up 
        * the first 64 bytes of the signature.
        * v is the 65th byte, which can be found at byte 
        * offset 96 (32 bytes for the length, 64 bytes for r and s). 
        * The mload opcode loads 32 bytes at a time, so the 
        * function then needs to extract just the first byte 
        * of the word that was read. This is what byte(0, ...) does.
        */
        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    function recoverSigner(bytes32 message, bytes memory sig, uint _nonce)
        internal
        returns (address)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        titles[_nonce].state = State.Signed;
        // Can I put this after the return?
        emit LogSigned(_nonce);
        return ecrecover(message, v, r, s);
    }

    /**
    * In addition to the r, s, and v parameters from the signature, 
    * recovering the message signer requires knowledge of the message 
    * that was signed. The message hash needs to be recomputed from 
    * the sent parameters along with the known prefix.
    *
    * It may seem tempting at first to just have the caller pass in 
    * the message that was signed, but that would only prove that 
    * some message was signed by the owner. The smart contract needs 
    * to know exactly what parameters were signed, and so it must 
    * recreate the message from the parameters and use that for 
    * signature verification.
    */
    // Builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function registerTitle(bytes memory sig, uint amount, uint _nonce) private signed(_nonce) paidEnough(registryFee) checkValue(_nonce) {
        require(!usedNonces[_nonce]);
        usedNonces[_nonce] = true;

        // This recreates the message that was signed on the client.
        bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, amount, nonce, this)));

        require(recoverSigner(message, sig, _nonce) == owner);

        registryAddress.transfer(registryFee);
        titles[_nonce].state = State.Registered;
        emit LogRegistered(_nonce);
    }

    // Destroy contract and reclaim leftover funds.
    function kill() public {
        require(msg.sender == owner);
        selfdestruct(msg.sender);
    }

  function fetchTitle(uint256 _nonce)
    public
    view
    returns (
      string memory ID,
      address currOwner,
      uint256 none,
      uint256 size,
      string memory location,
      string memory image,
      uint256 state
    )
  {
    ID = titles[_nonce].ID;
    currOwner = titles[_nonce].currOwner;
    size = titles[_nonce].size;
    location = titles[_nonce].location;
    image = titles[_nonce].image;
    state = uint256(titles[_nonce].state);

    return (ID, currOwner, nonce, size, location, image, state);
  }


}
