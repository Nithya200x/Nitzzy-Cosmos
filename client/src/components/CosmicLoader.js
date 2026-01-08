import logo from "../assets/Nitzzy_Cosmos_Logo.png";

const CosmicLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center
                    bg-gradient-to-br from-[#050510] via-[#0a0a1f] to-[#050510]">
      <img
        src={logo}
        alt="Loading..."
        className="
          w-40 h-40 object-contain
          animate-pulse
          drop-shadow-[0_0_40px_rgba(124,58,237,0.85)]
        "
      />
    </div>
  );
};

export default CosmicLoader;
