export type Package = {
  id: string;
  name: string;
  price: string | null;
  description: string;
};

export type Category = {
  id: string;
  name: string;
  packages: Package[];
  icon: string;
};

export const categories: Category[] = [
  {
    id: "tarot",
    name: "Tarot & bài trà",
    icon: "Sparkles",
    packages: [
      {
        id: "t1",
        name: "Cơ bản - Yes/No (1 lá)",
        price: null,
        description: "Kèm lời khuyên",
      },
      {
        id: "t2",
        name: "Câu hỏi lẻ - 1 câu hỏi",
        price: null,
        description: "Kèm lời khuyên chi tiết",
      },
      {
        id: "t3",
        name: "Câu hỏi lẻ - 2 câu hỏi",
        price: null,
        description: "Kèm lời khuyên chi tiết",
      },
      {
        id: "t4",
        name: "Câu hỏi lẻ - 4 câu hỏi",
        price: null,
        description: "Kèm lời khuyên chi tiết",
      },
      {
        id: "t5",
        name: "Theo thời gian - 30 phút / 1 vấn đề",
        price: null,
        description: "Tư vấn chuyên sâu",
      },
      {
        id: "t6",
        name: "Theo thời gian - 60 phút / 1 vấn đề",
        price: null,
        description: "Tư vấn chuyên sâu",
      },
      {
        id: "t7",
        name: "Theo thời gian - 60 phút / 2 vấn đề",
        price: null,
        description: "Tư vấn chuyên sâu",
      },
      {
        id: "t8",
        name: "Vận hạn/Dự báo - 1 tháng / 3 tháng",
        price: null,
        description: "Dự báo tương lai gần",
      },
      {
        id: "t9",
        name: "Vận hạn/Dự báo - 6 tháng / 1 năm",
        price: null,
        description: "Dự báo tương lai dài hạn",
      },
    ],
  },
  {
    id: "baitay",
    name: "Bài tây & Dịch vụ đặc biệt",
    icon: "MoonStar",
    packages: [
      {
        id: "bt1",
        name: "Bài Tây - 1 câu hỏi lẻ",
        price: "20.000đ",
        description: "Giải đáp nhanh",
      },
      {
        id: "bt2",
        name: "Bài Tây - 5 câu hỏi",
        price: "90.000đ",
        description: "Tiết kiệm hơn",
      },
      {
        id: "bt3",
        name: "Bài Tây - 30 phút (không giới hạn)",
        price: "120.000đ",
        description: "Hỏi đáp thoải mái",
      },
      {
        id: "bt4",
        name: "Bài Tây - 60 phút (không giới hạn)",
        price: "220.000đ",
        description: "Hỏi đáp thoải mái",
      },
      {
        id: "bt5",
        name: "Bài Tây - Xem chuyên sâu 1 vấn đề",
        price: "150.000đ",
        description: "Phân tích sâu sắc",
      },
      {
        id: "vh1",
        name: "Vận hạn - Theo tháng",
        price: "60.000đ",
        description: "Tổng quan tháng",
      },
      {
        id: "vh2",
        name: "Vận hạn - Sức khỏe",
        price: "60.000đ",
        description: "Tập trung sức khỏe",
      },
      {
        id: "tl1",
        name: "Tâm linh - Xem âm",
        price: "100.000đ / câu",
        description: "Kết nối tâm linh",
      },
    ],
  },
  {
    id: "astrology",
    name: "Bản đồ sao",
    icon: "Compass",
    packages: [
      {
        id: "bs1",
        name: "Phân tích lẻ - Tổng quan bản đồ sao",
        price: null,
        description: "Bức tranh toàn cảnh",
      },
      {
        id: "bs2",
        name: "Phân tích lẻ - Con người & Tính cách",
        price: null,
        description: "Khám phá bản thân",
      },
      {
        id: "bs3",
        name: "Phân tích lẻ - Sự nghiệp / Sức khỏe",
        price: null,
        description: "Định hướng công việc",
      },
      {
        id: "bs4",
        name: "Phân tích lẻ - Tài chính / Tình duyên",
        price: null,
        description: "Gỡ rối tình cảm, tiền bạc",
      },
      {
        id: "bs5",
        name: "Gói chi tiết - Tổng quát chi tiết bản đồ sao",
        price: "60.000đ",
        description: "Giải mã chuyên sâu nhất",
      },
    ],
  },
];