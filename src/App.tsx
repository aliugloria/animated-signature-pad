import { CornerRightUp, PenLine } from "lucide-react";
import "./App.css";
import Socials from "./components/socials";
import { useState } from "react";
import SignaturePad from "./components/signature-pad/signature-pad";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="w-full max-w-2xl h-screen mx-auto flex flex-col gap-10 py-20 ">
      <section className="mainContent w-full h-full flex flex-col items-center justify-center relative">
        {!isModalOpen && (
          <div className="relative flex items-center justify-center w-full">
            <p className="font-penScript absolute left-[65%] md:left-[53%] translate-x-[-165px] top-[65px] rotate-[-8deg] text-[24px] text-black/70 font-medium tracking-wide">
              open to sign
            </p>

            <CornerRightUp
              className="absolute left-[44%] translate-x-[10px] top-[80px] text-black/20 rotate-50"
              size={40}
              strokeWidth={1.5}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="group absolute left-[44%] translate-x-[55px] top-[60px] flex h-8 w-8 items-center justify-center rounded-full bg-black shadow-2xl transition-all ease-in-out hover:scale-110"
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
    </main>
  );
}

export default App;
