import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onFinish: () => void;
}

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Seeds...');

  // Periodic simulated loading text updates to make it feel authentic
  useEffect(() => {
    const textInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 20) {
          setLoadingText('Connecting to Provably Fair Server...');
        } else if (prev < 50) {
          setLoadingText('Preloading Multiplayer State...');
        } else if (prev < 80) {
          setLoadingText('Synchronizing Aviator Engine...');
        } else {
          setLoadingText('Starting Round Simulators...');
        }
        return prev;
      });
    }, 400);

    return () => clearInterval(textInterval);
  }, []);

  // Smooth loading progression mimicking authentic asset load stages
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2400; // Snappy and premium loading time

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const rawProgress = Math.min(1.0, elapsed / duration);
      
      // Custom non-linear easing to simulate realistic asset loading gates
      let easingProgress = 0;
      if (rawProgress < 0.25) {
        easingProgress = rawProgress * 1.5; 
      } else if (rawProgress < 0.55) {
        easingProgress = 0.37 + (rawProgress - 0.25) * 0.4; 
      } else if (rawProgress < 0.8) {
        easingProgress = 0.49 + (rawProgress - 0.55) * 1.4; 
      } else {
        easingProgress = 0.84 + (rawProgress - 0.8) * 0.8; 
      }

      const percent = Math.min(100, Math.floor(easingProgress * 100));
      setProgress(percent);

      if (elapsed < duration) {
        window.requestAnimationFrame(step);
      } else {
        setProgress(100);
        setTimeout(() => {
          onFinish();
        }, 300); // Quick exit transition
      }
    };

    window.requestAnimationFrame(step);
  }, [onFinish]);

  return (
    <motion.div
      id="app_loading_overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#070809]/75 backdrop-blur-md select-none p-4 pointer-events-auto h-screen w-screen text-white overflow-hidden animate-fade-in"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-sm bg-[#111215]/95 rounded-2xl border border-white/[0.06] p-6 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden flex flex-col items-center justify-center"
      >
        {/* Ambient top light glow */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#e50539] to-transparent opacity-60" />

        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="flex items-center gap-4 border-b border-[#e50539]/25 pb-3 mb-3">
            {/* UFC bold italic logo */}
            <span className="text-red-600 text-[32px] font-black tracking-tighter uppercase italic leading-none font-sans drop-shadow-md">
              UFC
            </span>
            <span className="h-6 w-[2px] bg-[#3a3b3c]" />
            <svg 
              viewBox="0 0 108 28" 
              className="h-[22px] md:h-[26px] w-auto flex-shrink-0 select-none filter drop-shadow-[0_2px_6px_rgba(229,5,57,0.4)]"
            >
              <g fill="#E50539" fillRule="evenodd">
                <path d="m35.8316 8.4608-3.1805 12.6395c-.265 1.0105-.8613 1.8802-1.7931 2.605-.9319.7247-1.9174 1.0891-2.9489 1.0891l4.1167-16.3336H26.936l-.526 2.4765-4.0792 16.3336h4.9489c2.4145 0 4.7089-.8945 6.8872-2.6793 2.1783-1.7848 3.5616-3.8848 4.1579-6.2993l1.8387-7.355.621-2.4765h-4.9529Z"/>
                <path d="M49.5521.7413c-.4142-.4928-.965-.7412-1.6526-.7412-.6913 0-1.321.2484-1.8966.7412-.5715.4929-.9151 1.0851-1.0272 1.7725-.1201.7166.0291 1.317.4433 1.8098.41.4929.9607.7415 1.6483.7415.6916 0 1.3251-.253 1.901-.7579.5714-.5055.9194-1.1018 1.031-1.7934.112-.6874-.0373-1.2796-.4472-1.7725m-4.6426 22.206c.0086-.0495.025-.1118.0498-.1864.0248-.0746.0415-.12.0455-.1492l3.5408-14.151h-8.204l-.6253 2.4765h3.284l-2.9484 11.6745c-.0415.1037-.0746.2486-.1077.4474-.2115 1.2798.1158 2.2944.977 3.0482.8617.7496 2.1412 1.1263 3.8436 1.1263h.737l.6293-2.4764c-.9854-.145-1.3956-.7496-1.2216-1.8099M58.5553 21.9866c-.1987.762-.6377 1.4164-1.3167 1.9588-.6792.5427-1.404.8118-2.1662.8118-1.4288 0-2.0291-.6876-1.8056-2.0709.0043-.0205.0208-.0827.0499-.182.0288-.0994.0455-.174.0536-.2236l2.373-9.4965c.3232-1.2297 1.0022-1.847 2.0377-1.847h3.5492l-2.7749 11.0494Zm4.6093 1.404c.0083-.0498.025-.0994.0458-.1492a.6234.6234 0 0 0 .0412-.145l3.6569-14.6357h-8.5352c-1.7768 0-3.429.5013-4.9575 1.4994-1.5322.9978-2.4805 2.2486-2.8492 3.748l-2.0623 8.2785c-.0455.1242-.0826.2814-.112.4805-.2276 1.379.174 2.518 1.2093 3.4164 1.0353.8987 2.3897 1.3501 4.067 1.3501h.7747c1.4532 0 2.8034-.505 4.0541-1.5158.6254 1.0108 1.7975 1.5158 3.5204 1.5158h1.739l.6257-2.4764c-.9526-.0499-1.3585-.5053-1.218-1.3666ZM87.1847 13.3021l-.0663.4059-2.0582 8.2785c-.2195.8864-.5799 1.5697-1.0768 2.0502-.4969.4802-1.0145.7204-1.557.7204-.4928 0-.8699-.2195-1.1306-.6669-.261-.443-.3312-1.0062-.2197-1.6978.0083-.0498.025-.116.054-.2028.0249-.0873.0416-.1532.0496-.203l2.0582-8.2786c.2072-.8118.5508-1.4703 1.0273-1.9755.4761-.505 1.0102-.758 1.6024-.758.493 0 .8657.2031 1.1183.609.2526.41.3232.9815.1988 1.7186m3.7686-3.4913c-1.0229-.8985-2.3687-1.3501-4.046-1.3501h-.7746c-1.826 0-3.491.5055-4.9985 1.516-1.5077 1.0105-2.4433 2.257-2.8077 3.7313l-2.1 8.2785a2.7992 2.7992 0 0 0-.1117.4805c-.2319 1.4037.1697 2.547 1.2093 3.4374 1.0355.8861 2.4061 1.3294 4.104 1.3294h.7374c1.8015 0 3.4581-.5136 4.982-1.5324 1.5241-1.023 2.464-2.2613 2.8285-3.7149l2.0956-8.2785.0786-.4762c.2238-1.3833-.174-2.522-1.1969-3.421M106.1978 8.4608c-1.996 0-3.7232.53-5.1767 1.5904l.3727-1.5904h-4.9281L91.736 27.2337h4.9532l2.5718-10.2705c.3273-1.2591.969-2.4353 1.9257-3.5285.9567-1.0975 2.0334-1.8553 3.2387-2.2736l-.5882 2.4393h2.7002l1.321-5.1396h-1.6606ZM12.6644 13.9475l.008-.0557 2.2713-8.8628c.1675-.7412.5182-1.355 1.052-1.8333.5343-.4778 1.1398-.7172 1.8012-.7172.622 0 1.076.2074 1.379.6297.295.4145.3983.9483.295 1.5863l-.0558.3345-2.2715 8.8628-.016.0557h-4.4632Zm10.337-12.545C21.8697.4701 20.3474.0002 18.4266.0002c-2.0959 0-3.937.526-5.539 1.5701-1.6019 1.044-2.6143 2.4307-3.0447 4.16l-2.0563 8.1615c-1.7374 0-3.3474.0078-4.5987.0078C1.4189 13.8996 0 15.3424 0 17.1118h6.9737L4.4313 27.2334H9.341l2.5505-10.1216h4.4711l-1.586 6.2802c-.0477.1196-.0798.279-.1116.4783-.1753 1.06.0318 1.8885.6295 2.4786.5898.5896 1.4904.8845 2.6938.8845h1.961l.6294-2.4786c-.7095-.0477-1.0044-.4304-.8845-1.1398l4.487-17.8846c.0078-.0555.024-.1514.0638-.295.0399-.1513.0557-.2472.0636-.3027.255-1.5462-.1835-2.7897-1.307-3.7302ZM76.0941 8.4608l1.1223-4.3566h-4.9532l-1.0848 4.3566h-2.431l-.6297 2.4765h2.4353l-2.957 11.712c-.0083.0497-.0288.1367-.0622.2609-.0331.1242-.0495.2071-.0579.2607-.207 1.2548.0372 2.2448.7288 2.9736.696.7248 1.7436 1.0892 3.1474 1.0892h1.7396l.6334-2.5139c-1.0186-.095-1.4412-.675-1.2669-1.735.008-.0498.0245-.112.0493-.1864.021-.0748.0377-.1204.0417-.1492l2.9527-11.712h2.108l.6297-2.4764H76.094Z"/>
              </g>
            </svg>
          </div>
          <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] font-sans">
            OFFICIAL PARTNERS
          </h2>
        </div>

        {/* Counter */}
        <div className="mb-5">
          <span className="text-[44px] font-black font-sans text-white leading-none block tracking-tighter">
            {progress}%
          </span>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block mt-1.5 h-4">
            {loadingText}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-4/5 h-[6px] bg-[#1a1c1e] rounded-full overflow-hidden border border-white/[0.03] mb-6 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] relative">
          <div 
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-[#e50539] to-[#ff3562] rounded-full shadow-[0_0_8px_2px_rgba(229,5,57,0.4)] transition-all duration-75 ease-out"
          />
        </div>

        {/* Spribe custom badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#0e160e]/95 border border-[#22c55e]/30 rounded-lg shadow-md mb-4 pr-4 select-none">
          <span className="text-[#22c55e] text-[16px]">🛡️</span>
          <div className="flex flex-col text-left leading-none font-sans">
            <span className="text-[#a3e635] font-black text-[9px] uppercase tracking-widest leading-none">SPRIBE</span>
            <span className="text-[#ffffff] font-extrabold text-[8.5px] uppercase flex items-center gap-0.5 mt-0.5 leading-none">
              Official Game <span className="text-[#22c55e] font-bold">✔</span>
            </span>
            <span className="text-[#8e8f90] text-[7.5px] mt-0.5 leading-none">Since 2019</span>
          </div>
        </div>

        {/* System safety check tag */}
        <div className="flex items-center justify-center gap-1.5 opacity-45">
          <svg viewBox="0 0 24 24" className="w-[11px] h-[11px] fill-none stroke-zinc-400 stroke-2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-[0.2em] font-mono">
            PROVABLY FAIR SYSTEM
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
