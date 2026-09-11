import React from 'react';
import { motion } from 'motion/react';

export const WeatherEffects: React.FC<{ condition: string }> = ({ condition }) => {
  const c = condition.toLowerCase();
  const isRain = c.includes("rain") || c.includes("drizzle") || c.includes("shower");
  const isSnow = c.includes("snow") || c.includes("ice") || c.includes("blizzard");
  const isCloudy = c.includes("cloud") || c.includes("overcast") || c.includes("mist") || c.includes("fog");
  const isSun = c.includes("sun") || c.includes("clear");

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Sun/Clear Effects */}
      {isSun && (
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-yellow-400/20 rounded-full blur-[120px]"
        />
      )}

      {/* Cloud/Mist Effects */}
      {isCloudy && (
        <>
          <motion.div
            animate={{ x: [-100, 100], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-0 w-[800px] h-[400px] bg-white/5 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ x: [100, -100], opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-0 w-[600px] h-[300px] bg-blue-400/5 rounded-full blur-[80px]"
          />
        </>
      )}

      {/* Rain Effects */}
      {isRain && (
        <div className="absolute inset-0 flex justify-around">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, opacity: 0 }}
              animate={{ 
                y: [null, 1000],
                opacity: [0, 0.3, 0]
              }}
              transition={{ 
                duration: 1 + Math.random(), 
                repeat: Infinity, 
                delay: Math.random() * 2,
                ease: "linear"
              }}
              className="w-[1px] h-20 bg-blue-300/30 blur-[1px]"
              style={{ marginLeft: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      )}

      {/* Snow Effects */}
      {isSnow && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -50, x: Math.random() * 100 + "%", opacity: 0 }}
              animate={{ 
                y: [null, 1000],
                x: [null, (Math.random() * 10 + 45) + "%"],
                opacity: [0, 0.5, 0],
                rotate: 360
              }}
              transition={{ 
                duration: 3 + Math.random() * 5, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "linear"
              }}
              className="w-2 h-2 bg-white/40 rounded-full blur-[1px]"
            />
          ))}
        </div>
      )}
    </div>
  );
};
