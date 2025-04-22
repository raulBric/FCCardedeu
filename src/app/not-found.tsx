import Link from "next/link";
import Image from "next/image";
import { Home, Trophy } from 'lucide-react';
import Banderin from "@/assets/Banderin.webp";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
    <Header />
    <div className="pt-20 min-h-screen  flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-sm sm:max-w-md  overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 text-center">
          <div className="space-y-2 sm:space-y-4">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-red-600">
              404
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-1 w-12 sm:w-16 bg-red-600"></div>
              <div className="h-3 w-3 sm:h-4 sm:w-4 bg-red-600 rounded-full"></div>
              <div className="h-1 w-12 sm:w-16 bg-red-600"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Fora de joc!
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 px-2">
              La pàgina que busques està en posició avançada
            </p>
          </div>

          {/* Banderín como imagen */}
          <div className="relative flex justify-center py-4 sm:py-6 md:py-8 h-40 sm:h-48 md:h-56">
            <div className="relative h-full">
              <Image
                src={Banderin || "/placeholder.svg"}
                alt="Banderí de línia"
                width={150}
                height={200}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">

            <div className="pt-2 sm:pt-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <Home className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Tornar al terreny de joc
              </Link>
            </div>
          </div>

          {/* Patrón de rayas rojas y blancas - adaptativo
          <div className="flex justify-center pt-2 sm:pt-4">
            <div className="grid grid-cols-10 w-full max-w-[16rem] sm:max-w-xs">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 sm:h-6 ${i % 2 === 0 ? "bg-red-600" : "bg-white"}`}
                ></div>
              ))}
            </div>
          </div> */}

          <div className="pt-2 text-xs sm:text-sm text-gray-500 flex items-center justify-center">
            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-red-600" />
            <span>Orgullosos dels nostres colors des de sempre</span>
          </div>
        </div>

        {/* <div className="h-6 sm:h-8 bg-gradient-to-r from-red-600 via-white to-red-600"></div> */}
      </div>
    </div>
    </>
  );
}