'use client';
import React, { useState } from 'react';
import SolWallet from './SolWallet/page';
import EthWallet from './EthWallet/page';
import { generateMnemonic } from 'bip39';

const App = () => {
  const [mnemonic, setMnemonic] = useState('');

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Web Based Crypto Wallet</h1>
        
        <div className="mb-4 flex justify-center">
          <button
            onClick={handleGenerateMnemonic}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate Seed Phrase
          </button>
        </div>
        
        {mnemonic && (
          <div className="mt-4 p-4 bg-gray-50 border rounded overflow-x-auto">{mnemonic}</div>
        )}
        
        <div className="flex flex-col items-center mt-6 space-y-4">
          <SolWallet mnemonic={mnemonic} />
          <EthWallet mnemonic={mnemonic} />
        </div>
      </div>
    </div>
  );
};

export default App;
