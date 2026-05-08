import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MoonStar, Compass, ArrowRight, CheckCircle2, ChevronLeft, Calendar, User, MessageCircle, Clock } from 'lucide-react';
import { categories, Package } from '../data/services';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type FormData = {
  fullName: string;
  dob: string;
  contact: string;
  preferredTime: string;
};

export function BookingFlow() {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("tarot");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedPackage) return;

    const loadingToast = toast.loading("Đang gửi yêu cầu...");

    try {
      const response = await fetch("https://tarotbooking.onrender.com/api/booking/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageName: selectedPackage.name,
          fullName: data.fullName,
          dob: data.dob,
          contactLink: data.contact,
          preferredTime: data.preferredTime,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        setStep(3);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4a373', '#faedcd', '#ffffff']
        });
        toast.success(result.message || "Đặt lịch thành công!");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.error || "Đã có lỗi xảy ra.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Booking Error:", error);
      toast.error("Không thể kết nối đến máy chủ.");
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'MoonStar': return <MoonStar className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 relative">
      {/* Background decoration */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5 bg-[url('https://images.unsplash.com/photo-1740375699688-1a9d64e92adf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW4lMjB0YXJvdCUyMGNhcmRzJTIwbGlnaHQlMjB3YXJtfGVufDF8fHx8MTc3ODE0ODg4NXww&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center mix-blend-multiply" 
      />
      
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif font-semibold text-lg tracking-wide text-primary">WonderLand</span>
          </div>
          {step > 1 && step < 3 && (
            <button 
              onClick={() => setStep(1)}
              className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: Select Package */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12 relative z-10"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
                <span className="text-primary font-medium tracking-wider uppercase text-sm flex items-center justify-center gap-2">
                  <MoonStar className="w-4 h-4" />
                  Chào mừng bạn đến với
                  <MoonStar className="w-4 h-4" />
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                  góc nhỏ của <br/> sự chữa lành
                </h1>
                <p className="text-muted-foreground text-lg px-4">
                  Lựa chọn dịch vụ phù hợp để chúng ta có thể kết nối và chia sẻ cùng nhau.
                </p>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {getIcon(cat.icon)}
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Packages Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {categories.find(c => c.id === selectedCategory)?.packages.map((pkg, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    className="group relative bg-card border border-border p-6 rounded-2xl cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      {getIcon(categories.find(c => c.id === selectedCategory)?.icon || 'Sparkles')}
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors pr-8">
                          {pkg.name}
                        </h3>
                        {pkg.description && (
                          <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-end justify-between pt-4 border-t border-border">
                        <div>
                          {pkg.price ? (
                            <span className="font-medium text-primary">{pkg.price}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Giá tùy chọn / Liên hệ</span>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Booking Form */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto grid md:grid-cols-5 gap-8 relative z-10"
            >
              <div className="md:col-span-2 hidden md:block rounded-2xl overflow-hidden relative min-h-[400px]">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1507980062492-714282f31ee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjBsZWF2ZXMlMjBjdXAlMjB3YXJtJTIwbGlnaHR8ZW58MXx8fHwxNzc4MTQ4ODg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Tea cup aesthetic"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              </div>

              <div className="md:col-span-3 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold">Thông tin đặt lịch</h2>
                  <p className="text-muted-foreground">Hãy để lại thông tin để chúng ta có thể kết nối</p>
                </div>

                {selectedPackage && (
                  <div className="bg-secondary/50 border border-primary/20 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Gói đã chọn:</p>
                      <p className="font-semibold text-foreground">{selectedPackage.name}</p>
                    </div>
                    {selectedPackage.price && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Phí dịch vụ:</p>
                        <p className="font-medium text-primary">{selectedPackage.price}</p>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <User className="w-4 h-4 text-primary" />
                      Họ và tên
                    </label>
                    <input
                      {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                      disabled={isSubmitting}
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Nhập tên của bạn"
                    />
                    {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Ngày tháng năm sinh
                    </label>
                    <input
                      {...register("dob", { required: "Vui lòng nhập ngày sinh" })}
                      type="date"
                      disabled={isSubmitting}
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    {errors.dob && <p className="text-destructive text-sm mt-1">{errors.dob.message}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      Link Facebook / Zalo
                    </label>
                    <input
                      {...register("contact", { required: "Vui lòng nhập phương thức liên lạc" })}
                      disabled={isSubmitting}
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Để lại link Facebook hoặc số Zalo"
                    />
                    {errors.contact && <p className="text-destructive text-sm mt-1">{errors.contact.message}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Thời gian muốn xem
                    </label>
                    <input
                      {...register("preferredTime", { required: "Vui lòng chọn thời gian" })}
                      type="datetime-local"
                      disabled={isSubmitting}
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    {errors.preferredTime && <p className="text-destructive text-sm mt-1">{errors.preferredTime.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
                  }`}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Xác nhận đặt lịch'}
                  <Sparkles className="w-4 h-4" />
                </button>
              </form>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center space-y-6 py-12"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-foreground">Gửi thành công!</h2>
                <p className="text-muted-foreground">
                  Cảm ơn bạn đã tin tưởng. Mình sẽ liên hệ lại với bạn trong thời gian sớm nhất qua Facebook/Zalo nhé.
                </p>
              </div>
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedPackage(null);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-accent transition-colors"
              >
                Về trang chủ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}