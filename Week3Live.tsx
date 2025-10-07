import React from "react";
import Week3LiveDemo from "../components/Week3LiveDemo";

export default function Week3Live() {
  return (
    <main className="min-h-screen p-6 flex flex-col items-center gap-8">
      <header className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold">Week 3 Live</h1>
        <p className="text-sm text-gray-600">Interactive components & user input</p>
      </header>

      <section className="w-full max-w-3xl">
        <Week3LiveDemo />
      </section>
    </main>
  );
}
