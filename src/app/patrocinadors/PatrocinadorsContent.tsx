"use client";

import React from 'react';
import Image from 'next/image';
import { Mail, Phone, User } from 'lucide-react';
import Header from '@/components/Header';

// Importación de logos de patrocinadores usando rutas relativas
import AdidasLogo from '@/assets/Patrocinadores/Adidas.png';
import FutbolEmotionLogo from '@/assets/Patrocinadores/FutbolEmotion.svg';
import McDonaldsLogo from '@/assets/Patrocinadores/McDonalds.jpeg';
import RovaVillageLogo from '@/assets/Patrocinadores/RovaVillage.webp';
import DammLogo from '@/assets/Patrocinadores/damm.png';
import OtroLogo from '@/assets/Patrocinadores/descarga.png';

// Definición del tipo para patrocinador
type Patrocinador = {
  id: number;
  nombre: string;
  logo: any;
  descripcion: string;
  sector: string;
  web: string;
  destacado: boolean;
};

// Lista de patrocinadores
const patrocinadores: Patrocinador[] = [
  {
    id: 1,
    nombre: 'Adidas',
    logo: AdidasLogo,
    descripcion: 'Adidas és una marca global de roba esportiva que ofereix equipament d\'alta qualitat. El nostre proveïdor oficial d\'equipament esportiu per al FC Cardedeu.',
    sector: 'Equipament Esportiu',
    web: 'https://www.adidas.es',
    destacado: true
  },
  {
    id: 2,
    nombre: 'Fútbol Emotion',
    logo: FutbolEmotionLogo,
    descripcion: 'Botiga especialitzada en material de futbol i equipament esportiu, donant suport al nostre club des de fa anys amb el millor material tècnic.',
    sector: 'Retail Esportiu',
    web: 'https://www.futbolemotion.com',
    destacado: true
  },
  {
    id: 3,
    nombre: 'McDonald\'s',
    logo: McDonaldsLogo,
    descripcion: 'La coneguda cadena de restaurants de menjar ràpid col·labora amb el FC Cardedeu en esdeveniments especials i promocions per als nostres jugadors i aficionats.',
    sector: 'Restauració',
    web: 'https://www.mcdonalds.es',
    destacado: false
  },
  {
    id: 4,
    nombre: 'La Roca Village',
    logo: RovaVillageLogo,
    descripcion: 'Centre comercial outlet de luxe situat prop de Cardedeu que dóna suport al nostre club i promou l\'esport local.',
    sector: 'Retail',
    web: 'https://www.larocavillage.com',
    destacado: false
  },
  {
    id: 5,
    nombre: 'Damm',
    logo: DammLogo,
    descripcion: 'Empresa cervesera amb una llarga tradició de suport a l\'esport català. Patrocinador oficial de la secció sènior del FC Cardedeu.',
    sector: 'Begudes',
    web: 'https://www.damm.com',
    destacado: true
  },
  {
    id: 6,
    nombre: 'Diputació de Barcelona',
    logo: OtroLogo,
    descripcion: 'Entitat pública que col·labora amb el FC Cardedeu en el desenvolupament d\'iniciatives esportives i socials per a la comunitat local.',
    sector: 'Institució Pública',
    web: 'https://www.diba.cat',
    destacado: false
  },
];

export default function PatrocinadorsContent() {
  // Usamos todos los patrocinadores sin distinción
  const todosPatrocinadores = patrocinadores;

  return (
    <>
      <Header />
      <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Els nostres patrocinadors
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gràcies al suport d'aquestes empreses i entitats, el FC Cardedeu 
              segueix creixent i portant l'esport a tota la comunitat. El seu compromís 
              és fonamental per al nostre projecte esportiu i social.
            </p>
            <div className="h-1 w-20 bg-red-600 mx-auto"></div>
          </div>
        </section>

        {/* Todos los patrocinadores en una sola sección */}
        <section className="mb-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todosPatrocinadores.map((patrocinador) => (
              <div key={patrocinador.id} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-transparent hover:border-red-600 transition-colors duration-300 ease-in-out hover:shadow-lg">
                <div className="relative h-60 w-full overflow-hidden border-b border-gray-100">
                    <Image 
                      src={patrocinador.logo} 
                      alt={`Logo de ${patrocinador.nombre}`}
                      className="object-contain w-full h-full"
                      fill
                      sizes="100vw"
                      priority
                    />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{patrocinador.nombre}</h3>
                  <p className="text-red-600 text-sm font-medium mb-3">{patrocinador.sector}</p>
                  <p className="text-gray-600 mb-4">{patrocinador.descripcion}</p>
                  <a 
                    href={patrocinador.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 font-semibold hover:underline flex items-center gap-1 text-sm"
                  >
                    Visitar web
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* CTA - Nuevo Sponsor */}
        <section className="mb-20 py-16 px-4 sm:px-6 lg:px-8 bg-red-600 rounded-2xl">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mx-auto text-white text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Uneix-te com a patrocinador
              </h2>
              <p className="text-xl text-white mb-4">
                Dóna suport al FC Cardedeu i forma part d'un projecte esportiu amb més de 90 anys d'història.
                La teva marca tindrà visibilitat i reconeixement a tota la comarca.
              </p>
              <p className="text-white mb-4">
                Oferim diferents nivells de patrocini adaptats a les necessitats de cada empresa,
                amb visibilitat en equipaments, instal·lacions i comunicacions digitals.
              </p>
              <p className="text-white">
                Contacta amb nosaltres i t'explicarem totes les possibilitats per col·laborar amb el club!
              </p>
            </div>
            
            {/* Contact information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-white bg-opacity-10 p-6 rounded-lg border border-white border-opacity-20 flex flex-col items-center text-center">
                <User size={40} className="mb-4 text-white" />
                <h3 className="font-bold text-xl mb-2 text-white">Responsable</h3>
                <p className="text-white">Nom i Cognom del responsable</p>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg border border-white border-opacity-20 flex flex-col items-center text-center">
                <Mail size={40} className="mb-4 text-white" />
                <h3 className="font-bold text-xl mb-2 text-white">Email</h3>
                <a href="mailto:patrocinis@fccardedeu.cat" className="text-white hover:underline">
                  patrocinis@fccardedeu.cat
                </a>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg border border-white border-opacity-20 flex flex-col items-center text-center">
                <Phone size={40} className="mb-4 text-white" />
                <h3 className="font-bold text-xl mb-2 text-white">Telèfon</h3>
                <a href="tel:+34666123456" className="text-white hover:underline">
                  666 123 456
                </a>
              </div>
            </div>
            
            {/* El botón de solicitar información se ha eliminado según la petición del usuario */}
          </div>
        </section>
        
        {/* Beneficios de patrocinio */}
        <section className="max-w-7xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Beneficis de ser patrocinador
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Visibilitat local",
                description: "Presència de marca en un club amb més de 500 famílies vinculades i gran visibilitat a la comarca."
              },
              {
                title: "Impacte social",
                description: "Associació amb els valors positius de l'esport i contribució a projectes socials i educatius."
              },
              {
                title: "Networking empresarial",
                description: "Accés a una xarxa de contactes amb altres empreses col·laboradores i integració en la comunitat local."
              },
              {
                title: "Exposició mediàtica",
                description: "Presència en comunicacions, xarxes socials i esdeveniments amb cobertura mediàtica local i comarcal."
              },
              {
                title: "Fidelització de clients",
                description: "Millora de la imatge corporativa i possibilitat d'accions promocionals amb la base social del club."
              },
              {
                title: "Responsabilitat social",
                description: "Contribució al desenvolupament de l'esport base i la formació en valors dels joves."
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300">
                <h3 className="font-bold text-xl mb-3 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
