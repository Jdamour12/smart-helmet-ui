"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthFrame({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/mining-safety.jpg)",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Quote and branding */}
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="space-y-6">
            <p className="text-white text-xl font-semibold leading-relaxed max-w-lg">
              "Safety is not just a priority, it's our commitment. Real-time
              monitoring, instant alerts, lives protected."
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Content Frame */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-0">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
