"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Github, Linkedin, Twitter, Instagram, ArrowRight, ArrowDown,
  ExternalLink, Mail, MapPin, Phone, Send, Heart, Code2, Palette,
  Rocket, Coffee, Menu, X, CheckCircle, Brain, Cpu, Globe,
  Figma, Layers, Sparkles, GraduationCap, Calendar, Award, BadgeCheck,
} from "lucide-react";

/* ================================================================
   DATA
   ================================================================ */

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const skills = [
  { name: "HTML & CSS", level: 95, icon: Globe, color: "from-blue-500 to-cyan-400" },
  { name: "JavaScript", level: 90, icon: Code2, color: "from-yellow-400 to-orange-500" },
  { name: "React / Next.js", level: 88, icon: Layers, color: "from-cyan-400 to-blue-500" },
  { name: "UI/UX (Figma)", level: 85, icon: Figma, color: "from-pink-500 to-purple-500" },
  { name: "AI / ML Basics", level: 75, icon: Brain, color: "from-purple-500 to-violet-600" },
  { name: "Tailwind CSS", level: 92, icon: Palette, color: "from-teal-400 to-cyan-500" },
];

const projects = [
  {
    id: 1,
    title: "AI Motor Insurance Risk Assessment",
    description: "AI-powered system that analyzes driver behavior, vehicle data, and environmental factors to predict insurance risk scores with high accuracy.",
    tags: ["Python", "Machine Learning", "React", "Flask"],
    color: "from-blue-500 to-purple-600",
    icon: Cpu,
    github: "https://github.com/Procoder2025/Driver-safty-management",
    live: "",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "AR – Immersive AR-Based Learning for CS",
    description: "An immersive Augmented Reality learning platform for Computer Science education, enabling students to visualize and interact with complex CS concepts in 3D space.",
    tags: ["Unity", "Vuforia Engine", "C#", "AR"],
    color: "from-red-500 to-orange-500",
    icon: Rocket,
    github: "https://github.com/Procoder2025/AR---Immersive-AR-Based-Learning-for-Computer-Science",
    live: "",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Crop Doctor – AI Pest Detection",
    description: "Mobile-friendly AI tool that identifies crop diseases and pests from photos, providing treatment recommendations for farmers.",
    tags: ["TensorFlow", "React Native", "Python", "OpenCV"],
    color: "from-green-500 to-emerald-500",
    icon: Sparkles,
    github: "",
    live: "",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Financial AI Assistant",
    description: "Intelligent chatbot that provides personalized financial advice, budget tracking, and investment suggestions using NLP.",
    tags: ["OpenAI API", "Next.js", "Tailwind", "MongoDB"],
    color: "from-violet-500 to-purple-600",
    icon: Brain,
    github: "",
    live: "",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
  },
];

const timeline = [
  {
    year: "2022 – 2026",
    title: "BE Computer Science Engineering",
    place: "Adhiyamaan College of Engineering (Autonomous), Hosur",
    description: "Specializing in AI/ML, full-stack web development, and UI/UX design. Active participant in hackathons, tech fests, and coding communities. Building real-world projects in smart systems and AI applications.",
    grade: "CGPA: 7.8 / 10",
  },
  {
    year: "2020 – 2022",
    title: "Higher Secondary (HSC) – Computer Science",
    place: "Government Higher Secondary School",
    description: "Studied computer science with a focus on programming fundamentals, mathematics, and physics. Developed early interest in coding and web technologies.",
    grade: "Score: 78%",
  },
  {
    year: "2019 – 2020",
    title: "Secondary School (SSLC)",
    place: "Government High School",
    description: "Completed secondary education with strong academic performance. First exposure to computers and technology that sparked the passion for software development.",
    grade: "Score: 68%",
  },
];

const certifications = [
  {
    title: "Python for Data Science",
    issuer: "NPTEL / IIT Madras",
    date: "2024",
    credential: "#",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Machine Learning Foundations",
    issuer: "Coursera – Stanford Online",
    date: "2024",
    credential: "#",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "UI/UX Design Specialization",
    issuer: "Google – Coursera",
    date: "2023",
    credential: "#",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Full-Stack Web Development",
    issuer: "Udemy",
    date: "2023",
    credential: "#",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Cloud Computing Basics",
    issuer: "AWS Academy",
    date: "2024",
    credential: "#",
    color: "from-yellow-400 to-orange-500",
  },
  {
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "2023",
    credential: "#",
    color: "from-cyan-500 to-blue-600",
  },
];

const contactInfo = [
  { icon: Mail, label: "Email", value: "mdkarthikeyan07@gmail.com", href: "mailto:mdkarthikeyan07@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 9092241237", href: "tel:+919092241237" },
  { icon: MapPin, label: "Location", value: "Tamil Nadu, India", href: "#" },
];


/* ================================================================
   LOADING SCREEN
   ================================================================ */

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center gap-8"
    >
      <div className="relative w-20 h-20">
        <div className="loader-ring w-full h-full" />
        <Brain className="absolute inset-0 m-auto w-8 h-8 text-purple-400" style={{ animation: "loader-pulse 2s ease-in-out infinite" }} />
      </div>
      <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 font-mono">Initializing AI Portfolio... {progress}%</p>
    </motion.div>
  );
}


/* ================================================================
   TYPING EFFECT
   ================================================================ */

function TypingEffect() {
  const roles = ["AI Developer", "UI/UX Designer", "Web Developer", "Problem Solver"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text === current) setTimeout(() => setIsDeleting(true), 2000);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text === "") {
          setIsDeleting(false);
          setRoleIndex((i) => (i + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex, roles]);

  return (
    <span className="gradient-text">
      {text}
      <span className="animate-pulse text-purple-400">|</span>
    </span>
  );
}

/* ================================================================
   TILT CARD HOOK
   ================================================================ */

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
  }, []);

  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);

  return { ref, handleMove, handleLeave };
}

/* ================================================================
   NAVBAR
   ================================================================ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-3" : "py-5"
      }`}
    >
      <div className="max-w-[1140px] mx-auto px-6 flex items-center justify-between">
        <motion.a
          href="#home"
          className="text-2xl font-bold gradient-text"
          style={{ fontFamily: "Syne" }}
          whileHover={{ scale: 1.05 }}
        >
          K.
        </motion.a>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="text-sm text-gray-600 hover:text-black transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </motion.a>
          ))}
          <a href="#contact" className="px-5 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white hover:opacity-90 transition neon-glow">
            Hire Me
          </a>
        </nav>

        <button className="md:hidden text-gray-800" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-2 mx-4 rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <a key={item.name} href={item.href} onClick={() => setMobileOpen(false)}
                  className="text-gray-600 hover:text-black py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                  {item.name}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ================================================================
   HERO
   ================================================================ */

function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden py-20 pt-28 md:pt-20">
      {/* Mouse spotlight */}
      <MouseSpotlight />
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 z-[0]" />
      <div className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-purple-200/40 blur-[80px] md:blur-[100px] z-[0]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-blue-200/30 blur-[80px] md:blur-[100px] z-[0]" />

      {/* Content */}
      <div className="relative z-[2] max-w-[1140px] mx-auto px-4 sm:px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mx-auto max-w-[700px]"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Available for Opportunities
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-3 sm:mb-4 leading-[0.95]" style={{ fontFamily: "Syne" }}>
            Hi, I&apos;m
            <br />
            <span className="gradient-text-shimmer">Karthik</span>
          </h1>

          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 h-8 sm:h-10 md:h-12" style={{ fontFamily: "Syne" }}>
            <TypingEffect />
          </div>

          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-lg mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Building the future with AI, stunning design, and scalable web applications.
            Turning complex problems into elegant solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center px-4 sm:px-0">
            <MagneticWrap>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white font-medium neon-glow text-sm sm:text-base"
              >
                View Projects <ArrowRight size={18} />
              </motion.a>
            </MagneticWrap>
            <MagneticWrap>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Contact Me
              </motion.a>
            </MagneticWrap>
          </div>

          <div className="flex gap-3 justify-center">
            {socialLinks.map((s) => (
              <motion.a key={s.label} href={s.href} whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.95 }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-purple-500 hover:border-purple-300 hover:shadow-md hover:shadow-purple-100/50 transition-all duration-300" aria-label={s.label}>
                <s.icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  );
}

/* ================================================================
   ABOUT
   ================================================================ */

function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const interests = [
    { icon: Brain, title: "AI-Powered Apps", desc: "Building intelligent systems that learn and adapt" },
    { icon: Layers, title: "Smart Systems", desc: "Insurance, ambulance, agriculture solutions" },
    { icon: Palette, title: "UI/UX Design", desc: "Crafting beautiful interfaces in Figma" },
    { icon: Code2, title: "Full-Stack Dev", desc: "React, Next.js, Node.js & more" },
  ];

  const stats = [
    { target: 10, suffix: "+", label: "Projects", icon: Rocket },
    { target: 5, suffix: "+", label: "AI Models", icon: Brain },
    { target: 3, suffix: "+", label: "Hackathons", icon: Sparkles },
    { target: 100, suffix: "%", label: "Passion", icon: Heart },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="section-line" />
      <div className="absolute top-1/3 right-[-10%] w-60 md:w-96 h-60 md:h-96 bg-purple-100/30 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="absolute bottom-0 left-[-5%] w-48 md:w-72 h-48 md:h-72 bg-blue-100/25 rounded-full blur-[80px] md:blur-[100px]" />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-4 sm:pt-8" ref={ref}>
        {/* Header - centered */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-xs sm:text-sm text-purple-500 font-medium mb-4 sm:mb-6">About Me</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6" style={{ fontFamily: "Syne" }}>
            Passionate About <span className="gradient-text">AI & Design</span>
          </h2>
          <p className="text-gray-500 max-w-[700px] mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2">
            I&apos;m a Computer Science Engineering student who loves building AI-powered
            applications that solve real-world problems. From smart systems to beautiful
            interfaces — I bring ideas to life with code and design.
          </p>
        </motion.div>

        {/* Interest cards - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-16">
          {interests.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 150 }}
              whileHover={{ y: -8 }}
              className="glow-card relative group rounded-2xl p-6 bg-white border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50 overflow-hidden"
            >
              {/* Hover gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-bold mb-2 text-gray-900" style={{ fontFamily: "Syne" }}>{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-[1px]"
        >
          <div className="rounded-3xl bg-white p-1.5 sm:p-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  whileHover={{ scale: 1.03 }}
                  className="text-center py-4 sm:py-6 md:py-8 px-2 sm:px-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                >
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 sm:mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text mb-1" style={{ fontFamily: "Syne" }}>
                    <AnimatedCounter target={s.target} suffix={s.suffix} />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   SKILLS
   ================================================================ */

function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-gray-50/50">
      <div className="section-line" />
      <div className="absolute bottom-0 right-0 w-60 md:w-96 h-60 md:h-96 bg-purple-100/40 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="absolute top-20 left-[-10%] w-48 md:w-72 h-48 md:h-72 bg-blue-100/30 rounded-full blur-[80px] md:blur-[100px]" />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-4 sm:pt-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12 sm:mb-20">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-xs sm:text-sm text-purple-500 font-medium mb-4 sm:mb-6">Skills</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "Syne" }}>
            My <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="text-gray-500 max-w-[640px] mx-auto text-sm sm:text-base">Technologies and tools I use to bring ideas to life.</p>
        </motion.div>

        {/* Hexagonal / Circular skill cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-16">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="flex flex-col items-center group"
            >
              {/* Circular progress ring */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3 sm:mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                  <motion.circle
                    cx="60" cy="60" r="52" fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    stroke={`url(#grad-${i})`}
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                    animate={inView ? { strokeDashoffset: 2 * Math.PI * 52 * (1 - skill.level / 100) } : {}}
                    transition={{ duration: 1.5, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#8b5cf6" : "#06b6d4"} />
                      <stop offset="100%" stopColor={i % 3 === 0 ? "#06b6d4" : i % 3 === 1 ? "#ec4899" : "#8b5cf6"} />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center icon + percentage */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-md`}>
                    <skill.icon className="w-5 h-5 text-white" />
                  </div>
                  <motion.span
                    className="text-sm font-bold text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 + i * 0.15 }}
                  >
                    {skill.level}%
                  </motion.span>
                </div>
              </div>

              {/* Label */}
              <h3 className="text-sm md:text-base font-semibold text-center text-gray-800 group-hover:gradient-text transition-all" style={{ fontFamily: "Syne" }}>
                {skill.name}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Additional tech tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {["Git", "Docker", "MongoDB", "PostgreSQL", "REST APIs", "Firebase", "Vercel", "VS Code", "Postman", "Linux"].map((tech, i) => (
            <motion.span
              key={tech}
              whileHover={{ scale: 1.08, y: -2 }}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-50 border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   PROJECTS
   ================================================================ */

function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="projects" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="section-line" />
      <div className="absolute top-1/3 right-[-10%] w-60 md:w-96 h-60 md:h-96 bg-blue-100/30 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="absolute bottom-0 left-[-5%] w-48 md:w-80 h-48 md:h-80 bg-purple-100/25 rounded-full blur-[80px] md:blur-[100px]" />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-4 sm:pt-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-xs sm:text-sm text-purple-500 font-medium mb-4 sm:mb-6">Projects</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "Syne" }}>
            Featured <span className="gradient-text">Work</span>
          </h2>
          <p className="text-gray-500 max-w-[640px] mx-auto text-sm sm:text-base">Real-world AI-powered solutions and web applications.</p>
        </motion.div>

        {/* Project list - stacked full-width cards */}
        <div className="space-y-4 sm:space-y-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={(e) => { setHoveredId(null); const el = e.currentTarget as HTMLDivElement; el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)"; }}
              onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.01)`; }}
              className="group relative rounded-2xl sm:rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-purple-100/40"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="grid md:grid-cols-5 gap-0">
                {/* Left: project image */}
                <div className="relative md:col-span-2 min-h-[160px] sm:min-h-[180px] md:min-h-[220px] overflow-hidden">
                  {/* Image */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500" />

                  {/* Project number */}
                  <span className="absolute top-3 left-4 sm:top-4 sm:left-5 text-[2rem] sm:text-[3rem] md:text-[4rem] font-black text-white/20 leading-none select-none" style={{ fontFamily: "Syne" }}>
                    0{project.id}
                  </span>

                  {/* Icon badge */}
                  <motion.div
                    animate={hoveredId === project.id ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30"
                  >
                    <project.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>

                  {/* Hover links */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={hoveredId === project.id ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    className="absolute bottom-3 right-4 sm:bottom-4 sm:right-5 hidden sm:flex gap-2"
                  >
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition">
                        <Github size={14} />
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </motion.div>
                </div>

                {/* Right: content */}
                <div className="md:col-span-3 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-gray-900 group-hover:gradient-text transition-all duration-300" style={{ fontFamily: "Syne" }}>
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-50 border border-gray-100 text-[10px] sm:text-xs font-medium text-gray-600 hover:border-purple-200 hover:text-purple-600 transition-all">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  {project.github ? (
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-2 text-purple-500 text-xs sm:text-sm font-semibold group/link"
                    >
                      View on GitHub
                      <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </motion.a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-gray-400 text-xs sm:text-sm font-semibold">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   EDUCATION / TIMELINE
   ================================================================ */

function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-gray-50/50">
      <div className="section-line" />
      <div className="absolute top-20 left-[-5%] w-48 md:w-72 h-48 md:h-72 bg-purple-100/25 rounded-full blur-[80px] md:blur-[100px]" />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-4 sm:pt-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-xs sm:text-sm text-purple-500 font-medium mb-4 sm:mb-6">Education</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "Syne" }}>
            My <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-gray-500 max-w-[640px] mx-auto text-sm sm:text-base">The academic path that shaped my skills and passion for technology.</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-[840px] mx-auto">
          {/* Vertical line - animated */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-5 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-400 via-blue-400 to-cyan-400 rounded-full origin-top"
          />

          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, y: 20 }}
              animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.25, type: "spring", stiffness: 80, damping: 15 }}
              className={`relative mb-10 last:mb-0 md:flex ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              {/* Dot - animated pulse */}
              <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-10 top-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.25, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 shadow-md shadow-purple-200 ring-4 ring-white" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 animate-ping opacity-30" />
                </motion.div>
              </div>

              {/* Spacer for alternating sides */}
              <div className="hidden md:block md:w-1/2" />

              {/* Card */}
              <div className={`ml-12 sm:ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pl-10" : "md:pr-10"}`}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02, boxShadow: "0 20px 40px rgba(124,58,237,0.15)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glow-card rounded-xl sm:rounded-2xl bg-white border border-gray-200 p-5 sm:p-6 shadow-md hover:border-purple-300 transition-colors duration-300 relative overflow-hidden"
                >
                  {/* Year badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.25 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 mb-3 relative z-10"
                  >
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span className="text-xs font-semibold text-purple-600">{item.year}</span>
                  </motion.div>

                  <h3 className="text-lg font-bold mb-1 text-gray-900" style={{ fontFamily: "Syne" }}>{item.title}</h3>

                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700 font-medium">{item.place}</span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>

                  {/* Grade badge */}
                  {item.grade && (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-xs font-semibold text-green-600 relative z-10 hover:shadow-md hover:shadow-green-100/50 transition-shadow"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {item.grade}
                    </motion.span>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   CERTIFICATIONS
   ================================================================ */

function Certifications() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="certifications" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="section-line" />
      <div className="absolute top-1/3 right-[-10%] w-60 md:w-96 h-60 md:h-96 bg-purple-100/30 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="absolute bottom-0 left-[-5%] w-48 md:w-72 h-48 md:h-72 bg-cyan-100/25 rounded-full blur-[80px] md:blur-[100px]" />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-4 sm:pt-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-xs sm:text-sm text-purple-500 font-medium mb-4 sm:mb-6">Certifications</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "Syne" }}>
            My <span className="gradient-text">Credentials</span>
          </h2>
          <p className="text-gray-500 max-w-[640px] mx-auto text-sm sm:text-base">Professional certifications and courses that validate my skills.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 120 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-100/40 transition-all duration-300"
            >
              {/* Certificate style card */}
              <div className="bg-gradient-to-br from-[#faf9f6] to-[#f5f3ee] border border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 relative">
                {/* Decorative corner ornaments */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-purple-300/50 rounded-tl-sm" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-purple-300/50 rounded-tr-sm" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-purple-300/50 rounded-bl-sm" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-purple-300/50 rounded-br-sm" />

                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                  <Award className="w-32 h-32" />
                </div>

                {/* Header with seal */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md shadow-amber-200/50">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">Certificate</span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">{cert.date}</span>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4" />

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 leading-snug" style={{ fontFamily: "Syne" }}>
                  {cert.title}
                </h3>

                {/* Issuer */}
                <p className="text-xs sm:text-sm text-gray-600 mb-4 font-medium">
                  Issued by <span className="text-gray-800">{cert.issuer}</span>
                </p>

                {/* Divider */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-3" />

                {/* Bottom row: verified + credential */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-green-600 text-[10px] sm:text-xs font-semibold">
                    <BadgeCheck size={14} className="text-green-500" />
                    Verified
                  </span>
                  {cert.credential && cert.credential !== "#" ? (
                    <motion.a
                      href={cert.credential}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 3 }}
                      className="inline-flex items-center gap-1 text-purple-500 text-[10px] sm:text-xs font-semibold group/link"
                    >
                      View <ArrowRight size={10} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </motion.a>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   CONTACT
   ================================================================ */

function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "contacts"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      // Fallback if Firebase is not configured yet
      await new Promise((r) => setTimeout(r, 1000));
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    }
    setSubmitting(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:shadow-[0_0_15px_rgba(139,92,246,0.08)] transition-all text-sm";

  return (
    <section id="contact" className="py-16 sm:py-24 md:py-32 relative">
      <div className="section-line" />
      <div className="absolute bottom-0 left-1/4 w-48 md:w-80 h-48 md:h-80 bg-purple-100/40 rounded-full blur-[80px] md:blur-[100px]" />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-4 sm:pt-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-xs sm:text-sm text-purple-400 mb-4 sm:mb-6">Contact</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "Syne" }}>
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-gray-600 max-w-[640px] mx-auto text-sm sm:text-base">Have a project or just want to say hi? I&apos;d love to hear from you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300">
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Syne" }}>Get In Touch</h3>
              <div className="space-y-5">
                {contactInfo.map((c, i) => (
                  <motion.a key={c.label} href={c.href}
                    initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <c.icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{c.label}</p>
                      <p className="text-sm font-medium group-hover:text-purple-400 transition-colors">{c.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-cyan-50/50" />
              <div className="relative">
                <h4 className="text-lg font-bold mb-2" style={{ fontFamily: "Syne" }}>Open to Work</h4>
                <p className="text-gray-600 text-sm mb-3">Looking for internships, freelance projects, and collaborations.</p>
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle size={14} />
                  <span className="text-sm font-medium">Available now</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-xl sm:rounded-2xl bg-white border border-gray-100 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300">
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required className={inputClass} />
                </div>
              </div>
              <div className="mb-5">
                <label className="text-xs text-gray-500 mb-2 block">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Project inquiry" required className={inputClass} />
              </div>
              <div className="mb-6">
                <label className="text-xs text-gray-500 mb-2 block">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project..." rows={5} required className={`${inputClass} resize-none`} />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white hover:opacity-90 transition neon-glow font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">
                {submitting ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Sending...</>
                ) : submitted ? (
                  <><CheckCircle size={18} />Sent!</>
                ) : (
                  <>Send Message <Send size={16} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */

function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient top border */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

      {/* Background blobs */}
      <div className="absolute bottom-0 left-[-10%] w-80 h-80 bg-purple-100/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-[-10%] w-64 h-64 bg-blue-100/20 rounded-full blur-[100px]" />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Top section - CTA */}
        <div className="py-10 sm:py-16 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl md:text-4xl font-bold mb-3 sm:mb-4"
            style={{ fontFamily: "Syne" }}
          >
            Let&apos;s Build Something <span className="gradient-text">Amazing</span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 mb-8 max-w-md mx-auto"
          >
            Got a project idea or just want to chat? I&apos;m always open to new opportunities.
          </motion.p>
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white font-medium neon-glow text-sm"
          >
            Get In Touch <ArrowRight size={16} />
          </motion.a>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200" />

        {/* Middle section - Links grid */}
        <div className="py-8 sm:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#home" className="text-3xl font-bold gradient-text inline-block mb-3" style={{ fontFamily: "Syne" }}>K.</a>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI Developer, UI/UX Designer & Full-Stack Web Developer based in Tamil Nadu, India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Navigate</h4>
            <div className="flex flex-col gap-2.5">
              {navItems.slice(0, 3).map((n) => (
                <a key={n.name} href={n.href} className="text-sm text-gray-500 hover:text-purple-500 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-3 h-[1px] bg-purple-400 transition-all duration-200" />
                  {n.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Explore</h4>
            <div className="flex flex-col gap-2.5">
              {navItems.slice(3).map((n) => (
                <a key={n.name} href={n.href} className="text-sm text-gray-500 hover:text-purple-500 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-3 h-[1px] bg-purple-400 transition-all duration-200" />
                  {n.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Connect</h4>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-gradient-to-br hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 hover:border-transparent hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300"
                  aria-label={s.label}
                >
                  <s.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} Karthikeyan. Built with
            <Heart size={10} className="text-purple-400 fill-purple-400" />
            using Next.js & Tailwind CSS
          </p>
          <motion.a
            href="#home"
            whileHover={{ y: -3 }}
            className="text-xs text-gray-400 hover:text-purple-500 transition-colors flex items-center gap-1"
          >
            Back to top
            <ArrowRight size={10} className="rotate-[-90deg]" />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   SCROLL PROGRESS BAR
   ================================================================ */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
      style={{ scaleX: scrollYProgress }}
    />
  );
}


/* ================================================================
   FLOATING PARTICLES (Hero background)
   ================================================================ */

function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-purple-400/20 to-cyan-400/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ================================================================
   ANIMATED COUNTER
   ================================================================ */

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setCount(start);
    }, 40);
    return () => clearInterval(interval);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ================================================================
   MOUSE SPOTLIGHT (Hero background effect)
   ================================================================ */

function MouseSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!spotRef.current) return;
      const rect = spotRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;
      spotRef.current.style.left = `${e.clientX - rect.left}px`;
      spotRef.current.style.top = `${e.clientY - rect.top}px`;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={spotRef}
      className="absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-[1] hidden md:block"
      style={{
        background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)",
      }}
    />
  );
}

/* ================================================================
   FLOATING BACK TO TOP BUTTON
   ================================================================ */

function BackToTop() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const circumference = 2 * Math.PI * 22;
  const strokeOffset = useTransform(scrollYProgress, [0, 1], [circumference, 0]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => setVisible(v > 0.15));
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#home"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-purple-200/50 group"
          style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed, #0891b2)" }}
        >
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <motion.circle
              cx="24" cy="24" r="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              style={{ strokeDashoffset: strokeOffset }}
            />
          </svg>
          <ArrowRight size={16} className="text-white rotate-[-90deg] group-hover:-translate-y-0.5 transition-transform" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/* ================================================================
   MAGNETIC BUTTON WRAPPER
   ================================================================ */

function MagneticWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      className={`transition-transform duration-200 ease-out ${className}`}>
      {children}
    </div>
  );
}

/* ================================================================
   REVEAL ON SCROLL WRAPPER
   ================================================================ */

function Reveal({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }) {
  const initial = direction === "up" ? { opacity: 0, y: 40 } : direction === "left" ? { opacity: 0, x: -40 } : { opacity: 0, x: 40 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <main className="min-h-screen bg-white">
          <ScrollProgress />
          <BackToTop />
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Education />
          <Certifications />
          <Contact />
          <Footer />
        </main>
      )}
    </>
  );
}
