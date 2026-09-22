export const menuCategories = [
  {
    id: "starters",
    name: "Starters",
  },
  {
    id: "mains",
    name: "Main Course",
  },
  {
    id: "biriyani",
    name: "Biriyani",
  },
  {
    id: "desserts",
    name: "Desserts",
  },
  {
    id: "beverages",
    name: "Beverages",
  },
];

export const menuItems = [
  {
    id: 1,
    name: "Crispy Chicken",
    category: "starters",
    description: "Crispy fried chicken with our signature sauce.",
    price: 320,
    image: "/images/dishes/dish-1.jpg",
    isVeg: false,
    isPopular: true,
  },

  {
    id: 2,
    name: "Paneer Tikka",
    category: "starters",
    description: "Char-grilled paneer with aromatic spices.",
    price: 280,
    image: "/images/dishes/dish-2.jpg",
    isVeg: true,
    isPopular: false,
  },

  {
    id: 3,
    name: "Grand Azure Biriyani",
    category: "biriyani",
    description: "Fragrant basmati rice with tender chicken.",
    price: 350,
    image: "/images/dishes/dish-3.jpg",
    isVeg: false,
    isPopular: true,
  },

  {
    id: 4,
    name: "Chocolate Lava Cake",
    category: "desserts",
    description: "Warm chocolate cake with a molten center.",
    price: 220,
    image: "/images/dishes/dish-4.jpg",
    isVeg: true,
    isPopular: true,
  },
];