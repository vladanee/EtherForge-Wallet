require('dotenv').config();
const bip39 = require('bip39');
const ethers = require('ethers');
const axios = require('axios');

const API_KEY = process.env.ETHERSCAN_API_KEY; // Make sure you use the correct env variable for Etherscan
function executeWithCooldown() {
  generateRandomSeedPhrase().then(() => {
    // Adjusting cooldown to 5000 milliseconds (5 seconds) to mitigate potential rate-limiting issues.
    setTimeout(executeWithCooldown, 5000); 
  });
}

executeWithCooldown();
async function generateRandomSeedPhrase() {
  const mnemonic = bip39.generateMnemonic();
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);

  console.log(`Generated Seed Phrase: ${mnemonic}`);
  console.log(`Private Key: ${wallet.privateKey}`);
  console.log(`Address: ${wallet.address}`);

  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${wallet.address}&tag=latest&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.status === "1") {
      const balanceInEther = ethers.utils.formatEther(data.result);
      console.log(`Ether Balance: ${balanceInEther} ETH`);
    } else {
      console.error(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

function executeWithCooldown() {
  generateRandomSeedPhrase().then(() => {
    setTimeout(executeWithCooldown, 300); // Adjust cooldown as necessary
  });
}

executeWithCooldown();