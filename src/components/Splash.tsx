import { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

const Splash = ({ onComplete }: SplashProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center gradient-primary transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center animate-pulse-glow">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-entrance">
          <DollarSign className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl font-bold text-white mb-2 animate-entrance">CoinFlow</h1>
        <p className="text-white/80 text-lg animate-entrance">Your Beautiful Expense Tracker</p>
      </div>
    </div>
  );
};

export default Splash;
