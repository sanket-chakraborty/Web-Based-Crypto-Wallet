import React, { useState, useEffect } from 'react';
import { mnemonicToSeedSync } from 'bip39';
import { hdkey } from 'ethereumjs-wallet';
import { bufferToHex, privateToAddress } from 'ethereumjs-util';
import { JsonRpcProvider } from '@ethersproject/providers';

const clusters = {
  mainnet: 'https://eth-mainnet.g.alchemy.com/v2/nsnNv9LSLvPTXwrS3tyKRu1lNDkXae-l',
  sepolia: 'https://eth-sepolia.g.alchemy.com/v2/nsnNv9LSLvPTXwrS3tyKRu1lNDkXae-l',
  holesky: 'https://eth-holesky.g.alchemy.com/v2/nsnNv9LSLvPTXwrS3tyKRu1lNDkXae-l',
};

const EthWallet = ({ mnemonic }) => {
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [addressIndex, setAddressIndex] = useState(0);
  const [balances, setBalances] = useState({});
  const [selectedCluster, setSelectedCluster] = useState('sepolia');
  const [provider, setProvider] = useState(new JsonRpcProvider(clusters[selectedCluster]));

  useEffect(() => {
    const newProvider = new JsonRpcProvider(clusters[selectedCluster]);
    setProvider(newProvider);

    walletAddresses.forEach((address) => recheckBalance(address, newProvider));
  }, [selectedCluster]);

  const handleAddWallet = async () => {
    if (!mnemonic) {
      alert('Please generate a mnemonic first.');
      return;
    }

    try {
      const seed = mnemonicToSeedSync(mnemonic); 
      const hdwallet = hdkey.fromMasterSeed(seed);
      const path = `m/44'/60'/${addressIndex}'/0'`;
      const wallet = hdwallet.derivePath(path).getWallet();
      const privateKey = wallet.getPrivateKey();
      const newWalletAddress = bufferToHex(privateToAddress(privateKey));

      setWalletAddresses([...walletAddresses, newWalletAddress]);
      setAddressIndex(addressIndex + 1);

      const balance = await provider.getBalance(newWalletAddress);
      setBalances((prevBalances) => ({
        ...prevBalances,
        [newWalletAddress]: Number(balance) / 1e18, 
      }));
    } catch (error) {
      console.error('Error generating wallet address:', error);
    }
  };

  const recheckBalance = async (address, providerToUse = provider) => {
    try {
      const balance = await providerToUse.getBalance(address);
      setBalances((prevBalances) => ({
        ...prevBalances,
        [address]: Number(balance) / 1e18, 
      }));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
      <div className="mb-4 flex justify-center">
        
        <select
          id="cluster"
          value={selectedCluster}
          onChange={(e) => setSelectedCluster(e.target.value)}
          className=" block w-full max-w-xs pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="mainnet">Mainnet</option>
          <option value="sepolia">Sepolia</option>
          <option value="holesky">Holesky</option>
      
        </select>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleAddWallet}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Eth Wallet
        </button>
      </div>
      {walletAddresses.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 border rounded overflow-auto max-h-60">
          <h2 className="text-xl font-semibold">Wallet Addresses and Balances:</h2>
          <ul className="list-disc pl-5">
            {walletAddresses.map((address, index) => (
              <li key={index} className="mt-2">
                <div>
                  <strong>Address:</strong> {address}
                </div>
                <div>
                  <strong>Balance:</strong> {balances[address] !== undefined ? `${balances[address]} ETH` : 'Loading...'}
                </div>
                <button
                  onClick={() => recheckBalance(address)}
                  className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Recheck Balance
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EthWallet;
