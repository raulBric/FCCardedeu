"use client";

import React from 'react';
import Image from 'next/image';
import { Mail, Phone, User } from 'lucide-react';
import Header from '@/components/Header';

// Importación de logos de patrocinadores usando rutas relativas
import Llorens from "@/assets/Patrocinadores/logo_llorens_verd.png"
import Informatica from "@/assets/Patrocinadores/CentreInformatic.png"
import Origo from "@/assets/Patrocinadores/OrigoBlau.png"
import Clinica from "@/assets/Patrocinadores/ClinicaPobleSec.png"
import Gabident from "@/assets/Patrocinadores/Gabident_test.png"
import { el } from 'date-fns/locale';

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
    nombre: 'Llorens GMR',
    logo: Llorens,
    descripcion: 'Llorens GMR és una empresa líder en la gestió integral de residus, compromesa amb la sostenibilitat i economia circular.',
    sector: 'Gestor de material reciclatge',
    web: 'https://llorensgmr.com/es/',
    destacado: true
  },
  {
    id: 2,
    nombre: 'Centre Informàtic Poble Sec',
    logo: Informatica,
    descripcion: 'Centre Informàtic del Poble Sec és un servei tècnic de proximitat, especialitzat en solucions informàtiques amb un tracte professional i de confiança.',
    sector: 'Serveis informàtics',
    web: 'https://cips.cat/',
    destacado: true
  },
  {
    id: 3,
    nombre: 'Gabident',
    logo: Gabident,
    descripcion: 'Gabident és una clínica dental a Cardedeu amb més de 25 anys d\'experiència, que ofereix un tracte proper i familiar en totes les especialitats odontològiques.',
    sector: 'Salut',
    web: 'https://clinicagabidentcardedeu.com/',
    destacado: false
  },
  {
    id: 4,
    nombre: 'Origo',
    logo: Origo,
    descripcion: 'Origo és una cadena de botigues d\'alimentació saludable, compromesa amb els productes de proximitat i la sostenibilitat.',
    sector: 'Comerç al detall d\'alimentació ',
    web: 'https://origo.cat/',
    destacado: false
  },
  {
    id: 5,
    nombre: 'Clínica Dental Poble Sec',
    logo: Clinica,
    descripcion: 'Clínica Dental Poble Sec és un centre de salut bucodental, compromès amb oferir tractaments integrals',
    sector: 'Salut',
    web: 'https://clinicadentalpoblesec.com/',
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
                <p className="text-white">Aleix</p>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg border border-white border-opacity-20 flex flex-col items-center text-center">
                <Mail size={40} className="mb-4 text-white" />
                <h3 className="font-bold text-xl mb-2 text-white">Email</h3>
                <a href="mailto:publicitat@fccardedeu.org" className="text-white hover:underline">
                  publicitat@fccardedeu.org
                </a>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg border border-white border-opacity-20 flex flex-col items-center text-center">
                <Phone size={40} className="mb-4 text-white" />
                <h3 className="font-bold text-xl mb-2 text-white">Telèfon</h3>
                <a href="tel:+34666123456" className="text-white hover:underline">
                  
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
