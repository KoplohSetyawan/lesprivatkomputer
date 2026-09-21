"use client";

import { motion } from "framer-motion";
import { Code2, GraduationCap, School, Briefcase, Terminal } from "lucide-react";

/** Contoh materi C++ — kode asli yang dipraktikkan peserta di kelas */
const codeLines: React.ReactNode[] = [
  <span key="l1">
    <span className="text-amber-300">#include</span>{" "}
    <span className="text-slate-400">&lt;iostream&gt;</span>
  </span>,
  <span key="l2"> </span>,
  <span key="l3">
    <span className="text-sky-300">using</span>{" "}
    <span className="text-sky-300">namespace</span>{" "}
    <span className="text-teal-300">std</span>;
  </span>,
  <span key="l4"> </span>,
  <span key="l5">
    <span className="text-sky-300">int</span>{" "}
    <span className="text-amber-200">main</span>()
  </span>,
  <span key="l6">{"{"}</span>,
  <span key="l7">
    {"    "}
    <span className="text-teal-300">string</span> var1 ={" "}
    <span className="text-emerald-300">&quot;Belajar C++ di LesKomputer&quot;</span>;
  </span>,
  <span key="l8">
    {"    "}
    <span className="text-teal-300">string</span> var2 ={" "}
    <span className="text-emerald-300">&quot;Semangat!!&quot;</span>;
  </span>,
  <span key="l9">
    {"    "}
    <span className="text-teal-300">string</span> var3 ={" "}
    <span className="text-emerald-300">&quot;Belajar demi masa depan yang lebih baik&quot;</span>;
  </span>,
  <span key="l10"> </span>,
  <span key="l11">
    {"    "}
    <span className="text-slate-400">cout</span> &lt;&lt;{" "}
    <span className="text-emerald-300">&quot;Panjang string var1 adalah &quot;</span> &lt;&lt;{" "}
    var1.<span className="text-sky-200">length</span>() &lt;&lt; endl;
  </span>,
  <span key="l12">
    {"    "}
    <span className="text-slate-400">cout</span> &lt;&lt;{" "}
    <span className="text-emerald-300">&quot;Panjang string var2 adalah &quot;</span> &lt;&lt;{" "}
    var2.<span className="text-sky-200">length</span>() &lt;&lt; endl;
  </span>,
  <span key="l13">
    {"    "}
    <span className="text-slate-400">cout</span> &lt;&lt;{" "}
    <span className="text-emerald-300">&quot;Panjang string var3 adalah &quot;</span> &lt;&lt;{" "}
    var3.<span className="text-sky-200">size</span>() &lt;&lt; endl;
  </span>,
  <span key="l14"> </span>,
  <span key="l15">
    {"    "}
    <span className="text-sky-300">return</span> <span className="text-orange-300">0</span>;
  </span>,
  <span key="l16">{"}"}</span>,
];

const outputLines = [
  "Panjang string var1 adalah 26",
  "Panjang string var2 adalah 10",
  "Panjang string var3 adalah 39",
];

const audiences = [
  { icon: GraduationCap, label: "Mahasiswa" },
  { icon: School, label: "SMK" },
  { icon: Briefcase, label: "Umum / Kerja" },
];

export function Materi() {
  return (
    <section id="materi" className="scroll-mt-20 bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Teks */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="min-w-0"
          >
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-bold text-sky-700">
              <Code2 className="h-4 w-4" aria-hidden="true" />
              Contoh Materi
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
              Praktik Langsung,{" "}
              <span className="bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent">
                Bukan Hanya Teori
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Sejak pertemuan pertama, peserta langsung menulis dan menjalankan kode asli seperti
              program C++ di samping &mdash; lalu berlatih dengan bimbingan instruktur sampai benar-benar paham.
            </p>

            <div className="mt-6 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm font-bold text-slate-700">Materi disesuaikan untuk:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {audiences.map((audience) => (
                  <span
                    key={audience.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
                  >
                    <audience.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {audience.label}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Belum punya dasar komputer sama sekali? Tenang, semua materi dimulai dari nol dan
                tempo belajarnya menyesuaikan kemampuan tiap peserta.
              </p>
            </div>
          </motion.div>

          {/* Jendela kode */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative min-w-0"
          >
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-sky-100 via-white to-emerald-100"
            />
            <div className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-700/50 shadow-2xl shadow-slate-300">
              {/* Bar jendela */}
              <div className="flex items-center gap-2 bg-slate-800 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-amber-400" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden="true" />
                <span className="ml-3 font-mono text-xs text-slate-400">materi-dasar/main.cpp</span>
                <span className="ml-auto rounded-full bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">
                  C++ Dasar
                </span>
              </div>
              {/* Kode */}
              <pre className="overflow-x-auto bg-slate-900 p-4 font-mono text-[12.5px] leading-relaxed text-slate-200 sm:p-5 sm:text-[13.5px]">
                <code>
                  {codeLines.map((line, index) => (
                    <span key={index} className="block whitespace-pre">
                      {line}
                    </span>
                  ))}
                </code>
              </pre>
              {/* Output terminal */}
              <div className="border-t border-slate-700/60 bg-slate-950 px-4 py-3 sm:px-5">
                <p className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <Terminal className="h-3 w-3" aria-hidden="true" />
                  Output
                </p>
                <div className="mt-1.5 space-y-0.5 font-mono text-[11.5px] text-emerald-400 sm:text-xs">
                  {outputLines.map((line) => (
                    <p key={line}>
                      <span className="text-slate-500">$ </span>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
