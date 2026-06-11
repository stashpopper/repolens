import { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, Sparkles, Zap, Layers, FileText, GitBranch, 
  Cpu, Globe, ChevronRight, Play, CheckCircle2, 
  Github, Shield, BarChart3, Code2, Terminal,
  Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ── Animated SVG: Repo → AI → Docs Pipeline (Hero) ── */
function RepoLensPipeline() {
  return (
    <svg viewBox="0 0 600 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="repoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="docsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ── LEFT: Repository Card ── */}
      <g transform="translate(40, 60)" filter="url(#softGlow)">
        {/* Card bg */}
        <rect x="0" y="0" width="160" height="280" rx="12" fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.25)" strokeWidth="1.5">
          <animate attributeName="stroke-opacity" values="0.25;0.5;0.25" dur="4s" repeatCount="indefinite" />
        </rect>
        {/* Header */}
        <rect x="0" y="0" width="160" height="40" rx="12" fill="rgba(59,130,246,0.12)" />
        <rect x="0" y="24" width="160" height="16" fill="rgba(59,130,246,0.12)" />
        {/* Folder icon */}
        <rect x="20" y="12" width="16" height="14" rx="3" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <path d="M20,16 L24,16 L25,14 L42,14 C43.1,14 44,14.9 44,16 L44,26 C44,27.1 43.1,28 42,28 L22,28 C20.9,28 20,27.1 20,26 Z" fill="rgba(59,130,246,0.25)" stroke="#60a5fa" strokeWidth="1" />
        <text x="44" y="23" fill="#93c5fd" fontSize="11" fontWeight="600">my-project</text>
        {/* File tree */}
        <g transform="translate(14, 52)">
          {/* src/ */}
          <rect x="0" y="0" width="10" height="10" rx="2" fill="rgba(59,130,246,0.2)" stroke="#60a5fa" strokeWidth="0.8" />
          <text x="16" y="9" fill="#93c5fd" fontSize="9" fontFamily="monospace">src/</text>
          {/* components/ */}
          <rect x="20" y="18" width="10" height="10" rx="2" fill="rgba(59,130,246,0.15)" stroke="#60a5fa" strokeWidth="0.8" />
          <text x="36" y="27" fill="#93c5fd" fontSize="9" fontFamily="monospace">components/</text>
          {/* files */}
          <text x="40" y="45" fill="#60a5fa" fontSize="8" fontFamily="monospace">├─ App.tsx</text>
          <text x="40" y="58" fill="#60a5fa" fontSize="8" fontFamily="monospace">├─ Header.tsx</text>
          <text x="40" y="71" fill="#60a5fa" fontSize="8" fontFamily="monospace">└─ utils.ts</text>
          {/* backend/ */}
          <rect x="0" y="84" width="10" height="10" rx="2" fill="rgba(59,130,246,0.15)" stroke="#60a5fa" strokeWidth="0.8" />
          <text x="16" y="93" fill="#93c5fd" fontSize="9" fontFamily="monospace">api/</text>
          <text x="20" y="111" fill="#60a5fa" fontSize="8" fontFamily="monospace">├─ routes.py</text>
          <text x="20" y="124" fill="#60a5fa" fontSize="8" fontFamily="monospace">├─ models.py</text>
          <text x="20" y="137" fill="#60a5fa" fontSize="8" fontFamily="monospace">└─ db.py</text>
          {/* config */}
          <text x="4" y="157" fill="#93c5fd" fontSize="8" fontFamily="monospace">📄 package.json</text>
          <text x="4" y="170" fill="#93c5fd" fontSize="8" fontFamily="monospace">📄 config.yaml</text>
        </g>
        {/* Label */}
        <text x="80" y="270" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="600">Repository</text>
      </g>

      {/* ── FLOW ARROW 1: Repo → AI ── */}
      <g>
        <line x1="200" y1="200" x2="245" y2="200" stroke="url(#flowGrad1)" strokeWidth="2" strokeDasharray="6 4" opacity="0.7">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
        </line>
        {/* Arrowhead */}
        <polygon points="245,196 255,200 245,204" fill="#8b5cf6" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
        </polygon>
        {/* Flow particles */}
        <circle r="3" fill="#60a5fa" filter="url(#glow)">
          <animateMotion dur="2s" repeatCount="indefinite" path="M200,200 L250,200" />
        </circle>
        <circle r="2" fill="#818cf8" filter="url(#glow)">
          <animateMotion dur="2s" begin="0.7s" repeatCount="indefinite" path="M200,200 L250,200" />
        </circle>
      </g>

      {/* ── CENTER: AI Analysis Hub ── */}
      <g transform="translate(300, 200)">
        {/* Outer rings */}
        <circle r="65" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="1">
          <animate attributeName="r" values="60;70;60" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.05;0.15" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle r="52" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4 4">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="20s" repeatCount="indefinite" />
        </circle>
        <circle r="42" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.2)" strokeWidth="1">
          <animate attributeName="r" values="40;45;40" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Core */}
        <circle r="30" fill="url(#aiGrad)" filter="url(#glow)">
          <animate attributeName="r" values="28;32;28" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Brain icon */}
        <path d="M-8,-4 C-8,-10 -2,-14 4,-12 C8,-14 14,-10 14,-4 C18,-2 18,6 14,8 C14,14 8,16 4,14 C-2,16 -8,14 -8,8 C-12,6 -12,-2 -8,-4 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <circle cx="0" cy="0" r="4" fill="rgba(255,255,255,0.9)">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Processing labels */}
        <text x="0" y="75" textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="600">AI Analysis</text>
        <text x="0" y="90" textAnchor="middle" fill="#7c3aed" fontSize="8" fontFamily="monospace">6-phase pipeline</text>
        {/* Scanning arcs */}
        <path d="M-25,-25 A35,35 0 0,1 25,-25" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0">
          <animate attributeName="opacity" values="0;0.6;0" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M-25,25 A35,35 0 0,0 25,25" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0">
          <animate attributeName="opacity" values="0;0;0.6;0" dur="3s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ── FLOW ARROW 2: AI → Docs ── */}
      <g>
        <line x1="355" y1="200" x2="400" y2="200" stroke="url(#flowGrad2)" strokeWidth="2" strokeDasharray="6 4" opacity="0.7">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
        </line>
        <polygon points="400,196 410,200 400,204" fill="#06b6d4" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
        </polygon>
        <circle r="3" fill="#a78bfa" filter="url(#glow)">
          <animateMotion dur="2s" repeatCount="indefinite" path="M350,200 L400,200" />
        </circle>
        <circle r="2" fill="#22d3ee" filter="url(#glow)">
          <animateMotion dur="2s" begin="0.7s" repeatCount="indefinite" path="M350,200 L400,200" />
        </circle>
      </g>

      {/* ── RIGHT: Documentation Card ── */}
      <g transform="translate(420, 60)" filter="url(#softGlow)">
        {/* Card bg */}
        <rect x="0" y="0" width="140" height="280" rx="12" fill="rgba(6,182,212,0.06)" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5">
          <animate attributeName="stroke-opacity" values="0.25;0.5;0.25" dur="4s" begin="1s" repeatCount="indefinite" />
        </rect>
        {/* Header */}
        <rect x="0" y="0" width="140" height="40" rx="12" fill="rgba(6,182,212,0.12)" />
        <rect x="0" y="24" width="140" height="16" fill="rgba(6,182,212,0.12)" />
        {/* Document icon */}
        <rect x="16" y="10" width="12" height="16" rx="2" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        <line x1="20" y1="16" x2="24" y2="16" stroke="#22d3ee" strokeWidth="0.8" />
        <line x1="20" y1="20" x2="24" y2="20" stroke="#22d3ee" strokeWidth="0.8" />
        <text x="34" y="23" fill="#67e8f9" fontSize="11" fontWeight="600">docs.md</text>
        {/* Doc content */}
        <g transform="translate(12, 52)">
          {/* Overview section */}
          <text x="0" y="0" fill="#22d3ee" fontSize="9" fontWeight="700"># Overview</text>
          <rect x="0" y="8" width="110" height="3" rx="1.5" fill="rgba(6,182,212,0.3)" />
          <rect x="0" y="15" width="95" height="3" rx="1.5" fill="rgba(6,182,212,0.2)" />
          <rect x="0" y="22" width="100" height="3" rx="1.5" fill="rgba(6,182,212,0.25)" />
          {/* Architecture */}
          <text x="0" y="42" fill="#22d3ee" fontSize="9" fontWeight="700">## Architecture</text>
          <rect x="0" y="50" width="105" height="3" rx="1.5" fill="rgba(6,182,212,0.3)" />
          <rect x="0" y="57" width="88" height="3" rx="1.5" fill="rgba(6,182,212,0.2)" />
          <rect x="0" y="64" width="98" height="3" rx="1.5" fill="rgba(6,182,212,0.25)" />
          {/* Data Flow */}
          <text x="0" y="84" fill="#22d3ee" fontSize="9" fontWeight="700">## Data Flow</text>
          <rect x="0" y="92" width="110" height="3" rx="1.5" fill="rgba(6,182,212,0.3)" />
          <rect x="0" y="99" width="92" height="3" rx="1.5" fill="rgba(6,182,212,0.2)" />
          <rect x="0" y="106" width="105" height="3" rx="1.5" fill="rgba(6,182,212,0.25)" />
          {/* API */}
          <text x="0" y="126" fill="#22d3ee" fontSize="9" fontWeight="700">## API Endpoints</text>
          <rect x="0" y="134" width="100" height="3" rx="1.5" fill="rgba(6,182,212,0.3)" />
          <rect x="0" y="141" width="85" height="3" rx="1.5" fill="rgba(6,182,212,0.2)" />
          <rect x="0" y="148" width="95" height="3" rx="1.5" fill="rgba(6,182,212,0.25)" />
          {/* Checkmarks */}
          <text x="0" y="172" fill="#34d399" fontSize="8">✓ 23 files analyzed</text>
          <text x="0" y="184" fill="#34d399" fontSize="8">✓ Architecture mapped</text>
          <text x="0" y="196" fill="#34d399" fontSize="8">✓ Data flows traced</text>
          <text x="0" y="208" fill="#34d399" fontSize="8">✓ Glossary: 42 terms</text>
        </g>
        {/* Label */}
        <text x="70" y="270" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="600">Documentation</text>
      </g>
    </svg>
  );
}

/* ── Animated SVG: Orbiting planets (How it works) ── */
function OrbitAnimation() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="orbitGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="orbitGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
      </defs>

      {/* Center */}
      <circle cx="150" cy="150" r="20" fill="url(#orbitGrad1)" opacity="0.9" />
      <text x="150" y="154" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Repo</text>

      {/* Orbit paths */}
      <ellipse cx="150" cy="150" rx="60" ry="60" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
      <ellipse cx="150" cy="150" rx="100" ry="100" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
      <ellipse cx="150" cy="150" rx="135" ry="135" fill="none" stroke="rgba(6,182,212,0.08)" strokeWidth="1" />

      {/* Orbiting elements */}
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="10s" repeatCount="indefinite" />
        <circle cx="210" cy="150" r="12" fill="url(#orbitGrad1)" opacity="0.8" />
        <text x="210" y="154" textAnchor="middle" fill="white" fontSize="7">1</text>
      </g>
      <g>
        <animateTransform attributeName="transform" type="rotate" from="120 150 150" to="480 150 150" dur="14s" repeatCount="indefinite" />
        <circle cx="250" cy="150" r="10" fill="url(#orbitGrad2)" opacity="0.7" />
        <text x="250" y="154" textAnchor="middle" fill="white" fontSize="7">2</text>
      </g>
      <g>
        <animateTransform attributeName="transform" type="rotate" from="240 150 150" to="0 150 150" dur="18s" repeatCount="indefinite" />
        <circle cx="285" cy="150" r="8" fill="url(#orbitGrad3)" opacity="0.6" />
        <text x="285" y="154" textAnchor="middle" fill="white" fontSize="7">3</text>
      </g>
    </svg>
  );
}

/* ── Animated SVG: Terminal typing (CTA) ── */
function TerminalAnimation() {
  const [lines, setLines] = useState<string[]>([]);
  const allLines = [
    "$ repolens analyze ./my-project",
    "✓ Repository cloned successfully",
    "✓ Tech stack detected: React + Node.js",
    "✓ Architecture mapped (23 files)",
    "✓ Data flow documented",
    "✓ API endpoints cataloged",
    "✓ Dependency graph generated",
    "✓ Glossary created (42 terms)",
    "🎉 Documentation complete!",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < allLines.length) {
        setLines((prev) => [...prev, allLines[i]]);
        i++;
      } else {
        setTimeout(() => setLines([]), 2000);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 500 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Terminal background */}
      <rect x="0" y="0" width="500" height="280" rx="12" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      
      {/* Terminal header */}
      <rect x="0" y="0" width="500" height="32" rx="12" fill="rgba(255,255,255,0.05)" />
      <rect x="0" y="20" width="500" height="12" fill="rgba(255,255,255,0.05)" />
      
      {/* Window controls */}
      <circle cx="20" cy="16" r="6" fill="#ff5f57" />
      <circle cx="40" cy="16" r="6" fill="#febc2e" />
      <circle cx="60" cy="16" r="6" fill="#28c840" />
      
      {/* Terminal title */}
      <text x="250" y="20" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="monospace">repolens</text>

      {/* Terminal content */}
      {lines.map((line, i) => {
        const color = (line || "").startsWith("$") ? "#60a5fa" : (line || "").includes("✓") ? "#34d399" : (line || "").includes("🎉") ? "#fbbf24" : "rgba(255,255,255,0.7)";
        return (
          <text
            key={i}
            x="20"
            y={60 + i * 24}
            fill={color}
            fontSize="13"
            fontFamily="monospace"
            opacity="0"
          >
            {line}
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" />
          </text>
        );
      })}

      {/* Blinking cursor */}
      {lines.length > 0 && (
        <rect
          x={20 + (lines[lines.length - 1] || "").length * 7.8}
          y={56 + (lines.length - 1) * 24}
          width="8"
          height="16"
          fill="#60a5fa"
          opacity="0.8"
        >
          <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite" />
        </rect>
      )}
    </svg>
  );
}

/* ── Intersection Observer Hook ── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ── Feature Card ── */
function FeatureCard({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`glass rounded-2xl p-6 transition-all duration-700 hover:glow-primary hover:scale-[1.02] ${
        inView ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

/* ── Main Landing Page ── */
export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useInView(0.1);

  const features = [
    { icon: Cpu, title: "AI-Powered Analysis", description: "Advanced AI agents systematically analyze every file, understanding architecture patterns and data flows in your codebase." },
    { icon: Layers, title: "Multi-File Documentation", description: "Generate comprehensive docs: Overview, File Breakdown, Data Flow, API Endpoints, Dependency Maps, and Glossaries." },
    { icon: Zap, title: "6-Phase Pipeline", description: "Structured LangGraph pipeline ensures thorough analysis from repository intake to final documentation generation." },
    { icon: GitBranch, title: "GitHub & Local Support", description: "Analyze any GitHub repository or local directory. Works with public and private repos via GitHub tokens." },
    { icon: BarChart3, title: "Real-Time Progress", description: "Watch your analysis progress live with detailed phase tracking and streaming logs from the AI agent." },
    { icon: FileText, title: "Markdown Output", description: "Clean, readable Markdown documentation ready for your wiki, README, or knowledge base." },
  ];

  const steps = [
    { num: "01", title: "Paste Your Repo", description: "Enter a GitHub URL or local directory path. No setup required." },
    { num: "02", title: "AI Analyzes", description: "Our 6-phase agent pipeline dissects every file and maps relationships." },
    { num: "03", title: "Get Documentation", description: "Receive comprehensive, structured documentation in minutes." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Github className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              RepoLens
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-white transition-colors">How It Works</a>
            <Button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl px-6 shadow-lg shadow-blue-500/20"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong border-t border-white/5 px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <Button onClick={() => { onGetStarted(); setMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-blue-500 to-violet-500">
              Get Started Free
            </Button>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 bg-grid">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-blue-500/5 via-violet-500/5 to-cyan-500/5 animate-spin-slow" />
        </div>

        <div ref={heroRef.ref} className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className={`space-y-8 ${heroRef.inView ? "animate-fade-in-up" : "opacity-0"}`}>
            <Badge variant="outline" className="gap-2 border-primary/30 text-primary px-4 py-1.5">
              <Sparkles className="h-3 w-3" />
              AI-Powered Codebase Analysis
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Understand
              <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                Any Codebase
              </span>
              Instantly
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Paste a GitHub URL or local path. Our AI agent systematically analyzes every file and generates comprehensive documentation — so you actually understand your projects.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl px-8 h-12 text-lg shadow-xl shadow-blue-500/25"
              >
                Start Analyzing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl px-6 h-12 text-lg glass">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b"].map((color, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Trusted by <span className="text-white font-medium">2,000+</span> developers
              </div>
            </div>
          </div>

          {/* Right: Network Animation */}
          <div className={`relative ${heroRef.inView ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: "400ms", animationFillMode: "backwards" }}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Morphing blob behind */}
              <div className="absolute inset-4 bg-gradient-to-br from-blue-500/20 to-violet-500/20 animate-morph blur-xl" />
              
              {/* SVG animation */}
              <div className="absolute inset-0">
                <RepoLensPipeline />
              </div>

              {/* Floating badges */}
              <div className="absolute top-8 right-8 glass rounded-xl px-3 py-2 animate-float">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  <span className="text-muted-foreground">23 files analyzed</span>
                </div>
              </div>
              <div className="absolute bottom-12 left-4 glass rounded-xl px-3 py-2 animate-float-delayed">
                <div className="flex items-center gap-2 text-xs">
                  <GitBranch className="h-3 w-3 text-violet-400" />
                  <span className="text-muted-foreground">Architecture mapped</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-muted-foreground">Scroll to explore</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="relative py-32 bg-grid">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="gap-2 border-primary/30 text-primary mb-4">
              <Zap className="h-3 w-3" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Understand Code
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From initial intake to final documentation, RepoLens handles the heavy lifting so you can focus on building.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 100} />
            ))}
          </div>

        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="gap-2 border-primary/30 text-primary mb-4">
              <Layers className="h-3 w-3" />
              Simple Process
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Three Steps to
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                {" "}Clarity
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, i) => {
                const { ref, inView } = useInView();
                return (
                  <div
                    key={i}
                    ref={ref}
                    className={`flex gap-6 transition-all duration-700 ${
                      inView ? "animate-fade-in-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${i * 200}ms`, animationFillMode: "backwards" }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                          {step.num}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Orbit animation */}
            <div className="flex justify-center">
              <div className="w-80 h-80">
                <OrbitAnimation />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Terminal / Demo Section ── */}
      <section className="relative py-32 bg-grid">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <Badge variant="outline" className="gap-2 border-primary/30 text-primary mb-4">
            <Terminal className="h-3 w-3" />
            See It In Action
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Lightning Fast
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {" "}Analysis
            </span>
          </h2>
          <div className="glass rounded-2xl p-4 max-w-3xl mx-auto">
            <div className="aspect-[500/280] max-h-[280px]">
              <TerminalAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-32 bg-grid">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="glass-strong rounded-3xl p-12 lg:p-16 glow-primary">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm text-muted-foreground">Free to use • No credit card required</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Ready to Understand
              <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                Your Codebase?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of developers who use RepoLens to gain instant clarity on any project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl px-10 h-14 text-lg shadow-xl shadow-blue-500/25"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Free Analysis
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                GitHub & Local repos
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                6-phase AI pipeline
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Markdown output
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                  <Github className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  RepoLens
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                AI-powered codebase reverse-documentation. Understand any project in minutes, not days.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1"><Github className="h-3 w-3" /> GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1"><Globe className="h-3 w-3" /> Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1"><Code2 className="h-3 w-3" /> API</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 RepoLens. AI Codebase Reverse-Documentation Agent.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
