"use client";
import React, { useState } from "react";
import Navbutton from "./Navbutton";
import { navItems } from "../NavItems";


function Navmenu() {
  const [menuOpen, setMenuOpen] = useState(Boolean);
  return (
    <div className="relative block sm:hidden text-black ">
      <Navbutton menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      {menuOpen && (
        <div className="absolute -top-2 -right-2 w-64 min-h-64 rounded-md bg-slate-500 p-8 z-10 flex flex-col">
          <ul className="flex flex-col gap-2 flex-1">
            {navItems.map(({ label }) => (
              <li className="text-lg font-medium text-black" key={label}>{label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navmenu;