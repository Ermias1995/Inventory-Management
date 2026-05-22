"use client";

import {
  X, Code2, Database, Cloud, Layers,
  CheckCircle, User, Calendar, Mail,
  GitBranch, ExternalLink, Briefcase,
} from "lucide-react";

interface AboutModalProps {
  isOpen:  boolean;
  onClose: () => void;
}

const techStack = [
  {
    name:        "Next.js 15",
    description: "React framework with App Router for server and client components",
    icon:        "▲",
    color:       "bg-black text-white",
  },
  {
    name:        "Drizzle ORM",
    description: "Type-safe ORM for database schema definition and queries",
    icon:        <Database size={14} />,
    color:       "bg-green-100 text-green-700",
  },
  {
    name:        "Neon PostgreSQL",
    description: "Serverless PostgreSQL database for storing inventory data",
    icon:        <Database size={14} />,
    color:       "bg-teal-100 text-teal-700",
  },
  {
    name:        "Cloudinary",
    description: "Cloud-based image storage, optimization and delivery",
    icon:        <Cloud size={14} />,
    color:       "bg-blue-100 text-blue-700",
  },
  {
    name:        "Tailwind CSS",
    description: "Utility-first CSS framework for responsive UI design",
    icon:        <Layers size={14} />,
    color:       "bg-cyan-100 text-cyan-700",
  },
  {
    name:        "TypeScript",
    description: "Strongly typed JavaScript for safer, cleaner code",
    icon:        <Code2 size={14} />,
    color:       "bg-indigo-100 text-indigo-700",
  },
];

const features = [
  "Create, Read, Update and Delete inventory items",
  "Image upload and storage via Cloudinary",
  "Responsive design — works on mobile and desktop",
  "Real-time stock status badges (In Stock, Low Stock, Out of Stock)",
  "Search items by name or description",
  "Filter items by category with live counts",
  "Export inventory data to CSV",
  "Sortable table columns",
  "Confirm dialog before deletion",
  "Toast notifications for all actions",
  "Optimized image delivery via Cloudinary CDN",
  "Deployed and live on Vercel",
];

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Briefcase size={17} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">About This Project</h2>
              <p className="text-xs text-gray-400">Inventory Management System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 space-y-6">

          {/* Developer card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
                <User size={26} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Ermias Firdawok</h3>
                <p className="text-sm text-indigo-600 font-medium">
                  Computer Engineering Graduate · Full Stack Developer
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={13} className="text-indigo-400" />
                    Developed: May 22, 2026
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={13} className="text-indigo-400" />
                    Deadline: May 24, 2026
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Purpose</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              This project was developed as a technical assessment for a Full Stack Developer
              position. The goal was to demonstrate proficiency in modern web technologies
              by building a fully functional, responsive, and production-ready Inventory
              Management CRUD web application — from database design to deployment.
            </p>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Tech Stack</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors"
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${tech.color}`}>
                    {tech.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{tech.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Features Included</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <CheckCircle
                    size={14}
                    className="text-emerald-500 mt-0.5 shrink-0"
                  />
                  <span className="text-xs text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project requirements met */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <h4 className="text-sm font-semibold text-emerald-800 mb-2">
              ✅ All Requirements Met
            </h4>
            <p className="text-xs text-emerald-700 leading-relaxed">
              All project requirements specified in the assessment have been implemented —
              including CRUD operations, image uploading via Cloudinary, data persistence
              with Neon PostgreSQL, responsive Tailwind CSS UI, and deployment to Vercel.
            </p>
          </div>

          {/* Contact / submission */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Submission</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Mail size={13} className="text-indigo-400 shrink-0" />
              Submitted to: enbbusinessconsultancy@gmail.com
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <GitBranch size={13} className="text-indigo-400 shrink-0" />
              Gitbranch repository included with submission
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ExternalLink size={13} className="text-indigo-400 shrink-0" />
              Live application deployed on Vercel
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}