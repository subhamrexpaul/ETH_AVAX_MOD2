import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(500);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(500);
      await tx.wait()
      getBalance();
    }
  }

  const handleBurn = async(x, item) => {
    if(atm){
      if(balance > x){
        let tx = await atm.burn(x);
        await tx.wait();
        getBalance();
        console.log(`${item} bought!`);
        let buyingAnimation;
        if(item == 'Biryani'){
          buyingAnimation = document.getElementById("buyingAnimation_biryani");
        }
        else if(item == "Tandoori Chicken"){
          buyingAnimation = document.getElementById("buyingAnimation_tandoori");

        }
        else{
          buyingAnimation = document.getElementById("buyingAnimation_butter");
        }
        if (buyingAnimation) {
          buyingAnimation.style.display = "block";
          setTimeout(() => {
            buyingAnimation.style.display = "none";
          }, 5000); 
        }

      }
      else{
        console.log("You don't have enough balance!")
      }
    }
    
  }
 


  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div style={{backgroundColor : "hsla(206,100%,73.3%,1)"}}>
        <p className="para" style={{padding: "1em"}}>Your Account: {account}</p>
        <p className="para" style={{fontFamily: "sans-serif"}}>Account Balance: {balance} REX</p>
        <button className="button-ss--" onClick={deposit} style={{padding: "0.5em 1.2em", cursor: "pointer", margin: "0em 2em", border: "2px solid", backgroundColor:"green", color: "white",borderRadius: "10px"}}>Deposit 500 REX</button>
        <button className="button-ss--" onClick={withdraw} style={{padding: "0.5em 1.2em", cursor: "pointer", margin: "0em 2em", border: "2px solid", backgroundColor:"red", color: "white",borderRadius: "10px"}}>Withdraw 500 REX</button>
        <hr></hr>
        <div style={{width: "100%",display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <div style={{display: "flex", width: "30%", justifyContent: "space-between",fontFamily:"sans-serif", alignItems: "center"}}>
          <p className="para">Buy a Biryani [149 REX] </p>

          <button className="button-ss--" onClick={() => handleBurn(149, "Biryani")} style={{padding: "0.5em 1.2em", cursor: "pointer", margin: "0em 2em", border: "2px solid green", borderRadius: "10px"}}>Buy</button>
          <p className="buying-animation" id="buyingAnimation_biryani" style={{animation: "fadeIn 1s ease-in-out", display: "none", color: "green", fontWeight: "bold"}}>Biryani bought!</p>
          </div>
          <div style={{display: "flex", width: "30%", justifyContent: "space-between",fontFamily:"sans-serif", alignItems: "center"}}>
            <p className="para">Buy a Tandoori Chicken [259 REX] </p>
            <button className="button-ss--" onClick={() => handleBurn(259, "Tandoori Chicken")} style={{padding: "0.5em 1.2em", cursor: "pointer", margin: "0em 2em", border: "2px solid green", borderRadius: "10px"}}>Buy</button>
            <p className="buying-animation" id="buyingAnimation_tandoori" style={{animation: "fadeIn 1s ease-in-out", display: "none", color: "green", fontWeight: "bold"}}>Tandoori Chicken bought!</p>

          </div>
          <div style={{display: "flex", width: "30%", justifyContent: "space-between",fontFamily:"sans-serif", alignItems: "center"}}>
          <p className="para">Buy a Butter Chicken [499 REX] </p>
          <button className="button-ss--" onClick={() => handleBurn(499, "Butter Chicken")} style={{padding: "0.5em 1.2em", cursor: "pointer", margin: "0em 2em", border: "2px solid green", borderRadius: "10px"}}>Buy</button>
          <p className="buying-animation" id="buyingAnimation_butter" style={{animation: "fadeIn 1s ease-in-out", display: "none", color: "green", fontWeight: "bold"}}>Butter Chicken bought!</p>
          
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header className="header" style={{backgroundColor: "#ff0000", color: "white"}}><h1>Welcome to the Subham FoodPoint!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
        .header{
          background-color: #ffc65c;
        }
        h1 {
          margin: 0;
          padding: 1rem 0
         }
        .para {
         color: red;
        }
        .button-ss-- {
          background-color: #ffc65c;
        }
      `}
      </style>
    </main>
  )
}
