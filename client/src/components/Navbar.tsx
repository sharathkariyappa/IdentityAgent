import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Navbar: React.FC = () => {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <div className="text-xl font-bold">DAgent</div>
            <div className="flex gap-4">
                <button className="px-4 py-2 text-sm bg-blue rounded hover:bg-blue">About</button>
                <ConnectButton />
            </div>
        </nav>
    );
};

export default Navbar;
