import React from "react";
import { ShieldCheck, GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-slate-700">Zephyra</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <a
            href="https://github.com/prasannadilshan/zephyra-auth"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
