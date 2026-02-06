import shh_emoji from "../assets/shhh.png";
import lock from "../assets/apple_lock.png";
import lightning from "../assets/apple_lightning.png";


function Landing() {

  return (
    <div className="bg-background text-foreground">

      {/* HERO */}
      <section className="flex flex-col items-center text-center mt-20 px-6">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Less noise. More conversation.
        </h1>

        <p className="mt-4 max-w-xl text-foreground/60 text-lg">
          A calm, private place to talk — without algorithms,
          ads, or unnecessary distractions.
        </p>

        <div className="flex items-center gap-3 mt-6 text-sm text-foreground/60">
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
          {[{
            title: "Private by default",
            text: "Your messages never touch our servers. Privacy isn’t a setting — it’s the foundation.",
            img: shh_emoji
          }, {
            title: "End-to-end encrypted",
            text: "Messages are encrypted and delivered directly, without intermediaries.",
            img: lock
          }, {
            title: "Built for speed",
            text: "Fast delivery, no trackers, no bloat.",
            img: lightning
          }].map((item, i) => (
            <div key={i} className="rounded-xl bg-foreground/5 border border-border p-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <img src={item.img} />
              </div>
              <h3 className="font-medium text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">{item.text}</p>
            </div>
          ))}
        </div>

        {/* AI SECTION */}
        <div className="mt-10">
          <h2 className="font-bold text-4xl text-center">Assisted By AI</h2>
          <p className="text-sm text-foreground/60 mt-3 text-center">
            Supercharge your productivity
          </p>

          <div className="flex flex-row items-center gap-2 md:flex-col">
            {["Smart Replies", "Summarize Chats", "Use AI in Chats"].map((t, i) => (
              <div key={i} className="rounded-xl bg-foreground/5 border border-border p-6 mt-5">
                <h3 className="font-medium text-lg">{t}</h3>
                <p className="text-foreground/60 text-sm">
                  AI assistance designed to help you move faster.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-32" />
    </div>
  );
}

export default Landing;
