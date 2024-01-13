import { useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import Input from "../components/Input";
import Textera from "../components/Textera";
import { WsProvider } from "@polkadot/api";
import { createTestPairs } from "@polkadot/keyring/testingPairs";
import { SubstrateSigner, BodhiProvider, BodhiSigner } from "@acala-network/bodhi";
import { ethers } from "ethers";
import Abi from "../utils/abi.json";
import { useCallback, useEffect, useMemo, useState } from "react";
import { web3Enable } from "@polkadot/extension-dapp";
import { ContractFactory, Contract } from "ethers";
// import { formatUnits } from "ethers/src.ts/utils/";

function CrowsponsorACA() {
  const [searchParams] = useSearchParams();
  const searchParamsObject = Object.fromEntries([...searchParams]);
  const { name, price_type, total_price, blockchain, end_at, des } = searchParamsObject;

  /* ---------- extensions ---------- */
  const [extensionList, setExtensionList] = useState([]);
  const [curExtension, setCurExtension] = useState(undefined);
  const [accountList, setAccountList] = useState([]);

  /* ---------- status flags ---------- */
  const [connecting, setConnecting] = useState(false);
  const [loadingAccount, setLoadingAccountInfo] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [calling, setCalling] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  /* ---------- data ---------- */
  const [provider, setProvider] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [evmAddress, setEvmAddress] = useState("");
  const [isClaimed, setIsClaimed] = useState(false);
  const [balance, setBalance] = useState("");
  const [deployedAddress, setDeployedAddress] = useState("");
  const [echoInput, setEchoInput] = useState("calling an EVM+ contract with polkadot wallet!");
  const [echoMsg, setEchoMsg] = useState("");
  const [newEchoMsg, setNewEchoMsg] = useState("");
  const [url, setUrl] = useState("wss://mandala-tc9-rpc.aca-staging.network");

  /* ------------ Step 1: connect to chain node with a provider ------------ */
  useEffect(() => {
    setConnecting(true);
    const fetch = async () => {
      try {
        const signerProvider = new BodhiProvider({
          provider: new WsProvider("wss://mandala-tc9-rpc.aca-staging.network"),
        });

        await signerProvider.isReady();

        setProvider(signerProvider);
      } catch (error) {
        console.error(error);
        setProvider(null);
      } finally {
        setConnecting(false);
      }
    };
    fetch();
  }, []);

  /* ------------ Step 2: connect polkadot wallet ------------ */
  useEffect(() => {
    const fetch = async () => {
      const allExtensions = await web3Enable("bodhijs-example");
      setExtensionList(allExtensions);
      setCurExtension(allExtensions[0]);
    };
    fetch();
  }, []);

  useEffect(() => {
    curExtension?.accounts.get().then((result) => {
      setAccountList(result);
      setSelectedAddress(result[0].address || "");
    });
  }, [curExtension]);

  /* ----------
     Step 2.1: create a bodhi signer from provider and extension signer
                                                             ---------- */
  const signer = useMemo(() => {
    if (!provider || !curExtension || !selectedAddress) return null;
    return new BodhiSigner(provider, selectedAddress, curExtension.signer);
  }, [provider, curExtension, selectedAddress]);

  const claimDefaultAccount = useCallback(async () => {
    if (!signer) return;

    setIsClaiming(true);
    try {
      await signer.claimDefaultAccount();
    } finally {
      setIsClaiming(false);
      setIsClaimed(true);
      const bal = await signer.getBalance();
      //   setBalance(formatUnits(bal));
    }
  }, [signer, setIsClaiming]);

  useEffect(() => {
    (async function fetchAccountInfo() {
      if (!signer) return;

      setLoadingAccountInfo(true);
      try {
        const [evmAddr, accountBalance, claimed] = await Promise.all([
          signer.getAddress(),
          signer.getBalance(),
          signer.isClaimed(),
        ]);

        console.log(accountBalance.toString());
        // setBalance(formatUnits(accountBalance));
        setEvmAddress(evmAddr);
        setIsClaimed(claimed);
      } catch (error) {
        console.error(error);
        setEvmAddress("");
        setBalance("");
      } finally {
        setLoadingAccountInfo(false);
      }
    })();
  }, [signer]);

  //   const deploy = useCallback(async () => {
  //     if (!signer) return;

  //     setDeploying(true);
  //     try {
  //       const factory = new ContractFactory(echobi, echoContract.bytecode, signer);

  //       const contract = await factory.deploy();
  //       const echo = await contract.echo();

  //       setDeployedAddress(contract.address);
  //       setEchoMsg(echo);
  //     } finally {
  //       setDeploying(false);
  //     }
  //   }, [signer]);

  /* ------------ Step 4: call contract ------------ */
  const callContract = useCallback(
    async (msg) => {
      if (!signer) return;
      setCalling(true);
      setNewEchoMsg("");
      try {
        const instance = new Contract("0x1CFAC008f7757e320fE74248B9F6618c5B43D677", Abi, signer);

        console.log(ethers.parseEther("1").toString());

        await instance.deposit(0, "1", 1000, { value: ethers.parseEther("1").toString() });
        // const newEcho = await instance.echo();

        // setNewEchoMsg(newEcho);
      } finally {
        setCalling(false);
      }
    },
    [signer, deployedAddress]
  );

  return (
    <div className="w-full">
      <ToastContainer />

      <Header />
      <div className="max-w-[1200px] mx-auto ">
        <h1 className="text-[24px] font-semibold mt-4 border-b-2 w-fit border-b-blue-400">Crowd Sponsor</h1>
        <div className="p-4 pt-0 border-2 rounded-lg mt-8">
          <Input label="Name" value={name} />
          <div className="grid grid-cols-2 gap-10">
            <Input label="Blockchain" value={blockchain} />
            <Input label="Token" value={price_type} />
          </div>
          <div className="grid grid-cols-2 gap-10">
            <Input label="Total Price" value={total_price} />
            <Input label="End At" value={end_at} />
          </div>
          <Textera label="Description" value={des} />
          <div className="w-[80%] flex flex-col items-end">
            <div className="w-full">
              <h1 className="text-[20px] font-bold mt-4">Sponsor package1</h1>
              <div>
                <Input label="Name" value="Platinum" />
                <Input label="Price" value="500" />
                <Textera
                  label="Description"
                  value="Event and pre-event naming opportunities (common with Title Sponsors!)
Sponsor representative on the event planning committee
A thank you from all speakers during opening and closing ceremonies
Free tickets to events and VIP sessions
Reserved seating
Event speaker opportunities"
                />
              </div>
            </div>
            <div className="w-full">
              <h1 className="text-[20px] font-bold mt-4">Sponsor package2</h1>
              <div>
                <Input label="Name" value="Gold" />
                <Input label="Price" value="300" />
                <Textera
                  label="Description"
                  value="Special blog posts and newsletter features
Social media spotlights
Attendee discounts for those who purchase sponsor’s product, sign up for service, join a newsletter, or give a follow on social media
Press and media opportunities like interviews"
                />
              </div>
            </div>
            <div className="w-full">
              <h1 className="text-[20px] font-bold mt-4">Sponsor package3</h1>
              <div>
                <Input label="Name" value="Silver" />
                <Input label="Price" value="200" />
                <Textera
                  label="Description"
                  value="Branding opportunities on swag and promotional gear
On-site signage and banners
Logo on flyers, ads, badges and programs
Logo on website and digital promotion
Banners on event apps
Free or heavily discounted booths"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={callContract}
        className="mt-4 bg-blue-500 hover:bg-opacity-60 text-white font-medium md:font-bold  md:py-3 md:px-8 rounded text-[16px] md:text-[20px] relative left-[50%] -translate-x-[50%] items-center flex"
      >
        Deposit
      </button>
    </div>
  );
}

export default CrowsponsorACA;
