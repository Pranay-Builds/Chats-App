import shh_emoji from "./assets/shhh.png";
import lock from "./assets/apple_lock.png"
import lightning from "./assets/apple_lightning.png"
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">

      {/* NAV */}
      <Navbar />

      {/* HERO */}
      <section className="flex flex-col items-center text-center mt-20 px-6">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Less noise. More conversation.
        </h1>

        <p className="mt-4 max-w-xl text-[#9ba3b4] text-lg">
          A calm, private place to talk — without algorithms,
          ads, or unnecessary distractions.
        </p>


        <div className="flex items-center gap-3 mt-6 text-sm text-[#9ba3b4]">
          <span>Private</span>
          <span className="opacity-40">•</span>
          <span>Secure</span>
          <span className="opacity-40">•</span>
          <span>Fast</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-20 px-6 flex items-center justify-center flex-col">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-white/2 border border-white/5 p-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <img src={shh_emoji}></img>
            </div>
            <h3 className="font-medium text-lg">Private by default</h3>
            <p className="mt-2 text-sm text-[#9ba3b4]">
              Your messages never touch our servers.
              Privacy isn’t a setting — it’s the foundation.
            </p>
          </div>

          <div className="rounded-xl bg-white/2 border border-white/5 p-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <img src={lock}></img>
            </div>
            <h3 className="font-medium text-lg">End-to-end encrypted</h3>
            <p className="mt-2 text-sm text-[#9ba3b4]">
              Messages are encrypted and delivered directly,
              without intermediaries.
            </p>
          </div>

          <div className="rounded-xl bg-white/2 border border-white/5 p-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <img src={lightning}></img>
            </div>
            <h3 className="font-medium text-lg">Built for speed</h3>
            <p className="mt-2 text-sm text-[#9ba3b4]">
              Fast delivery, no trackers, no bloat.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-bold text-4xl text-center">Assisted By AI</h2>
          <p className="text-sm text-gray-400 mt-3 text-center">Supercharge your productivity</p>


          <div className="flex flex-row items-center gap-2 md:flex-col">
            <div className="rounded-xl bg-white/2 border border-white/5 p-6 mt-5">
              <h3 className="font-medium text-lg">Smart Replies</h3>
              <p className="text-gray-400 text-sm">Save time by drafting replies fast assisted by AI - based on your style</p>
            </div>

            <div className="rounded-xl bg-white/2 border border-white/5 p-6 mt-5">
              <h3 className="font-medium text-lg">Summarize Chats</h3>
              <p className="text-gray-400 text-sm">Catch up quickly on the chats with AI powered chats summaries</p>
            </div>


            <div className="rounded-xl bg-white/2 border border-white/5 p-6 mt-5">
              <h3 className="font-medium text-lg">Use AI in Chats</h3>
              <p className="text-gray-400 text-sm">Ask questions, get insights, and explore ideas with AI assistance in your conversations</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SPACER */}
      <div className="h-32" />
    </div>
  );
}

export default App;