export type Service = {
  workingHours: {
    days: never[];
  };
  _id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
};

export type Cart = {
  _id: string;
  quantity: number;
  service: Service;
};
