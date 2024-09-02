'use client';
import React, { useState } from 'react';
import { mnemonicToSeedSync } from 'bip39';
import { hdkey } from 'ethereumjs-wallet';
import { bufferToHex, privateToAddress } from 'ethereumjs-util';

const EthWallet = ({ mnemonic }) => {
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [addressIndex, setAddressIndex] = useState(0);

  const handleAddWallet = () => {
    if (!mnemonic) {
      alert('Please generate a mnemonic first.');
      return;
    }

    try {
      const seed = mnemonicToSeedSync(mnemonic); // Binary derived from the mnemonic
      const hdwallet = hdkey.fromMasterSeed(seed);
      const path = `m/44'/60'/${addressIndex}'/0'`;
      const wallet = hdwallet.derivePath(path).getWallet();
      const privateKey = wallet.getPrivateKey();
      const newWalletAddress = bufferToHex(privateToAddress(privateKey));  

      setWalletAddresses([...walletAddresses, newWalletAddress]);
      setAddressIndex(addressIndex + 1); 
    } catch (error) {
      console.error('Error generating wallet address:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
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
          <h2 className="text-xl font-semibold">Wallet Addresses:</h2>
          <ul className="list-disc pl-5">
            {walletAddresses.map((address, index) => (
              <li key={index} className="mt-2">{address}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EthWallet;
