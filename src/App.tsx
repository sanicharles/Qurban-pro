/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  ChevronRight, 
  ShieldCheck, 
  Scissors, 
  Truck, 
  Info, 
  Search,
  LayoutDashboard,
  Network,
  ListCheck,
  Menu,
  X,
  Bell,
  HeartHandshake,
  Edit2,
  Save,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import sheepLogo from './assets/sheep-logo.jpg';

// --- Types ---
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Recipient {
  id: string;
  name: string;
  address: string;
  couponNumber: string;
  status: 'pending' | 'received';
}

interface Division {
  id: string;
  title: string;
  icon: React.ReactNode;
  head: string;
  description: string;
  members: Member[];
  color: string;
  tasks: Task[];
}

interface DivisionDisclosureProps {
  key?: React.Key;
  division: Division;
  onEditDivision: () => void;
  onDeleteDivision: () => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  onAddMember: () => void;
}

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

// --- Data ---
const RECIPIENT_DATA: Recipient[] = [
  { id: 'r1', name: 'Bpk. Supardi', address: 'RT 01 / RW 02', couponNumber: 'A-001', status: 'received' },
  { id: 'r2', name: 'Ibu Maryam', address: 'RT 03 / RW 02', couponNumber: 'A-002', status: 'pending' },
  { id: 'r3', name: 'Sdr. Jaka', address: 'RT 01 / RW 03', couponNumber: 'B-015', status: 'pending' },
];

const COMMITTEE_DATA: Division[] = [
  {
    id: 'core',
    title: 'Pengurus Inti',
    icon: <ShieldCheck className="w-5 h-5" />,
    head: 'H. Ahmad Syukur',
    description: 'Penanggung jawab utama dan koordinasi seluruh rangkaian ibadah qurban.',
    color: 'bg-emerald-600',
    members: [
      { id: 'c1', name: 'H. Ahmad Syukur', role: 'Ketua Panitia' },
      { id: 'c2', name: 'Ust. Ridwan Hakim', role: 'Wakil Ketua' },
      { id: 'c3', name: 'Zulkifli Amin', role: 'Sekretaris' },
      { id: 'c4', name: 'Hj. Fatimah', role: 'Bendahara' },
    ],
    tasks: [
      { id: 't1', title: 'Rapat koordinasi pembentukan panitia', completed: true },
      { id: 't2', title: 'Penyusunan anggaran biaya operasional', completed: true },
      { id: 't3', title: 'Sosialisasi ke warga sekitar', completed: false },
    ]
  },
  {
    id: 'procurement',
    title: 'Sie Pengadaan Hewan',
    icon: <Users className="w-5 h-5" />,
    head: 'Bpk. Darmanto',
    description: 'Bertanggung jawab atas pemilihan, pembelian, dan kesehatan hewan qurban.',
    color: 'bg-blue-600',
    members: [
      { id: 'p1', name: 'Bpk. Darmanto', role: 'Koordinator' },
      { id: 'p2', name: 'H. Mulyono', role: 'Anggota' },
      { id: 'p3', name: 'drh. Faisal', role: 'Tim Medis' },
    ],
    tasks: [
      { id: 't4', title: 'Survei lokasi supplier hewan kurban', completed: true },
      { id: 't5', title: 'Pengecekan kesehatan rutin hewan datang', completed: false },
      { id: 't6', title: 'Pemberian pakan dan kebersihan kandang transit', completed: false },
    ]
  },
  {
    id: 'slaughter',
    title: 'Sie Penyembelihan',
    icon: <Scissors className="w-5 h-5" />,
    head: 'Ust. Mansyur',
    description: 'Pelaksanaan penyembelihan sesuai syariat Islam dan manajemen area pemotongan.',
    color: 'bg-red-600',
    members: [
      { id: 's1', name: 'Ust. Mansyur', role: 'Juru Sembelih Halal' },
      { id: 's2', name: 'Bpk. Gunawan', role: 'Koord. Kulit' },
      { id: 's3', name: 'Tim Jagal (10 Orang)', role: 'Pelaksana' },
    ],
    tasks: [
      { id: 't7', title: 'Asah bilah dan persiapan alat sembelih', completed: false },
      { id: 't8', title: 'Sterilisasi area pemotongan', completed: false },
      { id: 't9', title: 'Briefing tim jagal terkait SOP syari', completed: false },
    ]
  },
  {
    id: 'distribution',
    title: 'Sie Distribusi & Logistik',
    icon: <Truck className="w-5 h-5" />,
    head: 'Sdr. Fauzan',
    description: 'Pengaturan kupon, pengemasan daging, dan pengiriman ke mustahik.',
    color: 'bg-amber-600',
    members: [
      { id: 'd1', name: 'Sdr. Fauzan', role: 'Koordinator' },
      { id: 'd2', name: 'Ibu Ratna', role: 'Tim Pencacahan' },
      { id: 'd3', name: 'Pemuda Masjid (20 Orang)', role: 'Tim Antar' },
    ],
    tasks: [
      { id: 't10', title: 'Pendataan mustahik dan pencetakan kupon', completed: true },
      { id: 't11', title: 'Persiapan kantong ramah lingkungan', completed: false },
      { id: 't12', title: 'Mapping rute distribusi tim antar', completed: false },
    ]
  }
];

const STATS_DATA = (data: Division[]) => [
  { label: 'Total Panitia', value: data.reduce((acc, div) => acc + div.members.length, 0), icon: <Users className="w-4 h-4" /> },
  { label: 'Divisi', value: data.length, icon: <Network className="w-4 h-4" /> },
  { label: 'Progres Tugas', value: `${Math.round((data.reduce((acc, div) => acc + div.tasks.filter(t => t.completed).length, 0) / Math.max(1, data.reduce((acc, div) => acc + div.tasks.length, 0))) * 100)}%`, icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function App() {
  const [committeeData, setCommitteeData] = useState<Division[]>(COMMITTEE_DATA);
  const [recipients, setRecipients] = useState<Recipient[]>(RECIPIENT_DATA);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'structure' | 'tasks' | 'recipients'>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');
  
  // Edit States
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [editingMember, setEditingMember] = useState<{ divId: string, member: Member | null } | null>(null);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [confirmation, setConfirmation] = useState<{
    type: 'division' | 'member' | 'recipient';
    id: string;
    divId?: string;
    title: string;
  } | null>(null);

  const handleUpdateDivision = (updatedDiv: Division) => {
    setCommitteeData(prev => prev.map(d => d.id === updatedDiv.id ? updatedDiv : d));
    setEditingDivision(null);
  };

  const handleDeleteDivision = (divId: string) => {
    setCommitteeData(prev => prev.filter(d => d.id !== divId));
    setConfirmation(null);
  };

  const handleUpdateMember = (divId: string, updatedMember: Member) => {
    setCommitteeData(prev => prev.map(div => {
      if (div.id === divId) {
        const isNew = !div.members.find(m => m.id === updatedMember.id);
        return {
          ...div,
          members: isNew 
            ? [...div.members, updatedMember] 
            : div.members.map(m => m.id === updatedMember.id ? updatedMember : m)
        };
      }
      return div;
    }));
    setEditingMember(null);
  };

  const handleDeleteMember = (divId: string, memberId: string) => {
    setCommitteeData(prev => prev.map(div => {
      if (div.id === divId) {
        return {
          ...div,
          members: div.members.filter(m => m.id !== memberId)
        };
      }
      return div;
    }));
    setConfirmation(null);
  };

  const handleUpdateRecipient = (updatedRecipient: Recipient) => {
    setRecipients(prev => {
      const isNew = !prev.find(r => r.id === updatedRecipient.id);
      if (isNew) return [...prev, updatedRecipient];
      return prev.map(r => r.id === updatedRecipient.id ? updatedRecipient : r);
    });
    setEditingRecipient(null);
  };

  const handleDeleteRecipient = (id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
    setConfirmation(null);
  };

  const toggleRecipientStatus = (id: string) => {
    setRecipients(prev => prev.map(r => 
      r.id === id ? { ...r, status: r.status === 'received' ? 'pending' : 'received' } : r
    ));
  };

  const filteredRecipients = recipients.filter(r => 
    r.name.toLowerCase().includes(recipientSearch.toLowerCase()) || 
    r.couponNumber.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  const stats = STATS_DATA(committeeData);

  return (
    <div className="min-h-screen gradient-bg flex flex-col pb-20 md:pb-0">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-50 glass-card mx-2 mt-2 px-4 py-3 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-3">
          <img src={sheepLogo} alt="Sheep Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-200 object-cover" />
          <div>
            <h1 className="font-display text-lg font-bold text-slate-800 leading-tight">QurbanPro</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Idul Adha 1447H</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Desktop Sidebar & Mobile Menu Overlay */}
      <nav className={`
        fixed inset-y-0 left-0 z-40 w-64 glass-card border-r rounded-none transition-transform lg:translate-x-0
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 hidden lg:flex items-center gap-3 mb-8">
          <img src={sheepLogo} alt="Sheep Logo" className="w-12 h-12 rounded-2xl shadow-xl shadow-emerald-100 object-cover" />
          <div>
            <h1 className="font-display text-xl font-extrabold text-brand-secondary">QurbanPro</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Committee Hub</p>
          </div>
        </div>

        <div className="px-4 space-y-2 mt-20 lg:mt-0">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }}
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
          />
          <NavItem 
            active={activeTab === 'structure'} 
            onClick={() => { setActiveTab('structure'); setIsMenuOpen(false); }}
            icon={<Network size={20} />} 
            label="Struktur Organisasi" 
          />
          <NavItem 
            active={activeTab === 'tasks'} 
            onClick={() => { setActiveTab('tasks'); setIsMenuOpen(false); }}
            icon={<ListCheck size={20} />} 
            label="Tugas & Jobdesk" 
          />
          <NavItem 
            active={activeTab === 'recipients'} 
            onClick={() => { setActiveTab('recipients'); setIsMenuOpen(false); }}
            icon={<HeartHandshake size={20} />} 
            label="Penerima Daging" 
          />
        </div>

        <div className="absolute bottom-8 left-4 right-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span className="text-xs font-bold text-emerald-800">Update Terkini</span>
          </div>
          <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">
            Rapat koordinasi teknis akan dilaksanakan pada 15 Mei 2026.
          </p>
        </div>
      </nav>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Welcome Banner */}
              <div className="bg-brand-secondary rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl shadow-emerald-200">
                <div className="relative z-10">
                  <h2 className="text-2xl font-display font-bold mb-2">Assalamu'alaikum, Panitia</h2>
                  <p className="text-slate-300 text-sm max-w-sm">
                    Mari kita sukseskan ibadah Qurban 1447H dengan kerjasama yang solid dan profesional.
                  </p>
                </div>
                <div className="absolute top-[-20px] right-[-20px] opacity-10">
                  <HeartHandshake size={180} />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="glass-card p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-lg font-bold text-slate-800 mt-1">{stat.value}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-600">
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Divisions Mini List */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-slate-800">Divisi Utama</h3>
                  <button onClick={() => setActiveTab('structure')} className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    Lihat Semua <ChevronRight size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {committeeData.map((div) => (
                    <motion.div 
                      key={div.id}
                      whileHover={{ scale: 1.02 }}
                      className="glass-card p-4 flex items-start gap-4 cursor-pointer"
                      onClick={() => { setActiveTab('structure'); }}
                    >
                      <div className={`w-12 h-12 rounded-2xl ${div.color} flex items-center justify-center text-white shadow-lg`}>
                        {div.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm">{div.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{div.description}</p>
                        <div className="mt-3 flex items-center text-[10px] text-slate-400 font-bold uppercase">
                          <Users size={12} className="mr-1" /> {div.members.length} Anggota
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : activeTab === 'structure' ? (
            <motion.div
              key="structure"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-800">Struktur Kepanitian</h2>
                  <p className="text-sm text-slate-500">Susunan pengelola kegiatan qurban masjid.</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Cari panitia..." 
                    className="w-full md:w-64 pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all shadow-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              {/* Hierarchy View */}
              <div className="space-y-4">
                {committeeData.map((division) => (
                  <DivisionDisclosure 
                    key={division.id} 
                    division={division} 
                    onEditDivision={() => setEditingDivision(division)}
                    onDeleteDivision={() => setConfirmation({ 
                      type: 'division', 
                      id: division.id, 
                      title: division.title 
                    })}
                    onEditMember={(member) => setEditingMember({ divId: division.id, member })}
                    onAddMember={() => setEditingMember({ divId: division.id, member: null })}
                    onDeleteMember={(memberId) => {
                      const member = division.members.find(m => m.id === memberId);
                      setConfirmation({ 
                        type: 'member', 
                        id: memberId, 
                        divId: division.id, 
                        title: member?.name || 'Anggota' 
                      });
                    }}
                  />
                ))}
              </div>

              {/* Modals are rendered globally below */}
            </motion.div>
          ) : activeTab === 'tasks' ? (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-800">Tugas & Jobdesk</h2>
                <p className="text-sm text-slate-500">Daftar tanggung jawab per divisi.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {committeeData.map((div) => (
                  <div key={div.id} className="glass-card overflow-hidden">
                    <div className={`p-4 ${div.color} text-white flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        {div.icon}
                        <h3 className="font-bold">{div.title}</h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
                        {div.tasks.filter(t => t.completed).length}/{div.tasks.length} Selesai
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      {div.tasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 group">
                          <button 
                            onClick={() => {
                              const updatedDiv = {
                                ...div,
                                tasks: div.tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
                              };
                              handleUpdateDivision(updatedDiv);
                            }}
                            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 hover:border-emerald-500'}`}
                          >
                            {task.completed && <Save size={12} />}
                          </button>
                          <span className={`flex-1 text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {task.title}
                          </span>
                          <button 
                            onClick={() => {
                              const updatedDiv = {
                                ...div,
                                tasks: div.tasks.filter(t => t.id !== task.id)
                              };
                              handleUpdateDivision(updatedDiv);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all font-bold"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <div className="pt-2">
                        <button 
                          onClick={() => {
                            const title = prompt('Masukkan tugas baru:');
                            if (!title) return;
                            const newTask = { id: Math.random().toString(36).substr(2, 9), title, completed: false };
                            const updatedDiv = { ...div, tasks: [...div.tasks, newTask] };
                            handleUpdateDivision(updatedDiv);
                          }}
                          className="w-full py-2 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all text-xs font-bold"
                        >
                          + Tambah Tugas
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recipients"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-800">Daftar Penerima Daging</h2>
                  <p className="text-sm text-slate-500">Manajemen mustahik dan distribusi kupon.</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 md:w-64">
                    <input 
                      type="text" 
                      placeholder="Cari nama/kupon..." 
                      value={recipientSearch}
                      onChange={(e) => setRecipientSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                  <button 
                    onClick={() => setEditingRecipient({ id: Math.random().toString(36).substr(2, 9), name: '', address: '', couponNumber: '', status: 'pending' })}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                  >
                    + Tambah
                  </button>
                </div>
              </div>

              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">No. Kupon</th>
                        <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Penerima</th>
                        <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alamat</th>
                        <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredRecipients.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center text-slate-400 italic text-sm">
                            Tidak ditemukan data penerima.
                          </td>
                        </tr>
                      ) : (
                        filteredRecipients.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-5 py-4">
                              <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                                {rec.couponNumber}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm font-bold text-slate-800">{rec.name}</td>
                            <td className="px-5 py-4 text-sm text-slate-500">{rec.address}</td>
                            <td className="px-5 py-4">
                              <button 
                                onClick={() => toggleRecipientStatus(rec.id)}
                                className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-all ${
                                  rec.status === 'received' 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}
                              >
                                {rec.status === 'received' ? 'Diterima' : 'Menunggu'}
                              </button>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button 
                                  onClick={() => setEditingRecipient(rec)}
                                  className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => setConfirmation({ type: 'recipient', id: rec.id, title: rec.name })}
                                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Modals */}
        <AnimatePresence>
          {editingDivision && (
            <EditDivisionModal 
              division={editingDivision} 
              onClose={() => setEditingDivision(null)} 
              onSave={handleUpdateDivision} 
            />
          )}

          {editingMember && (
            <EditMemberModal 
              member={editingMember.member} 
              onClose={() => setEditingMember(null)} 
              onSave={(m) => handleUpdateMember(editingMember.divId, m)} 
            />
          )}

          {editingRecipient && (
            <EditRecipientModal 
              recipient={editingRecipient} 
              onClose={() => setEditingRecipient(null)} 
              onSave={handleUpdateRecipient} 
            />
          )}

          {confirmation && (
            <ConfirmationModal 
              title={
                confirmation.type === 'division' ? 'Hapus Divisi' : 
                confirmation.type === 'member' ? 'Hapus Anggota' : 'Hapus Penerima'
              }
              message={`Apakah Anda yakin ingin menghapus ${confirmation.title}? Tindakan ini tidak dapat dibatalkan.`}
              variant="danger"
              onCancel={() => setConfirmation(null)}
              onConfirm={() => {
                if (confirmation.type === 'division') {
                  handleDeleteDivision(confirmation.id);
                } else if (confirmation.type === 'member' && confirmation.divId) {
                  handleDeleteMember(confirmation.divId, confirmation.id);
                } else if (confirmation.type === 'recipient') {
                  handleDeleteRecipient(confirmation.id);
                }
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-t-3xl rounded-b-none border-t border-slate-100 flex items-center justify-around px-6 py-3 lg:hidden z-50">
        <MobileNavItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={20} />} 
          label="Home" 
        />
        <MobileNavItem 
          active={activeTab === 'tasks'} 
          onClick={() => setActiveTab('tasks')} 
          icon={<ListCheck size={20} />} 
          label="Tugas" 
        />
        <div className="w-14 h-14 -mt-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 border-4 border-white active:scale-95 transition-transform">
          <HeartHandshake size={28} />
        </div>
        <MobileNavItem 
          active={activeTab === 'recipients'} 
          onClick={() => setActiveTab('recipients')} 
          icon={<HeartHandshake size={20} />} 
          label="Penerima" 
        />
        <MobileNavItem 
          active={activeTab === 'structure'} 
          onClick={() => setActiveTab('structure')} 
          icon={<Network size={20} />} 
          label="Struktur" 
        />
      </nav>
    </div>
  );
}

// --- Subcomponents ---

function NavItem({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all
        ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
      `}
    >
      <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
      {label}
    </button>
  );
}

function MobileNavItem({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <span className={active ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>
      <span className={`text-[10px] font-bold ${active ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
    </button>
  );
}

function DivisionDisclosure({ 
  division, 
  onEditDivision, 
  onDeleteDivision,
  onEditMember, 
  onDeleteMember,
  onAddMember
}: DivisionDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-4 text-left">
            <div className={`w-12 h-12 rounded-xl ${division.color} flex items-center justify-center text-white shadow-lg`}>
              {division.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{division.title}</h3>
              <p className="text-xs text-slate-500 font-medium">Koord: {division.head}</p>
            </div>
          </div>
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
            <ChevronRight size={20} className="text-slate-400" />
          </div>
        </button>
        <div className="flex items-center pr-3 gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onEditDivision(); }}
            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
            title="Edit Divisi"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDeleteDivision(); }}
            className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            title="Hapus Divisi"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-slate-50/30"
          >
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 italic text-xs text-slate-600 shadow-sm">
                <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {division.description}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daftar Anggota</h4>
                  <button 
                    onClick={onAddMember}
                    className="text-[10px] bg-emerald-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-1"
                  >
                    + Tambah Anggota
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {division.members.length === 0 ? (
                    <p className="col-span-full py-4 text-center text-xs text-slate-400 font-medium italic border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                      Belum ada anggota dalam divisi ini.
                    </p>
                  ) : (
                    division.members.map((member) => (
                      <div key={member.id} className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-200/50 shadow-sm group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{member.name}</p>
                            <p className="text-[10px] text-emerald-600 font-medium">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all gap-1">
                          <button 
                            onClick={() => onEditMember(member)}
                            className="p-2 text-slate-400 hover:text-emerald-600 transition-all"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => onDeleteMember(member.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-all"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Modals ---

function EditDivisionModal({ division, onClose, onSave }: { division: Division, onClose: () => void, onSave: (div: Division) => void }) {
  const [formData, setFormData] = useState({ ...division });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-display font-bold text-slate-800">Edit Divisi</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Divisi</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Ketua/Koordinator</label>
            <input 
              type="text" 
              value={formData.head} 
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Deskripsi Tugas</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition-all resize-none"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors"
          >
            <Save size={16} /> Simpan
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function EditMemberModal({ member, onClose, onSave }: { member: Member | null, onClose: () => void, onSave: (m: Member) => void }) {
  const [formData, setFormData] = useState<Member>(member || { 
    id: Math.random().toString(36).substr(2, 9), 
    name: '', 
    role: '' 
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-display font-bold text-slate-800">{member ? 'Edit Anggota' : 'Tambah Anggota'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition-all"
              placeholder="Contoh: Budi Santoso"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Peran / Jabatan</label>
            <input 
              type="text" 
              value={formData.role} 
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition-all"
              placeholder="Contoh: Anggota Lapangan"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={() => {
              if (!formData.name || !formData.role) return;
              onSave(formData);
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors"
          >
            <Save size={16} /> {member ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function EditRecipientModal({ recipient, onClose, onSave }: { recipient: Recipient, onClose: () => void, onSave: (r: Recipient) => void }) {
  const [formData, setFormData] = useState({ ...recipient });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-display font-bold text-slate-800">Edit Penerima</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">No. Kupon</label>
              <input 
                type="text" 
                value={formData.couponNumber} 
                onChange={(e) => setFormData({ ...formData, couponNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition-all"
                placeholder="A-001"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition-all"
                placeholder="Nama Penerima"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alamat / RT-RW</label>
            <input 
              type="text" 
              value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition-all"
              placeholder="Contoh: RT 01 / RW 02"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status Distribusi</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setFormData({ ...formData, status: 'pending' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
              >
                Menunggu
              </button>
              <button 
                onClick={() => setFormData({ ...formData, status: 'received' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.status === 'received' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
              >
                Diterima
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={() => {
              if (!formData.name || !formData.couponNumber) return;
              onSave(formData);
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors"
          >
            <Save size={16} /> Simpan
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ConfirmationModal({ title, message, onConfirm, onCancel, variant = 'danger' }: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center"
      >
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
          <Trash2 size={32} />
        </div>
        <h3 className="font-display font-bold text-xl text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed px-2">
          {message}
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-2xl text-white font-bold text-sm transition-colors shadow-lg ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'}`}
          >
            Hapus
          </button>
        </div>
      </motion.div>
    </div>
  );
}
