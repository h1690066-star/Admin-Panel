import React from 'react';
import { X, Mail, Phone, Calendar, ShoppingBag, MapPin, CheckCircle2, Clock, AlertCircle, User } from 'lucide-react';

export default function CustomerDrawer({ customer, isOpen, onClose }) {
  if (!isOpen || !customer) return null;

  const name = customer.name || customer.username || 'Mijoz';
  const email = customer.email || 'Email mavjud emas';
  const phone = customer.phone || '+998901234567';
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'JA';

  const regDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('uz-UZ')
    : '01.09.2026';

  const formatMoney = (val) => new Intl.NumberFormat('uz-UZ').format(val) + " so'm";

  // Mock order history for customer detail matching screenshot 5
  const mockOrderHistory = [
    { id: '1', orderNum: 'XB-M8921', status: 'Yetkazilgan', statusType: 'success', date: '07.10.2026', itemsCount: 2, total: 21000000 },
    { id: '2', orderNum: 'XB-M7410', status: 'Jarayonda', statusType: 'warning', date: '18.09.2026', itemsCount: 1, total: 4200000 },
    { id: '3', orderNum: 'XB-M8102', status: 'Yangi', statusType: 'info', date: '02.09.2026', itemsCount: 1, total: 1200000 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">Mijoz ma'lumotlari</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Profile Card Header */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="w-14 h-14 bg-black text-white font-black text-lg rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">{name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  ● Faol / VIP
                </span>
              </div>

              <div className="text-xs text-slate-500 space-y-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ro'yxatdan o'tgan: {regDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Stat Boxes (Buyurtmalar, Jami xarid, O'rtacha chek) */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[10px] font-semibold text-slate-400">Buyurtmalar</div>
              <div className="text-base font-black text-slate-900">3 ta</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[10px] font-semibold text-slate-400">Jami xarid</div>
              <div className="text-sm font-black text-slate-900">26.4M so'm</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[10px] font-semibold text-slate-400">O'rtacha chek</div>
              <div className="text-sm font-black text-slate-900">8.8M so'm</div>
            </div>
          </div>

          {/* Buyurtmalar tarixi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Buyurtmalar tarixi</span>
              <span className="text-slate-400 text-[11px] font-semibold">3 ta buyurtma</span>
            </div>

            <div className="space-y-2.5">
              {mockOrderHistory.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{item.orderNum}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.statusType === 'success'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.statusType === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      ● {item.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{item.date} • {item.itemsCount} ta mahsulot</span>
                    <span className="font-bold text-slate-900">{formatMoney(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manzillar Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Asosiy manzil (Uy)</span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed font-medium">
              Toshkent sh., Chilonzor tumani, 9-mavze, 14-uy, 22-xonadon
            </div>
            <div className="text-[11px] text-slate-400">
              Mo'ljal: 173-maktab yonida | Telefon: {phone}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-slate-100 bg-white flex justify-end sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-black hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
}

function UserIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

