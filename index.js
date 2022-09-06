//Adding scripts as type="module" allows to use import in js. 
//min.js file is copy pasted from ethers doc => when using frame works we can npm install these packages.
import { ethers } from  "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balance");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getContractBalance;
withdrawButton.onclick = withdraw;

async function connect() {
    if(typeof window.ethereum !== "undefined") {
        try {
            //eth_requestAccounts - is used to connect to the wallet in the browser.
            await ethereum.request({ method: "eth_requestAccounts"});
            connectButton.innerHTML = "Connected"
        } catch (error) {
            console.log(error);
        }                      
    } else {
       connectButton.innerHTML = "Not Connected!"
    }
}

async function fund() {
    const ethAmount = document.getElementById("inputText").value;
    console.log(`Funding with ${ethAmount}..`);
    if(typeof window.ethereum !== "undefined") { 
        //Takes the network that the metamask in connected to and set the RPC url here. 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        //gets the account to which the we connected (above connect() method)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount) });
            //call below to wait till confirmation. Trasnsaction succeeded.
            await listenForTxMine(transactionResponse, provider);
            console.log("Done!");

        } catch(error) {
            console.log(error);
        }        
    }
}

//Wait til the transaction is compeleted to show user a success message. 
function listenForTxMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}..`);

    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve();
        }); 
       
    });    
}

async function getContractBalance() {
    if(typeof window.ethereum !== "undefined") {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(balance.toString());
    }
}

async function withdraw() {
    if(typeof window.ethereum !== "undefined") { 
        console.log("Withdrawing..")
        //Takes the network that the metamask in connected to and set the RPC url here. 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.withdraw();
            await listenForTxMine(transactionResponse, provider);
            console.log("Done!");

        } catch(error) {
            console.log(error);
        }        
    }
}
