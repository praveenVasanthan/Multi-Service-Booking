export type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
};

export type Booking = {
  _id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  date: string;
  time: string;
  quantity: string;
  price: number;
};
