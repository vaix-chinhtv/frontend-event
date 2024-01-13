import React, { useCallback, useEffect, useState } from "react";
import ModalWallet from "../components/ModalWallet";
import { getAccoutAddress } from "../utils/getAccountAddress";
import { LogoIcon } from "../assets";
import { web3Enable } from "@polkadot/extension-dapp";

function Header() {
  const [isModal, setIsModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(getAccoutAddress());

  const [extensionList, setExtensionList] = useState([]);
  const [curExtension, setCurExtension] = useState(undefined);
  const [accountList, setAccountList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const connectWallet = useCallback(async () => {
    const allExtensions = await web3Enable("subwallet-js");
    setExtensionList(allExtensions);
    setCurExtension(allExtensions[0]);
  }, []);

  useEffect(() => {
    curExtension?.accounts.get().then((result) => {
      setAccountList(result);
      localStorage.setItem("address", result[0].address);
      setSelectedAddress(result[0].address || "");
    });
  }, [curExtension]);

  // console.log({ selectedAddress });

  useEffect(() => {
    setCurrentAccount(getAccoutAddress());
  }, []);

  const handleModal = (state) => {
    setIsModal(state);
  };

  return (
    <header className="w-full p-2 shadow-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <div className="">
          <a href="https://cws-hackathon.plats.events/" className="flex items-center">
            <img
              src={LogoIcon}
              className="mr-3 w-[48px] h-[48px] md:h-[72px] md:w-[72px]"
              alt="Flowbite Logo"
              loading="lazy"
            />
          </a>
        </div>
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-opacity-60 text-white font-medium md:font-bold py-2 px-4 md:py-3 md:px-8 rounded text-[16px] md:text-[20px]"
        >
          {selectedAddress ? `${selectedAddress.slice(0, 6)}...${selectedAddress.slice(-6)}` : "Connect Wallet"}
        </button>
        {isModal && <ModalWallet setCurrentAccount={setCurrentAccount} handleModal={handleModal} />}
      </div>
    </header>
  );
}

export default Header;
