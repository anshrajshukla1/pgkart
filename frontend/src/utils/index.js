import { LuBoxes, LuHouse, LuLayoutGrid, LuShoppingCart, LuStore } from "react-icons/lu";
import { bannerImageOne, bannerImageThree, bannerImageTwo } from "./constant";

export const bannerLists = [
  {
    id: 1,
    image: "/hero_graphic.png",
    title: "Room Essentials",
    subtitle: "Room Gear",
    description: "Upgrade your space with cozy and stylish essentials",
  },
  {
    id: 2,
    image: "/hero_graphic_2.png",
    title: "Study Hub",
    subtitle: "Stationery",
    description: "Everything you need for your late-night study sessions",
  },
  {
    id: 3,
    image: "/hero_graphic_3.png",
    title: "Snack Time",
    subtitle: "Munchies",
    description: "Keep your cravings at bay with our snack collection",
  },
  {
    id: 4,
    image: "/hero_graphic_4.png",
    title: "Laundry Day",
    subtitle: "Cleaning",
    description: "Tackle your laundry pile with our top picks",
  },
  {
    id: 5,
    image: "/hero_graphic_5.png",
    title: "Personal Care",
    subtitle: "Grooming",
    description: "Stay fresh and clean with our grooming kits",
  },
  {
    id: 6,
    image: "/hero_graphic_6.png",
    title: "Electronics",
    subtitle: "Gadgets",
    description: "Must-have gadgets for every room",
  }
]

export const adminNavigation = [
  {
    name: "Dashboard", 
    href: "/admin", 
    icon: LuHouse, 
    current: true 
  }, {
    name: "Orders", 
    href: "/admin/orders", 
    icon: LuShoppingCart
  }, {
    name: "Products", 
    href: "/admin/products", 
    icon: LuBoxes
  }, {
    name: "Categories", 
    href: "/admin/categories", 
    icon: LuLayoutGrid
  }, {
    name: "Sellers", 
    href: "/admin/sellers", 
    icon: LuStore
  }
];

export const sellerNavigation = [
  {
    name: "Orders", 
    href: "/admin/orders", 
    icon: LuShoppingCart,
    current: true 
  }, {
    name: "Products", 
    href: "/admin/products", 
    icon: LuBoxes
  }
];



