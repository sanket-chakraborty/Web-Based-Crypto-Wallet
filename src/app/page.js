'use client';
import React, { useState } from 'react';
import Link from 'next/link';
const App = () => {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Which Wallet Do You Want to Add?</h1>
          <div className="flex justify-around mb-6">
            <Link href={"/SolWallet"}>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sol Wallet
            </button>
            </Link>
            
            <Link href={"/EthWallet"}>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Eth Wallet
            </button>
            </Link>
            
          </div>
        </div>
      
    </div>
  );
};

export default App;
