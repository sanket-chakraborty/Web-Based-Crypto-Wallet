'use client';
import React, { useState, useEffect } from 'react';
import nacl from 'tweetnacl';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair, Connection, PublicKey } from '@solana/web3.js';

const clusters = {
  mainnet: 'https://solana-mainnet.g.alchemy.com/v2/nsnNv9LSLvPTXwrS3tyKRu1lNDkXae-l',
  devnet: 'https://solana-devnet.g.alchemy.com/v2/nsnNv9LSLvPTXwrS3tyKRu1lNDkXae-l',
};

const SolWallet = ({ mnemonic }) => {
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [balances, setBalances] = useState({});
  const [addressIndex, setAddressIndex] = useState(0);
  const [selectedCluster, setSelectedCluster] = useState('devnet');
  const [connection, setConnection] = useState(new Connection(clusters[selectedCluster]));

  useEffect(() => {
    const newConnection = new Connection(clusters[selectedCluster]);
    setConnection(newConnection);

    walletAddresses.forEach((address) => recheckBalance(address, newConnection));
  }, [selectedCluster]);

  const handleAddWallet = async () => {
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

      setWalletAddresses((prev) => [...prev, newWalletAddress]);
      setAddressIndex(addressIndex + 1);

      const balance = await connection.getBalance(new PublicKey(newWalletAddress));
      setBalances((prevBalances) => ({
        ...prevBalances,
        [newWalletAddress]: balance / 1e9, 
      }));
    } catch (error) {
      console.error('Error generating wallet address:', error);
    }
  };

  const recheckBalance = async (address, connectionToUse = connection) => {
    try {
      const balance = await connectionToUse.getBalance(new PublicKey(address));
      setBalances((prevBalances) => ({
        ...prevBalances,
        [address]: balance / 1e9, 
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
      className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option value="mainnet">Mainnet</option>
      <option value="devnet">Devnet</option>
    </select>
  </div>
  <div className="flex justify-center">
    <button
      onClick={handleAddWallet}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      Add Sol Wallet
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
              <strong>Balance:</strong> {balances[address] !== undefined ? `${balances[address]} SOL` : 'Loading...'}
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

export default SolWallet;
