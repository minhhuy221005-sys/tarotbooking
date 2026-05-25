import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Search, Filter, LogOut, MoonStar, Table, RefreshCcw, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

type Booking = {
  id: number;
  timestamp: string;
  packageName: string;
  fullName: string;
  dob: string;
  contactLink: string;
  preferredTime: string;
  status: string;
  note: string;
};

export function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Check session storage on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('admin_token');
    if (savedToken) {
      setPassword(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch bookings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token') || password;
      const res = await fetch('https://tarotbooking.onrender.com/api/booking/admin/bookings', {
        headers: {
          'x-admin-password': token
        }
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.data);
      } else {
        toast.error(data.error || 'Lỗi khi tải dữ liệu');
        handleLogout();
      }
    } catch (error) {
      toast.error('Không thể kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    try {
      const res = await fetch('https://tarotbooking.onrender.com/api/booking/admin/bookings', {
        headers: {
          'x-admin-password': password
        }
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('admin_token', password);
        setBookings(data.data);
        setIsAuthenticated(true);
        toast.success('Đăng nhập thành công');
      } else {
        toast.error('Mật khẩu không chính xác');
        setPassword('');
      }
    } catch (error) {
      toast.error('Lỗi kết nối');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setPassword('');
    setBookings([]);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactLink?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
        <div className="fixed inset-0 pointer-events-none opacity-5 bg-[url('https://images.unsplash.com/photo-1740375699688-1a9d64e92adf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW4lMjB0YXJvdCUyMGNhcmRzJTIwbGlnaHQlMjB3YXJtfGVufDF8fHx8MTc3ODE0ODg4NXww&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center mix-blend-multiply" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border p-8 rounded-2xl shadow-2xl max-w-md w-full relative z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold">Khu vực admin</h2>
            <p className="text-muted-foreground text-sm mt-2">Nhập mật khẩu bí mật để xem danh sách khách hàng</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mật khẩu..."
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center tracking-widest font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Đang mở khóa...' : 'Mở Khóa'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MoonStar className="text-primary w-5 h-5" />
            <h1 className="font-serif font-semibold text-lg">WonderLand Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex-1 w-full max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo tên, link Facebook..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm outline-none cursor-pointer"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Mới">Mới</option>
                <option value="Cũ">Cũ</option>
                <option value="Đã liên hệ">Đã liên hệ</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Hủy">Hủy</option>
              </select>
            </div>

            <button
              onClick={fetchBookings}
              className="p-2 border border-border bg-card rounded-xl hover:bg-accent transition-colors"
              title="Làm mới dữ liệu"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Mobile Card Layout */}
          <div className="block md:hidden divide-y divide-border">
            {filteredBookings.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                Không tìm thấy dữ liệu phù hợp.
              </div>
            ) : (
              filteredBookings.map((booking, idx) => (
                <div 
                  key={booking.id || idx} 
                  className="p-4 space-y-3 cursor-pointer hover:bg-muted/30 transition-colors active:bg-muted/50"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium text-foreground text-base">{booking.fullName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">SN: {booking.dob}</div>
                    </div>
                    <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      booking.status === 'Mới' ? 'bg-green-100 text-green-700 border-green-200' :
                      booking.status === 'Cũ' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      booking.status === 'Hủy' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs block">Gói Tarot</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20 truncate max-w-full">
                        {booking.packageName}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Thời gian xem</span>
                      <span className="font-medium">{booking.preferredTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">{booking.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Thời gian tạo</th>
                  <th className="px-6 py-4 font-medium">Khách hàng</th>
                  <th className="px-6 py-4 font-medium">Gói Tarot</th>
                  <th className="px-6 py-4 font-medium">Thời gian xem</th>
                  <th className="px-6 py-4 font-medium">Liên hệ</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      Không tìm thấy dữ liệu phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, idx) => (
                    <tr key={booking.id || idx} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground">{booking.timestamp}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{booking.fullName}</div>
                        <div className="text-xs text-muted-foreground">SN: {booking.dob}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          {booking.packageName}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">{booking.preferredTime}</td>
                      <td className="px-6 py-4">
                        <a
                          href={booking.contactLink.startsWith('http') ? booking.contactLink : `https://${booking.contactLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline truncate max-w-[150px] inline-block"
                        >
                          {booking.contactLink}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${booking.status === 'Mới' ? 'bg-green-100 text-green-700 border-green-200' :
                            booking.status === 'Cũ' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                              booking.status === 'Hủy' ? 'bg-red-100 text-red-700 border-red-200' :
                                'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Mobile Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                <h3 className="font-serif font-bold text-lg">Chi tiết lịch hẹn</h3>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm border border-border"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-foreground">{selectedBooking.fullName}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Sinh ngày: {selectedBooking.dob}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    selectedBooking.status === 'Mới' ? 'bg-green-100 text-green-700 border-green-200' :
                    selectedBooking.status === 'Cũ' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    selectedBooking.status === 'Hủy' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Gói dịch vụ</span>
                    <span className="font-medium text-primary">{selectedBooking.packageName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Thời gian xem</span>
                    <span className="font-medium text-foreground">{selectedBooking.preferredTime}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground block mb-2">Liên hệ (Facebook/Zalo)</span>
                  <a 
                    href={(() => {
                      const c = selectedBooking.contactLink;
                      const nums = c.replace(/[\s\.\-\+]/g, '');
                      if (/^\d{9,12}$/.test(nums)) {
                        let f = nums;
                        if (f.startsWith('84')) f = f.slice(2);
                        else if (f.startsWith('0')) f = f.slice(1);
                        return `https://zalo.me/84${f}`;
                      }
                      if (c.startsWith('http')) return c;
                      return `https://${c}`;
                    })()}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full p-3 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl text-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {(() => {
                        const c = selectedBooking.contactLink;
                        const nums = c.replace(/[\s\.\-\+]/g, '');
                        if (/^\d{9,12}$/.test(nums)) {
                          let f = nums;
                          if (f.startsWith('84')) f = f.slice(2);
                          else if (f.startsWith('0')) f = f.slice(1);
                          return `+84 ${f}`;
                        }
                        return c;
                      })()}
                    </span>
                  </a>
                </div>

                {selectedBooking.note && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-2">Ghi chú</span>
                    <p className="p-4 bg-muted/30 rounded-xl text-sm leading-relaxed border border-border/50">
                      {selectedBooking.note}
                    </p>
                  </div>
                )}

                <div className="text-center pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">Thời gian tạo: {selectedBooking.timestamp}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
