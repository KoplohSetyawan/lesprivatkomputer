"use client";

import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
  FileSpreadsheet,
  Code2,
  Palette,
  BookOpen,
  Check,
  MessageCircle,
  Clock,
  GraduationCap,
  Wallet,
  AlertCircle,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { waLink, waProgramMessage } from "@/lib/site-config";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, { icon: LucideIcon; className: string }> = {
  office: { icon: FileSpreadsheet, className: "bg-sky-100 text-sky-600" },
  code: { icon: Code2, className: "bg-indigo-100 text-indigo-600" },
  design: { icon: Palette, className: "bg-emerald-100 text-emerald-600" },
  book: { icon: BookOpen, className: "bg-cyan-100 text-cyan-600" },
};

const FALLBACK_ICON = ICON_MAP.book;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Programs() {
  const { programs, programsLoading, fetchPrograms } = useAppStore();

  useEffect(() => {
    void fetchPrograms();
  }, [fetchPrograms]);

  return (
    <section
      id="program"
      className="scroll-mt-20 bg-gradient-to-b from-white via-sky-50/60 to-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Judul section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-bold text-sky-700">
            Program Les
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            Pilih Program yang{" "}
            <span className="bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent">
              Sesuai Maumu
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Klik tombol daftar pada program pilihanmu &mdash; kamu akan langsung terhubung dengan
            admin kami via WhatsApp untuk info jadwal dan pendaftaran.
          </p>
        </motion.div>

        {/* Skeleton saat memuat */}
        {programsLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Memuat program">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
                <div className="mt-6 space-y-3">
                  {[0, 1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="mt-6 h-11 w-full rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Kartu program dari database */}
        {!programsLoading && programs.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {programs.map((program) => {
              const meta = ICON_MAP[program.icon] ?? FALLBACK_ICON;
              const Icon = meta.icon;
              return (
                <motion.article
                  key={program.id}
                  variants={card}
                  className="group relative flex flex-col rounded-3xl border border-sky-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-100 sm:p-7"
                >
                  {/* Ikon program */}
                  <div className="mb-5 flex items-center justify-between">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${meta.className} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                      {program.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-800">{program.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {program.description}
                  </p>

                  {/* Materi */}
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {program.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span
                          className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full ${meta.className}`}
                        >
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                        {topic}
                      </li>
                    ))}
                  </ul>

                  {/* Info durasi & harga */}
                  <div className="mt-6 flex items-center gap-4 border-t border-dashed border-slate-200 pt-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-sky-500" aria-hidden="true" />
                      {program.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                      Sertifikat
                    </span>
                  </div>

                  {/* Harga */}
                  <div className="mt-4 flex items-baseline justify-between rounded-xl bg-emerald-50 px-4 py-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700/80">
                      <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
                      Biaya
                    </span>
                    <span className="text-base font-extrabold text-emerald-700">
                      {program.price || "Hubungi Admin"}
                    </span>
                  </div>

                  {/* Tombol daftar -> WhatsApp */}
                  <Button
                    asChild
                    className="mt-4 w-full rounded-full bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-600 hover:shadow-emerald-200"
                  >
                    <a
                      href={waLink(waProgramMessage(program.name))}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Daftar program ${program.name} via WhatsApp`}
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Daftar Program Ini
                    </a>
                  </Button>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* Kondisi kosong */}
        {!programsLoading && programs.length === 0 && (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-sky-200 bg-white/70 p-10 text-center">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-sky-300" aria-hidden="true" />
            <p className="font-bold text-slate-700">Belum ada program tersedia</p>
            <p className="mt-1 text-sm text-slate-500">
              Silakan hubungi admin via WhatsApp untuk info program terbaru.
            </p>
            <Button
              asChild
              className="mt-5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <a
                href={waLink(
                  "Halo Admin LesKomputer! 👋 Saya ingin menanyakan daftar program les yang tersedia. Terima kasih 🙏"
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                Hubungi Admin
              </a>
            </Button>
          </div>
        )}

        {/* Keterangan harga: Les Biasa vs Les Resmi Sertifikat */}
        {!programsLoading && programs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-10 max-w-3xl"
          >
            <div className="overflow-hidden rounded-2xl border border-amber-300/70 bg-amber-50 shadow-sm">
              <div className="flex items-start gap-3 p-4 sm:p-5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <AlertCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 text-sm leading-relaxed">
                  <p className="font-extrabold text-amber-800">
                    Penting: harga yang tertera di atas adalah harga <u>LES BIASA</u>
                  </p>
                  <p className="mt-1 text-amber-700">
                    Harga tersebut <strong>bukan</strong> les resmi bersertifikat. Jika kamu
                    mengikuti <strong>LES RESMI SERTIFIKAT</strong>, harganya berbeda seperti
                    tertera di bawah ini.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-amber-200 bg-white/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Award className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold tracking-wide text-slate-800">
                      LES RESMI SERTIFIKAT
                    </p>
                    <p className="text-xs text-slate-500">Dengan sertifikat resmi</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-xl bg-emerald-50 px-4 py-2 text-lg font-extrabold text-emerald-700 ring-1 ring-emerald-200">
                    Rp 1.900.000
                  </span>
                  <Button
                    asChild
                    className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-100 transition-colors hover:bg-emerald-600"
                  >
                    <a
                      href={waLink(
                        "Halo Admin LesKomputer! 👋 Saya ingin bertanya tentang LES RESMI SERTIFIKAT (Rp 1.900.000). Terima kasih 🙏"
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Tanya les resmi sertifikat via WhatsApp"
                      className="flex items-center gap-1.5"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      Tanya Admin
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Catatan khusus */}
        {!programsLoading && programs.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-10 max-w-xl text-center text-sm text-slate-500"
          >
            💡 Belum yakin pilih yang mana?{" "}
            <a
              href={waLink(
                "Halo Admin LesKomputer! 👋 Saya ingin konsultasi dulu untuk memilih program les yang cocok. Terima kasih 🙏"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sky-600 underline decoration-sky-300 underline-offset-4 transition-colors hover:text-sky-700"
            >
              Konsultasi gratis dengan admin
            </a>{" "}
            lewat WhatsApp.
          </motion.p>
        )}
      </div>
    </section>
  );
}
