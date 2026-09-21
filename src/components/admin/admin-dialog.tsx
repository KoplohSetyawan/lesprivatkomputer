"use client";

import { useState } from "react";
import {
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  FileSpreadsheet,
  Code2,
  Palette,
  BookOpen,
  X,
  Check,
  AlertCircle,
  Wallet,
  Database,
  HardDrive,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { ADMIN_TOKEN_KEY } from "@/lib/site-config";
import type { Program } from "@/lib/json-db";
import type { LucideIcon } from "lucide-react";

interface ProgramForm {
  name: string;
  level: string;
  description: string;
  duration: string;
  price: string;
  icon: string;
  topics: string[];
}

const EMPTY_FORM: ProgramForm = {
  name: "",
  level: "Pemula",
  description: "",
  duration: "16 Sesi",
  price: "",
  icon: "book",
  topics: [""],
};

const ICON_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "office", label: "Office", icon: FileSpreadsheet },
  { value: "code", label: "Coding", icon: Code2 },
  { value: "design", label: "Desain", icon: Palette },
  { value: "book", label: "Lainnya", icon: BookOpen },
];

export function AdminDialog() {
  const {
    adminOpen,
    openAdmin,
    closeAdmin,
    adminToken: token,
    setAdminToken,
    adminView: view,
    setAdminView: setView,
    logoutAdmin,
    programs,
    storage,
    fetchPrograms,
  } = useAppStore();

  // Form login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Form program
  const [form, setForm] = useState<ProgramForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login gagal");
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setAdminToken(data.token);
        setView("list");
      })
      .catch((err: Error) => setLoginError(err.message))
      .finally(() => setLoggingIn(false));
  }

  function handleLogout() {
    logoutAdmin();
  }

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
    setView("form");
  }

  function openEditForm(program: Program) {
    setForm({
      name: program.name,
      level: program.level,
      description: program.description,
      duration: program.duration,
      price: program.price,
      icon: program.icon,
      topics: program.topics.length > 0 ? [...program.topics] : [""],
    });
    setEditingId(program.id);
    setFormError("");
    setView("form");
  }

  function handleUnauthorized() {
    logoutAdmin();
    setLoginError("Sesi berakhir. Silakan login ulang.");
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const topics = form.topics.map((t) => t.trim()).filter(Boolean);
    if (!form.name.trim()) {
      setFormError("Nama program wajib diisi");
      return;
    }
    if (topics.length === 0) {
      setFormError("Minimal isi 1 materi");
      return;
    }

    setSaving(true);
    const payload = {
      id: editingId,
      name: form.name.trim(),
      level: form.level.trim() || "Pemula",
      description: form.description.trim(),
      duration: form.duration.trim() || "16 Sesi",
      price: form.price.trim(),
      icon: form.icon,
      topics,
    };

    fetch("/api/admin/programs", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 401) {
          handleUnauthorized();
          throw new Error("Sesi berakhir");
        }
        if (!res.ok) throw new Error(data.error || "Gagal menyimpan program");
        return data;
      })
      .then(async () => {
        await fetchPrograms();
        setView("list");
        setEditingId(null);
      })
      .catch((err: Error) => {
        if (err.message !== "Sesi berakhir") setFormError(err.message);
      })
      .finally(() => setSaving(false));
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    fetch(`/api/admin/programs?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token ?? ""}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 401) {
          handleUnauthorized();
          throw new Error("Sesi berakhir");
        }
        if (!res.ok) throw new Error(data.error || "Gagal menghapus program");
        await fetchPrograms();
      })
      .catch((err: Error) => {
        if (err.message !== "Sesi berakhir") setFormError(err.message);
      })
      .finally(() => setDeletingId(null));
  }

  return (
    <Dialog open={adminOpen} onOpenChange={(open) => (open ? openAdmin() : closeAdmin())}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {/* ============ LOGIN ============ */}
        {view === "login" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                </span>
                Login Admin
              </DialogTitle>
              <DialogDescription>
                Masuk untuk mengelola program, harga, dan materi les.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              {loginError && (
                <p
                  role="alert"
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                >
                  <AlertCircle className="h-4 w-4 flex-none" aria-hidden="true" />
                  {loginError}
                </p>
              )}

              <Button
                type="submit"
                disabled={loggingIn}
                className="w-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 py-2.5 text-white hover:from-sky-600 hover:to-emerald-600"
              >
                {loggingIn ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </>
        )}

        {/* ============ DAFTAR PROGRAM ============ */}
        {view === "list" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
                  <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                </span>
                Kelola Program Les
              </DialogTitle>
              <DialogDescription>
                Tambah, ubah, atau hapus program beserta harga dan materinya.
              </DialogDescription>
            </DialogHeader>

            {/* Status penyimpanan */}
            {storage === "database" && (
              <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                <Database className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                Penyimpanan: <strong>Database</strong> — perubahan tersimpan permanen.
              </p>
            )}
            {storage === "file" && (
              <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                <HardDrive className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
                <span>
                  Penyimpanan: <strong>File sementara</strong> — data bisa hilang di Vercel.
                  Agar permanen: buat database gratis di <strong>neon.tech</strong>, lalu tempel
                  URL-nya di file <strong>src/lib/db-config.ts</strong> (edit langsung di GitHub
                  dengan ikon pensil ✏️). Panduan lengkap ada di file PANDUAN-DEPLOY-NEON.md.
                </span>
              </p>
            )}

            <div className="space-y-3 pt-1">
              <div className="max-h-72 space-y-2.5 overflow-y-auto rounded-xl bg-slate-50/70 p-2.5 ring-1 ring-slate-100">
                {programs.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Belum ada program. Klik &ldquo;Tambah Program&rdquo; untuk membuat.
                  </p>
                )}
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center gap-3 rounded-xl border border-sky-100 bg-white p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">{program.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge className="bg-sky-50 text-sky-700 ring-1 ring-sky-100" variant="secondary">
                          {program.price || "Harga belum diatur"}
                        </Badge>
                        <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" variant="secondary">
                          {program.duration}
                        </Badge>
                        <Badge className="bg-slate-50 text-slate-600 ring-1 ring-slate-200" variant="secondary">
                          {program.topics.length} materi
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-1.5">
                      {deletingId === program.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 rounded-full px-3 text-xs"
                            onClick={() => handleDelete(program.id)}
                            disabled={saving}
                          >
                            Hapus?
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-full px-3 text-xs"
                            onClick={() => setDeletingId(null)}
                          >
                            Batal
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-sky-600 hover:bg-sky-50 hover:text-sky-700"
                            aria-label={`Edit program ${program.name}`}
                            onClick={() => openEditForm(program)}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Hapus program ${program.name}`}
                            onClick={() => setDeletingId(program.id)}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {formError && (
                <p
                  role="alert"
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                >
                  <AlertCircle className="h-4 w-4 flex-none" aria-hidden="true" />
                  {formError}
                </p>
              )}

              <div className="flex items-center justify-between gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <LogOut className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Keluar
                </Button>
                <Button
                  onClick={openCreateForm}
                  className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-600 hover:to-emerald-600"
                >
                  <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Tambah Program
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ============ FORM TAMBAH / EDIT ============ */}
        {view === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Program" : "Tambah Program Baru"}
              </DialogTitle>
              <DialogDescription>
                Isi detail program: nama, ikon, harga, durasi, deskripsi, dan materi.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 pt-1">
              <div className="space-y-2">
                <Label htmlFor="prog-name">
                  Nama Program <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prog-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="cth: Microsoft Office"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Ikon Program</Label>
                <div className="flex gap-2" role="radiogroup" aria-label="Pilih ikon program">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={form.icon === opt.value}
                      onClick={() => setForm({ ...form, icon: opt.value })}
                      className={`flex flex-1 flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-[11px] font-semibold transition-all ${
                        form.icon === opt.value
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-sky-200"
                      }`}
                    >
                      <opt.icon className="h-5 w-5" aria-hidden="true" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="prog-level">Level</Label>
                  <Input
                    id="prog-level"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    placeholder="cth: Pemula - Menengah"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prog-duration">Durasi</Label>
                  <Input
                    id="prog-duration"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="cth: 24 Sesi"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prog-price" className="flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  Harga
                </Label>
                <Input
                  id="prog-price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="cth: Rp 350.000 (kosongkan untuk 'Hubungi Admin')"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prog-desc">Deskripsi Singkat</Label>
                <Textarea
                  id="prog-desc"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi program yang tampil di kartu beranda..."
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Materi <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-2">
                  {form.topics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={topic}
                        onChange={(e) => {
                          const next = [...form.topics];
                          next[index] = e.target.value;
                          setForm({ ...form, topics: next });
                        }}
                        placeholder={`cth: Materi ${index + 1}`}
                        aria-label={`Materi ${index + 1}`}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 flex-none text-red-500 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Hapus materi ${index + 1}`}
                        disabled={form.topics.length <= 1}
                        onClick={() =>
                          setForm({
                            ...form,
                            topics: form.topics.filter((_, i) => i !== index),
                          })
                        }
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setForm({ ...form, topics: [...form.topics, ""] })}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Tambah Materi
                </Button>
              </div>

              {formError && (
                <p
                  role="alert"
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                >
                  <AlertCircle className="h-4 w-4 flex-none" aria-hidden="true" />
                  {formError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setView("list")}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-600 hover:to-emerald-600"
                >
                  {saving ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <Check className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      {editingId ? "Simpan Perubahan" : "Tambah Program"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
