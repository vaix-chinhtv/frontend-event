import { useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import Input from "../components/Input";
import Textera from "../components/Textera";
import { WsProvider } from "@polkadot/api";
import { createTestPairs } from "@polkadot/keyring/testingPairs";
import { SubstrateSigner, BodhiProvider, BodhiSigner } from "@acala-network/bodhi";

function CrowsponsorACA() {
  const [searchParams] = useSearchParams();
  const searchParamsObject = Object.fromEntries([...searchParams]);
  const { name, price_type, total_price, blockchain, end_at, des } = searchParamsObject;

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
      <button className="mt-4 bg-blue-500 hover:bg-opacity-60 text-white font-medium md:font-bold  md:py-3 md:px-8 rounded text-[16px] md:text-[20px] relative left-[50%] -translate-x-[50%] items-center flex">
        Deposit
      </button>
    </div>
  );
}

export default CrowsponsorACA;
