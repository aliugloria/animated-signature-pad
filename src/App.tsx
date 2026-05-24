import { CornerRightUp, PenLine } from "lucide-react";
import "./App.css";
import Socials from "./components/socials";
import { useState } from "react";
import SignaturePad from "./components/signature-pad/signature-pad";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="mainContent w-full h-full flex flex-col items-center justify-center relative ">
        {!isModalOpen && (
          <div className="relative flex items-center justify-center w-full">
            <p className="font-penScript absolute left-1/2 translate-x-[-165px] top-[65px] rotate-[-8deg] text-[32px] text-black/70 font-medium tracking-wide">
              open to sign
            </p>

            <CornerRightUp
              className="absolute left-[46%] translate-x-[10px] top-[80px] text-black/20 rotate-50"
              size={50}
              strokeWidth={1.5}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="group absolute left-[46%] translate-x-[55px] top-[60px] flex h-10 w-10 items-center justify-center rounded-full bg-black shadow-2xl transition-all ease-in-out hover:scale-110"
            >
              <PenLine className="text-white" size={18} strokeWidth={2.2} />
            </button>
          </div>
        )}

        <SignaturePad
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </section>

      <Socials />
    </>
  );
}

export default App;


 