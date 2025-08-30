'use client'
import { useWallet } from "@/app/context/ConnectionProvider"

const Navbar = () => {
    const {connectWallet, account} = useWallet()

     return (
    <nav className="flex justify-end p-4">
      {!account ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="text-green-800 font-medium">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      )}
    </nav>
  );

}

export default Navbar