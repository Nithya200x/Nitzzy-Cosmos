import logo from "../assets/Nitzzy_Cosmos_Logo.png";

const CosmicLoader = () => {
  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-gradient-to-br from-[#050510] via-[#0a0a1f] to-[#050510]
      "
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        
        <div
          className="
            absolute inset-0
            rounded-full
            border border-indigo-400/30
            animate-orbit
          "
        />

        <div
          className="
            w-36 h-36 rounded-full
            bg-black
            ring-4 ring-indigo-400/40
            shadow-[0_0_40px_rgba(124,58,237,0.7)]
            flex items-center justify-center
          "
        >
          <img
            src={logo}
            alt="Loading..."
            className="
              w-full h-full
              rounded-full
              object-cover
              contrast-125
              brightness-110
            "
          />
        </div>
      </div>
    </div>
  );
};

export default CosmicLoader;
