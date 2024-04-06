
require('dotenv').config();
const ethers = require('ethers');
const bip39 = require('bip39');
const { Alchemy, Network } = require('alchemy-sdk');

(async () => {
  const chalk = (await import('chalk')).default;

  // Configuration using environment variables
  const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  async function generateRandomSeedPhrase() {
    const mnemonic = bip39.generateMnemonic();
    const wallet = ethers.Wallet.createRandom();
    console.log(`Generated Seed Phrase: ${mnemonic}`);
    console.log(chalk.green(`Private Key: ${wallet.privateKey}`));
    console.log(chalk.green(`Address: ${wallet.address}`));

    try {
      const balances = await alchemy.core.getTokenBalances(wallet.address, ['eth']);
      const ethBalance = ethers.utils.formatEther(balances.tokenBalances[0].tokenBalance);
      console.log(`ETH Balance: ${ethBalance}`);
      if (parseFloat(ethBalance) > 0) {
        console.log(chalk.red('ETH found! Stopping execution.'));
        process.exit(0);
      }
    } catch (error) {
      console.error(chalk.red(`Error fetching token balances: ${error}`));
    }
  }

  async function executeWithCooldown() {
    await generateRandomSeedPhrase();
    console.log('\n');
    setTimeout(executeWithCooldown, 300);
  }

  executeWithCooldown();
})();
