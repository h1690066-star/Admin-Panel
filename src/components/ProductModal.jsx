import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Check, Cpu, HardDrive, Smartphone, Monitor, Globe, Palette, Sliders } from 'lucide-react';
import { createProduct, updateProduct, getImageUrl } from '../api/api';

export default function ProductModal({ isOpen, onClose, onRefresh, editingProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Phones',
    brand: 'Apple',
    price: '',
    oldPrice: '',
    discount: '',
    stock: '',
    description: '',
    imageUrl: '',
    // Technical specs requested by user
    ram: '8 GB',
    screenSize: '6.3 dyuym',
    screenDetails: 'Super Retina XDR OLED, 120Hz ProMotion',
    processor: 'Apple A19 Pro (3nm)',
    simType: 'Dual SIM (nano-SIM + eSIM)',
    region: 'LL/A (USA)'
  });

  const [selectedStorage, setSelectedStorage] = useState(['128GB', '256GB']);
  const [selectedColors, setSelectedColors] = useState(['Qora', 'Oq', 'Tabiiy Titan']);
  const [customColorInput, setCustomColorInput] = useState('');

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Available options helpers
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
  const presetColors = ['Qora', 'Oq', 'Tabiiy Titan', 'Ko\'k', 'Yashil', 'Oltin', 'Pushti', 'Kulrang', 'Sariq'];
  const ramOptions = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB', '18 GB', '24 GB', '32 GB'];
  const simOptions = [
    'Dual SIM (nano-SIM + eSIM)',
    '2x Physical SIM (Dual nano-SIM)',
    'eSIM + eSIM',
    'Single SIM (nano-SIM)'
  ];
  const regionOptions = [
    'LL/A (USA - faqat eSIM)',
    'KH/A (China/HK - 2x Fizik SIM)',
    'ZA/A (Dubai / Yaqin Sharq)',
    'EU (Yevropa region)',
    'RU/A (Evrosiyo)'
  ];

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || 'Phones',
        brand: editingProduct.brand || 'Apple',
        price: editingProduct.price || '',
        oldPrice: editingProduct.oldPrice || '',
        discount: editingProduct.discount || '',
        stock: editingProduct.stock || '',
        description: editingProduct.description || '',
        imageUrl: '',
        ram: editingProduct.ram || '8 GB',
        screenSize: editingProduct.screenSize || '6.3 dyuym',
        screenDetails: editingProduct.screenDetails || 'Super Retina XDR OLED, 120Hz ProMotion',
        processor: editingProduct.processor || 'Apple A19 Pro (3nm)',
        simType: editingProduct.simType || 'Dual SIM (nano-SIM + eSIM)',
        region: editingProduct.region || 'LL/A (USA)'
      });
      
      const imgs = Array.isArray(editingProduct.images)
        ? editingProduct.images
        : (editingProduct.images ? [editingProduct.images] : []);
      setExistingImages(imgs);

      if (Array.isArray(editingProduct.storage) && editingProduct.storage.length > 0) {
        setSelectedStorage(editingProduct.storage);
      }
      if (Array.isArray(editingProduct.colors) && editingProduct.colors.length > 0) {
        setSelectedColors(editingProduct.colors);
      }
    } else {
      setFormData({
        name: '',
        category: 'Phones',
        brand: 'Apple',
        price: '',
        oldPrice: '',
        discount: '',
        stock: '',
        description: '',
        imageUrl: '',
        ram: '8 GB',
        screenSize: '6.3 dyuym',
        screenDetails: 'Super Retina XDR OLED, 120Hz ProMotion',
        processor: 'Apple A19 Pro (3nm)',
        simType: 'Dual SIM (nano-SIM + eSIM)',
        region: 'LL/A (USA)'
      });
      setExistingImages([]);
      setSelectedStorage(['128GB', '256GB']);
      setSelectedColors(['Qora', 'Oq', 'Tabiiy Titan']);
    }
    setImageFiles([]);
    setError(null);
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto compute discount % if price and oldPrice exist
      if ((name === 'price' || name === 'oldPrice') && updated.price && updated.oldPrice) {
        const p = parseFloat(updated.price);
        const op = parseFloat(updated.oldPrice);
        if (op > p) {
          const calcDiscount = Math.round(((op - p) / op) * 100);
          updated.discount = calcDiscount;
        }
      }
      return updated;
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit per image
      const oversizedFiles = newFiles.filter(f => f.size > MAX_SIZE);

      if (oversizedFiles.length > 0) {
        setError(`Fayl hajmi 10MB dan oshmasligi kerak! (Ba'zi rasmlar rad etildi)`);
        return;
      }

      setError(null);
      setImageFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeImageFile = (indexToRemove) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const toggleStorageOption = (item) => {
    setSelectedStorage(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleColorOption = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const addCustomColor = () => {
    if (customColorInput.trim() && !selectedColors.includes(customColorInput.trim())) {
      setSelectedColors(prev => [...prev, customColorInput.trim()]);
      setCustomColorInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('brand', formData.brand);
      data.append('price', formData.price);
      if (formData.oldPrice) data.append('oldPrice', formData.oldPrice);
      if (formData.discount) data.append('discount', formData.discount);
      data.append('stock', formData.stock || 0);

      // Append selected storage array & colors array
      data.append('storage', JSON.stringify(selectedStorage));
      data.append('colors', JSON.stringify(selectedColors));

      // Build technical specifications summary
      const specSummary = [
        `Operativ xotira (RAM): ${formData.ram}`,
        `Doimiy xotira (ROM): ${selectedStorage.join(', ')}`,
        `Ekran dyuymi: ${formData.screenSize}`,
        `Ekran turi: ${formData.screenDetails}`,
        `Protsessor: ${formData.processor}`,
        `SIM-karta turi: ${formData.simType}`,
        `Region: ${formData.region}`,
        `Mavjud ranglar: ${selectedColors.join(', ')}`
      ].join('\n');

      const descText = formData.description
        ? `${formData.description}\n\n${specSummary}`
        : specSummary;

      data.append('description', descText);
      data.append('longDescription', specSummary);

      // Append image files
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          data.append('images', file);
        });
      }

      // Append existing images
      existingImages.forEach(img => {
        data.append('images', img);
      });

      if (formData.imageUrl) {
        data.append('images', formData.imageUrl);
      }

      if (editingProduct?._id) {
        await updateProduct(editingProduct._id, data);
      } else {
        await createProduct(data);
      }

      onRefresh();
      onClose();
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col justify-between">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
            </h2>
            <p className="text-xs text-slate-400">
              Katalogga yangi qurilma parametrlari va texnik xususiyatlarini kiritish
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form id="productForm" onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium border border-rose-200">
              {error}
            </div>
          )}

          {/* 1. RASM YUKLASH (Nechta rasm bo'lsa ham) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span>1. Rasm yuklash (Cheklovsiz, max 10MB har bir rasm)</span>
              </label>
            </div>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-white hover:bg-slate-50 transition-all cursor-pointer relative group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 shadow-xs mx-auto mb-2 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800 mb-1">
                Rasmlarni sudrab tashlang yoki bosing (Nechta rasm bo'lsa ham)
              </div>
              <div className="text-[10px] text-slate-400">
                JPG, PNG, WEBP — Har bir rasm hajm chegarasi: 10MB
              </div>
            </div>

            {/* Selected Images Preview Grid */}
            {(imageFiles.length > 0 || existingImages.length > 0) && (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold text-slate-700">
                  Tanlangan rasmlar ({imageFiles.length + existingImages.length} ta):
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative group w-full aspect-square rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                      <img
                        src={getImageUrl(url)}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 shadow-xs cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {imageFiles.map((file, idx) => (
                    <div key={`file-${idx}`} className="relative group w-full aspect-square rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageFile(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 shadow-xs cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. ASOSIY MA'LUMOTLAR */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span>Asosiy Ma'lumotlar</span>
            </h3>

            {/* Nomi */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">
                Nomi
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="iPhone 16 Pro Max 256GB"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-semibold"
              />
            </div>

            {/* Kategoriya & Brend */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Kategoriya
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-semibold cursor-pointer"
                >
                  <option value="Phones">Phones / Telefonlar</option>
                  <option value="Used Phones">Used Phones (B/U Telefonlar)</option>
                  <option value="Elektronika">Elektronika</option>
                  <option value="Aksessuarlar">Aksessuarlar</option>
                  <option value="Home appliances">Home appliances</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Brend
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-semibold cursor-pointer"
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="Honor">Honor</option>
                  <option value="Boshqa">Boshqa</option>
                </select>
              </div>
            </div>

            {/* Narx, Eski narx, Chegirma, Ombor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Narx (so'm)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="16000000"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Eski narx (so'm)
                </label>
                <input
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleInputChange}
                  placeholder="17500000"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Chegirma %
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="8"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Ombordagi soni
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="10"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-semibold"
                />
              </div>
            </div>
          </div>

          {/* 3. BATAFSIL TEXNIK PARAMETRLARI (RAM, Hotira, Ekran, Protsessor, SIM, Region, Ranglar) */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-slate-500" />
              <span>Batafsil Texnik Parametrlari</span>
            </h3>

            {/* RAM (Operativ xotira) & Region */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <span>Operativ xotira (RAM)</span>
                </label>
                <select
                  name="ram"
                  value={formData.ram}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-semibold cursor-pointer"
                >
                  {ramOptions.map(ram => (
                    <option key={ram} value={ram}>{ram}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Region (Mamlakat modeli)</span>
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-semibold cursor-pointer"
                >
                  {regionOptions.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doimiy Xotira (ROM / Storage Variantlari) */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                <span>Doimiy xotira variantlari (ROM)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {storageOptions.map(opt => {
                  const isSelected = selectedStorage.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleStorageOption(opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? `✓ ${opt}` : opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ekran dyuymi & Ekran haqida */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ekran dyuymi</span>
                </label>
                <input
                  type="text"
                  name="screenSize"
                  value={formData.screenSize}
                  onChange={handleInputChange}
                  placeholder="6.3 dyuym"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Ekran turi (Details)
                </label>
                <input
                  type="text"
                  name="screenDetails"
                  value={formData.screenDetails}
                  onChange={handleInputChange}
                  placeholder="Super Retina XDR OLED, 120Hz"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                />
              </div>
            </div>

            {/* Protsessor & SIM-karta turi */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <span>Protsessor</span>
                </label>
                <input
                  type="text"
                  name="processor"
                  value={formData.processor}
                  onChange={handleInputChange}
                  placeholder="Apple A19 Pro (3nm)"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                  <span>SIM-karta turi</span>
                </label>
                <select
                  name="simType"
                  value={formData.simType}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-semibold cursor-pointer"
                >
                  {simOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Necha xil rang borligi (Ranglar tanlovi) */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                <span>Mavjud ranglar (Necha xil rang borligi)</span>
              </label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {presetColors.map(color => {
                  const isSelected = selectedColors.includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColorOption(color)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? `● ${color}` : color}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Color Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customColorInput}
                  onChange={(e) => setCustomColorInput(e.target.value)}
                  placeholder="Yangi rang nomi (masalan: Chuh Titan)..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                />
                <button
                  type="button"
                  onClick={addCustomColor}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
                >
                  + Qo'shish
                </button>
              </div>
            </div>

          </div>

          {/* 4. TAVSIF / QO'SHIMCHA IZOH */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              Qo'shimcha izoh / Tavsif
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              placeholder="Qurilma haqida qo'shimcha ma'lumotlar..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-black font-medium"
            />
          </div>

        </form>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            form="productForm"
            disabled={loading}
            className="px-6 py-2.5 bg-black hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-75 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Saqlash</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
