"use client";
import React from "react";
import QrGeneratorSection from "@/components/QrGeneratorSection";
import { Toaster } from 'react-hot-toast';

// Main Layout: App Structure
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen h-screen">
       <main className="flex-grow flex flex-col justify-center">
         <QrGeneratorSection/>
       </main>
       <Toaster position="bottom-center" />
    </div>
  );
}