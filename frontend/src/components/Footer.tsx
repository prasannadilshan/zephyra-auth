import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, ExternalLink, GitBranch, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 py-8 text-sm text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">ZephyraTech Solutions</span>
          <span>&copy; {new Date().getFullYear()} Software Engineering Assessment</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Next.js 16 + React 19</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Spring Boot + Java 21 LTS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
            <span>JWT Rotation + RBAC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Render + Vercel</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <a
            href="https://github.com/prasannadilshan/zephyra-auth"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            Repository
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>
    </footer>
  );
}
