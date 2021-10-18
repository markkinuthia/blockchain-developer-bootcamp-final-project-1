import Web3 from 'web3';

export const loadWeb3 = () => {
    if(typeof window.ethereum!=='undefined'){
      const web3 = new Web3(window.ethereum);
      return web3
    } else {
      window.alert('Please install MetaMask')
      window.location.assign("https://metamask.io/")
    }
  }
// recipient is the address that should be paid, ie the registry.
// amount, in wei, specifies how much ether should be sent.
// nonce in this case is the special keyword linked to the title, used to prevent replay attacks.
// contractAddress is used to prevent cross-contract replay attacks.
export const signTitle = (recipient, amount, nonce, contractAddress, callback)=> {
    var hash = "0x" + ethereumjs.ABI.soliditySHA3(
      ["address", "uint256", "uint256", "address"],
      [recipient, amount, nonce, contractAddress]
    ).toString("hex");
  
    web3.personal.sign(hash, web3.eth.defaultAccount, callback);
  }

// loadWeb3()
// signTitle()