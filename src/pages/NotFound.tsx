import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <style>{`
        @keyframes cry-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-2deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-5px) rotate(2deg); }
        }

        @keyframes tear-fall {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(150px); opacity: 0; }
        }

        @keyframes tear-fall-left {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(-15px, 150px); opacity: 0; }
        }

        @keyframes tear-fall-right {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(15px, 150px); opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(96, 165, 250, 0.5)); }
        }

        .crying-character {
          animation: cry-bounce 2s ease-in-out infinite, pulse-glow 3s ease-in-out infinite;
        }

        .tear {
          position: absolute;
          width: 8px;
          height: 12px;
          background: linear-gradient(to bottom, #60A5FA, #93C5FD);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          opacity: 0.8;
        }

        .tear-1 {
          left: 45%;
          top: 35%;
          animation: tear-fall-left 2s ease-in infinite;
          animation-delay: 0s;
        }

        .tear-2 {
          left: 55%;
          top: 35%;
          animation: tear-fall-right 2.2s ease-in infinite;
          animation-delay: 0.3s;
        }

        .tear-3 {
          left: 43%;
          top: 38%;
          animation: tear-fall-left 1.8s ease-in infinite;
          animation-delay: 0.8s;
        }

        .tear-4 {
          left: 57%;
          top: 38%;
          animation: tear-fall-right 2.5s ease-in infinite;
          animation-delay: 1.2s;
        }

        .floating {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Sadness Character with Tears - LEFT SIDE */}
          <div className="flex justify-center relative floating">
            <div className="relative">
              <img
                src="/images/notfound.png"
                alt="Crying Sadness Character"
                className="crying-character w-64 h-auto md:w-80 lg:w-96"
              />
              {/* Animated Tears */}
              <div className="tear tear-1"></div>
              <div className="tear tear-2"></div>
              <div className="tear tear-3"></div>
              <div className="tear tear-4"></div>
            </div>
          </div>

          {/* Text Content - RIGHT SIDE */}
          <div className="text-center lg:text-left max-w-lg">
            <h1 className="mb-4 text-5xl md:text-6xl lg:text-7xl font-bold text-indigo-900">
              Awww...Don't Cry.
            </h1>
            <p className="mb-4 text-2xl md:text-3xl text-indigo-700 font-medium">
              It's just a 404 Error!
            </p>
            <p className="mb-8 text-lg md:text-xl text-indigo-600">
              What you're looking for may have been misplaced in Long Term Memory.
            </p>

            {/* Return Button */}
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Take Me Home
            </Link>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default NotFound;
