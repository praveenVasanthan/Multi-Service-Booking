const apiUrls = {
  service: {
    list: "web/services",
    add: "web/services",
    detail: (id: string) => `web/services/${id}`,
    edit: (id: string) => `web/services/${id}`,
    delete: (id: string) => `web/services/${id}`,
  },
  bookings: {
    list: "web/bookings",
    detail: (id: string) => `web/booking/${id}`,
  },
};

export default apiUrls;
