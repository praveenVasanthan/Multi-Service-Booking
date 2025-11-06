const apiUrls = {
  login: "access/login",
  register: "access/register",
  service: {
    list: "web/services",
  },
  cart: {
    list: "web/carts",
    add: "web/carts",
    edit: (id: string) => `web/carts/${id}`,
    delete: (id: string) => `web/carts/${id}`,
  },
  booking: {
    add: "web/booking",
  },
  availability: {
    list: "web/booking/slots",
  },
};

export default apiUrls;
