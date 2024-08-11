'use client';
import React, { useState } from 'react';
import nacl from 'tweetnacl';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';

const App = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [addressIndex, setAddressIndex] = useState(0);

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setWalletAddresses([]); 
    setAddressIndex(0); 
  };

  const handleAddWallet = () => {
    if (!mnemonic) {
      alert('Please generate a mnemonic first.');
      return;
    }

    try {
      const seed = mnemonicToSeedSync(mnemonic);
      const path = `m/44'/501'/${addressIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString('hex')).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const newWalletAddress = Keypair.fromSecretKey(secret).publicKey.toBase58();

      setWalletAddresses([...walletAddresses, newWalletAddress]);
      setAddressIndex(addressIndex + 1); 
    } catch (error) {
      console.error('Error generating wallet address:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Mnemonic & Wallet Address Generator</h1>
        <div className="mb-4">
          <button
            onClick={handleGenerateMnemonic}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate Mnemonic
          </button>
          {mnemonic && (
            <p className="mt-4 p-4 bg-gray-50 border rounded overflow-x-auto">{mnemonic}</p>
          )}
        </div>
        <div>
          <button
            onClick={handleAddWallet}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Wallet
          </button>
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
      </div>
    </div>
  );
};

export default App;
