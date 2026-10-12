import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Eye, ChevronLeft, ChevronRight, UserX } from 'lucide-react';
import { getUsers } from '../api/api';
import CustomerDrawer from './CustomerDrawer';

export default function Customers() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await getUsers();
        const items = data.items || data;
        setUsersList(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const formatMoney = (val) => new Intl.NumberFormat('uz-UZ').format(val || 0) + " so'm";

  // Filtered customer items
  const filteredUsers = usersList.filter(u => {
    if (!search) return true;
    const s = search.toLowerCase();
    const name = (u.name || u.username || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const phone = (u.phone || '').toLowerCase();
    return name.includes(s) || email.includes(s) || phone.includes(s);
  });

  const handleOpenCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Mijozlar</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Jami: {usersList.length} ta mijoz
        </p>
      </div>

      {/* Top 2 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Stat 1: Jami mijozlar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              JAMI MIJOZLAR
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">
              {usersList.length} <span className="text-sm font-semibold text-slate-500">ta</span>
            </div>
            <div className="text-xs font-semibold text-emerald-600">
              +14% o'tgan oydan
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2: Bu oy yangi mijozlar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              BU OY YANGI MIJOZLAR
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">
              24 <span className="text-sm font-semibold text-slate-500">ta</span>
            </div>
            <div className="text-xs font-semibold text-emerald-600">
              +8% o'sish
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Search Input Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism, email yoki telefon bo'yicha qidirish..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white font-medium"
          />
        </div>
      </div>

      {/* Customer Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold">Mijozlar yuklanmoqda...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <UserX className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-800">Mijoz topilmadi</div>
            <div className="text-xs max-w-xs mx-auto text-slate-400 font-medium">
              Qidiruv yoki filtr mezonlariga mos keladigan mijozlar mavjud emas.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">MIJOZ</th>
                  <th className="py-4 px-6">EMAIL</th>
                  <th className="py-4 px-6">TELEFON</th>
                  <th className="py-4 px-6">BUYURTMALAR</th>
                  <th className="py-4 px-6">JAMI XARID</th>
                  <th className="py-4 px-6">SO'NGGI FAOLLIK</th>
                  <th className="py-4 px-6 text-right">AMALLAR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((item, index) => {
                  const name = item.name || item.username || 'Ali Valiyev';
                  const initials = name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2) || 'AV';

                  // Generate realistic mock sales for display
                  const ordersCount = (index % 4) + 1;
                  const totalSpent = (index + 1) * 3200000;
                  const dateStr = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('uz-UZ')
                    : '05.10.2026';

                  return (
                    <tr
                      key={item.id || item._id || index}
                      onClick={() => handleOpenCustomer(item)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      {/* MIJOZ */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black text-white font-bold text-xs rounded-full flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{name}</div>
                            <div className="text-[10px] font-semibold text-emerald-600">Faol mijoz</div>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {item.email || 'ali@example.com'}
                      </td>

                      {/* TELEFON */}
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {item.phone || '+998 90 123 45 67'}
                      </td>

                      {/* BUYURTMALAR */}
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {ordersCount} ta
                      </td>

                      {/* JAMI XARID */}
                      <td className="py-4 px-6 font-black text-slate-900">
                        {formatMoney(totalSpent)}
                      </td>

                      {/* SO'NGGI FAOLLIK */}
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        {dateStr}
                      </td>

                      {/* AMALLAR */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenCustomer(item);
                          }}
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                          title="Mijoz ma'lumotlarini ko'rish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-semibold text-slate-500">
          <div>
            Ko'rsatilyapti: <span className="text-slate-900 font-bold">1-{filteredUsers.length}</span> dan <span className="text-slate-900 font-bold">{usersList.length}</span> ta mijoz
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl disabled:opacity-50 flex items-center gap-1 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
              <span>Oldingi</span>
            </button>
            <span className="px-3 py-1.5 bg-black text-white rounded-xl font-bold">1</span>
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl disabled:opacity-50 flex items-center gap-1 cursor-pointer">
              <span>Keyingi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Customer Drawer Modal */}
      <CustomerDrawer
        customer={selectedCustomer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

    </div>
  );
}

