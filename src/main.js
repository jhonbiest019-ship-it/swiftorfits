/**
 * SwiftOrbits USA Marketplace & Merchant ERP Integration Engine
 * Designed and Developed by DX Farani
 */
import { io } from 'socket.io-client';

const API_BASE = '/api';
const SOCKET_URL = window.location.origin;

const ALLOWED_CATEGORIES = ['appliances', 'beauty', 'electronics', 'health_household', 'pet_supplies', 'toys_games_baby'];

const CATEGORY_METADATA = {
  beauty: {
    title: 'Beauty & Personal Care',
    dealTitle: 'Beauty & Personal Care Deals',
    badge: 'VERIFIED BEAUTY',
    desc: 'Premium fragrances, dermatologist-approved skincare serums, and high-tech hair styling tools.',
    brands: ['CeraVe', 'Tom Ford', 'Dyson', 'La Mer', 'Estée Lauder', 'Olaplex']
  },
  electronics: {
    title: 'Electronics',
    dealTitle: 'Electronics Deals',
    badge: 'OFFICIAL STORE',
    desc: 'Explore flagship smartphones, noise-canceling headphones, 4K TVs, and smart gear with Free 2-Day Prime US Shipping.',
    brands: ['Apple', 'Bose', 'Sony', 'Anker', 'Corsair', 'JBL', 'UGREEN', 'Satechi', 'Samsung', 'Meta', 'Garmin', 'Rode', 'Elgato']
  },
  appliances: {
    title: 'Kitchen & Appliances',
    dealTitle: 'Kitchen & Appliances Deals',
    badge: 'HOME APPLIANCES',
    desc: 'Commercial-grade blenders, espresso machines, air fryers, and smart appliances backed by official US warranty.',
    brands: ['Ninja', 'Samsung', 'Breville', 'Instant Pot', 'Vitamix', 'KitchenAid', 'Dyson', 'iRobot Roomba']
  },
  health_household: {
    title: 'Health & Househeld',
    dealTitle: 'Health & Househeld Deals',
    badge: 'HEALTH & ESSENTIALS',
    desc: 'Vitamins, supplements, home essentials, wellness products, and daily household supplies.',
    brands: ['Nutricost', 'Levoit', 'Stanley', 'Nature Made', 'Clorox', 'Bounty', 'Lysol']
  },
  pet_supplies: {
    title: 'Pet Supplies',
    dealTitle: 'Pet Supplies Deals',
    badge: 'PET ESSENTIALS',
    desc: 'Premium nutrition, interactive toys, grooming kits, beds, and health essentials for pets.',
    brands: ['Purina', 'Blue Buffalo', 'KONG', 'Furminator', 'Frontline', 'Hill\'s Science Diet']
  },
  toys_games_baby: {
    title: 'Toys,games,Baby',
    dealTitle: 'Toys, Games & Baby Deals',
    badge: 'FAMILY & PLAY',
    desc: 'Building sets, educational games, family entertainment, nursery gear, and baby essentials.',
    brands: ['LEGO', 'Hasbro', 'Mattel', 'Fisher-Price', 'Pampers', 'Huggies']
  }
};

const PREMIER_TOP_BRANDS = [
  'Anker',
  'CeraVe',
  'Dash',
  'Hamilton Beach',
  'Nutricost',
  'Purina',
  'KONG',
  'LEGO',
  'Hasbro',
  'Mattel'
];

const SWIFT_SEED_PRODUCTS = [
  {
    "id": 1,
    "sku": "SO-ELEC-01",
    "title": "Anker 313 Fast Charger 45W USB-C Wall Adapter",
    "category": "electronics",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 60,
    "is_flash_sale": true,
    "sold_percent": 75,
    "rating": 4.8,
    "reviews_count": 850,
    "attributes": {
      "Tech": "GaN II",
      "Brand": "Anker",
      "Output": "45W USB-C"
    },
    "image": "/uploads/Anker_313_Fast_Charger_45W_USB-C_Wall_Adapter-1790858942535-499748.jpg"
  },
  {
    "id": 2,
    "sku": "SO-ELEC-02",
    "title": "Anker Powerline III Flow Silicone C to Ip Cable 1.2ft",
    "category": "electronics",
    "regular_price": 18.99,
    "sale_price": 14.99,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 1200,
    "attributes": {
      "Brand": "Anker",
      "Length": "6 Feet",
      "Material": "Silicone"
    },
    "image": "/uploads/Anker_Powerline_III_Flow_Silicone_C_to_Ip_Cable_1_2ft-1790859241640-977595.jpg"
  },
  {
    "id": 3,
    "sku": "SO-ELEC-03",
    "title": "Anker 332 USB-C Hub 5-in-1 with 4K HDMI & 100W PD",
    "category": "electronics",
    "regular_price": 29.99,
    "sale_price": 24.99,
    "stock_qty": 45,
    "is_flash_sale": true,
    "sold_percent": 80,
    "rating": 4.7,
    "reviews_count": 640,
    "attributes": {
      "Brand": "Anker",
      "Ports": "5-in-1",
      "Video": "4K HDMI"
    },
    "image": "/uploads/Anker_332_USB-C_Hub_5-in-1_with_4K_HDMI___100W_PD-1790859319303-394279.webp"
  },
  {
    "id": 4,
    "sku": "SO-ELEC-04",
    "title": "Anker Soundcore 2 Portable Bluetooth Speaker 12W",
    "category": "electronics",
    "regular_price": 29.99,
    "sale_price": 27.99,
    "stock_qty": 50,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 2100,
    "attributes": {
      "Audio": "12W Stereo",
      "Brand": "Anker",
      "Playtime": "24 Hours"
    },
    "image": "/uploads/Anker_Soundcore_2_Portable_Bluetooth_Speaker_12W-1790859415506-402872.jpg"
  },
  {
    "id": 5,
    "sku": "SO-ELEC-05",
    "title": "Anker Magnetic Wireless Charging Pad with 5ft Cable",
    "category": "electronics",
    "regular_price": 27.99,
    "sale_price": 19.99,
    "stock_qty": 68,
    "is_flash_sale": false,
    "sold_percent": 4,
    "rating": 4.7,
    "reviews_count": 530,
    "attributes": {
      "Brand": "Anker",
      "Cable": "5ft USB-C",
      "Charging": "Magnetic Qi"
    },
    "image": "/uploads/Anker_Magnetic_Wireless_Charging_Pad_with_5ft_Cable-1790859557371-863436.jpg"
  },
  {
    "id": 6,
    "sku": "SO-ELEC-06",
    "title": "Anker 2-in-1 USB 3.0 SD & MicroSD Card Reader",
    "category": "electronics",
    "regular_price": 15.99,
    "sale_price": 11.99,
    "stock_qty": 85,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 780,
    "attributes": {
      "Brand": "Anker",
      "Slots": "SD & TF",
      "Speed": "USB 3.0 5Gbps"
    },
    "image": "/uploads/Anker_2-in-1_USB_3_0_SD___MicroSD_Card_Reader-1790859634809-891438.jpg"
  },
  {
    "id": 7,
    "sku": "SO-ELEC-07",
    "title": "Anker 323 Car Charger 52.5W Dual Port Fast Charger",
    "category": "electronics",
    "regular_price": 22.99,
    "sale_price": 17.99,
    "stock_qty": 65,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 490,
    "attributes": {
      "Brand": "Anker",
      "Ports": "USB-C & USB-A",
      "Power": "52.5W Output"
    },
    "image": "/uploads/Anker_323_Car_Charger_52_5W_Dual_Port_Fast_Charger-1790861032892-202342.jpg"
  },
  {
    "id": 8,
    "sku": "SO-ELEC-08",
    "title": "Anker Soundcore Life P2 Mini True Wireless Earbuds",
    "category": "electronics",
    "regular_price": 29.99,
    "sale_price": 23.99,
    "stock_qty": 75,
    "is_flash_sale": true,
    "sold_percent": 68,
    "rating": 4.6,
    "reviews_count": 1450,
    "attributes": {
      "Brand": "Anker",
      "Sound": "Custom EQ",
      "Battery": "32H Total"
    },
    "image": "/uploads/Anker_Soundcore_Life_P2_Mini_True_Wireless_Earbuds-1790861161936-963868.jpg"
  },
  {
    "id": 9,
    "sku": "SO-ELEC-09",
    "title": "Logitech M185 Compact Wireless Mouse 2.4GHz USB",
    "category": "electronics",
    "regular_price": 19.99,
    "sale_price": 14.99,
    "stock_qty": 110,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 3200,
    "attributes": {
      "Brand": "Logitech",
      "Battery": "12 Months",
      "Connection": "2.4GHz Wireless"
    },
    "image": "/uploads/Logitech_M185_Compact_Wireless_Mouse_2_4GHz_USB-1790861240210-46609.jpg"
  },
  {
    "id": 10,
    "sku": "SO-ELEC-10",
    "title": "Logitech K120 Ergonomic USB Wired Desktop Keyboard",
    "category": "electronics",
    "regular_price": 18.99,
    "sale_price": 14.49,
    "stock_qty": 95,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1890,
    "attributes": {
      "Brand": "Logitech",
      "Spill": "Spill Resistant",
      "Layout": "Full Size"
    },
    "image": "/uploads/Logitech_K120_Ergonomic_USB_Wired_Desktop_Keyboard-1790861309989-701008.jpg"
  },
  {
    "id": 11,
    "sku": "SO-ELEC-11",
    "title": "Logitech C270 HD 720p Webcam with Noise Mic",
    "category": "electronics",
    "regular_price": 29.99,
    "sale_price": 24.99,
    "stock_qty": 40,
    "is_flash_sale": true,
    "sold_percent": 85,
    "rating": 4.6,
    "reviews_count": 1120,
    "attributes": {
      "Mic": "Noise-Reducing",
      "Brand": "Logitech",
      "Resolution": "720p HD"
    },
    "image": "/uploads/Logitech_C270_HD_720p_Webcam_with_Noise_Mic-1790861386353-720742.jpg"
  },
  {
    "id": 12,
    "sku": "SO-ELEC-12",
    "title": "Logitech M325c Wireless Mouse Micro-Precise Scroll",
    "category": "electronics",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 60,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 940,
    "attributes": {
      "Brand": "Logitech",
      "Scroll": "Micro-Precise",
      "Battery": "18 Months"
    },
    "image": "/uploads/Logitech_M325c_Wireless_Mouse_Micro-Precise_Scroll-1790861509423-233709.jpg"
  },
  {
    "id": 13,
    "sku": "SO-ELEC-13",
    "title": "Logitech H390 USB Headset Noise-Canceling Mic",
    "category": "electronics",
    "regular_price": 29.99,
    "sale_price": 26.99,
    "stock_qty": 48,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1350,
    "attributes": {
      "Brand": "Logitech",
      "Connect": "USB Plug & Play",
      "Controls": "In-line Audio"
    },
    "image": "/uploads/Logitech_H390_USB_Headset_Noise-Canceling_Mic-1790861612692-227104.jpg"
  },
  {
    "id": 14,
    "sku": "SO-ELEC-14",
    "title": "Logitech Studio Series Desk Mat Large Extended",
    "category": "electronics",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 70,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 670,
    "attributes": {
      "Size": "300x700mm",
      "Brand": "Logitech",
      "Fabric": "Spill-Resistant"
    },
    "image": "/uploads/Logitech_Studio_Series_Desk_Mat_Large_Extended-1790861698343-609542.jpg"
  },
  {
    "id": 15,
    "sku": "SO-ELEC-15",
    "title": "Logitech B100 Optical USB Mouse Ambidextrous",
    "category": "electronics",
    "regular_price": 13.99,
    "sale_price": 10.99,
    "stock_qty": 120,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.5,
    "reviews_count": 2400,
    "attributes": {
      "DPI": "800 DPI Optical",
      "Brand": "Logitech",
      "Cable": "5.9ft USB"
    },
    "image": "/uploads/Logitech_B100_Optical_USB_Mouse_Ambidextrous-1790861751854-384547.jpg"
  },
  {
    "id": 16,
    "sku": "SO-ELEC-16",
    "title": "JBL GO 3 Ultra-Portable Waterproof Bluetooth Speaker",
    "category": "electronics",
    "regular_price": 29.95,
    "sale_price": 28.95,
    "stock_qty": 55,
    "is_flash_sale": true,
    "sold_percent": 70,
    "rating": 4.8,
    "reviews_count": 3100,
    "attributes": {
      "Brand": "JBL",
      "Playtime": "5 Hours",
      "Waterproof": "IP67 Rated"
    },
    "image": "/uploads/JBL_GO_3_Ultra-Portable_Waterproof_Bluetooth_Speaker-1790861810150-446515.jpg"
  },
  {
    "id": 17,
    "sku": "SO-ELEC-17",
    "title": "JBL Quantum 50 In-Ear Gaming Earphones with Mic",
    "category": "electronics",
    "regular_price": 29.95,
    "sale_price": 24.95,
    "stock_qty": 50,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 820,
    "attributes": {
      "Mic": "Inline Volume Slider",
      "Brand": "JBL",
      "Driver": "8.6mm Drivers"
    },
    "image": "/uploads/JBL_Quantum_50_In-Ear_Gaming_Earphones_with_Mic-1790861885733-32948.webp"
  },
  {
    "id": 18,
    "sku": "SO-ELEC-18",
    "title": "JBL Tune 110 Pure Bass Wired Earphones 3.5mm",
    "category": "electronics",
    "regular_price": 14.95,
    "sale_price": 11.95,
    "stock_qty": 130,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.5,
    "reviews_count": 4500,
    "attributes": {
      "Audio": "JBL Pure Bass",
      "Brand": "JBL",
      "Cable": "Tangle-Free Flat"
    },
    "image": "/uploads/JBL_Tune_110_Pure_Bass_Wired_Earphones_3_5mm-1790861957427-321278.jpg"
  },
  {
    "id": 19,
    "sku": "SO-ELEC-19",
    "title": "JBL Tune 205 Earbuds with 1-Button Remote",
    "category": "electronics",
    "regular_price": 19.95,
    "sale_price": 16.95,
    "stock_qty": 80,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.5,
    "reviews_count": 1250,
    "attributes": {
      "Mic": "Hands-Free",
      "Brand": "JBL",
      "Housing": "Premium Metal Finish"
    },
    "image": "/uploads/JBL_Tune_205_Earbuds_with_1-Button_Remote-1790862076824-835396.jpg"
  },
  {
    "id": 20,
    "sku": "SO-ELEC-20",
    "title": "JBL Endurance Run Sweatproof Sport In-Ear Headphones",
    "category": "electronics",
    "regular_price": 24.95,
    "sale_price": 19.95,
    "stock_qty": 65,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 990,
    "attributes": {
      "Fit": "FlipHook 2-Way",
      "Brand": "JBL",
      "Waterproof": "IPX5 Sweatproof"
    },
    "image": "/uploads/JBL_Endurance_Run_Sweatproof_Sport_In-Ear_Headphones-1790862175283-208324.jpg"
  },
  {
    "id": 21,
    "sku": "SO-ELEC-21",
    "title": "Sony MDR-ZX110 Lightweight On-Ear Stereo Headphones",
    "category": "electronics",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 85,
    "is_flash_sale": true,
    "sold_percent": 82,
    "rating": 4.6,
    "reviews_count": 5100,
    "attributes": {
      "Brand": "Sony",
      "Design": "Swivel Folding",
      "Driver": "30mm Dynamic"
    },
    "image": "/uploads/Sony_MDR-ZX110_Lightweight_On-Ear_Stereo_Headphones-1790862257700-600312.jpg"
  },
  {
    "id": 22,
    "sku": "SO-ELEC-22",
    "title": "Sony MDR-EX14AP In-Ear Earbuds with Inline Mic",
    "category": "electronics",
    "regular_price": 17.99,
    "sale_price": 14.99,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.5,
    "reviews_count": 2200,
    "attributes": {
      "Brand": "Sony",
      "Sound": "Neodymium Drivers",
      "Earbuds": "Silicone Tips"
    },
    "image": "/uploads/Sony_MDR-EX14AP_In-Ear_Earbuds_with_Inline_Mic-1790862333174-957674.jpg"
  },
  {
    "id": 23,
    "sku": "SO-ELEC-23",
    "title": "Sony 64GB High-Speed USB 3.2 Flash Drive Type-A",
    "category": "electronics",
    "regular_price": 18.99,
    "sale_price": 13.99,
    "stock_qty": 100,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1400,
    "attributes": {
      "Brand": "Sony",
      "Capacity": "64GB",
      "Interface": "USB 3.2 Gen 1"
    },
    "image": "/uploads/Sony_64GB_High-Speed_USB_3_2_Flash_Drive_Type-A-1790862403248-73511.jpg"
  },
  {
    "id": 24,
    "sku": "SO-ELEC-24",
    "title": "Sony MDR-ZX110AP Folding Headphones with Mic",
    "category": "electronics",
    "regular_price": 29.99,
    "sale_price": 24.99,
    "stock_qty": 60,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 3100,
    "attributes": {
      "Cup": "Cushioned Earpads",
      "Brand": "Sony",
      "Remote": "1-Button Inline Mic"
    },
    "image": "/uploads/Sony_MDR-ZX110AP_Folding_Headphones_with_Mic-1790862481962-651723.jpg"
  },
  {
    "id": 25,
    "sku": "SO-ELEC-25",
    "title": "Sony 32GB Class 10 UHS-I SDHC Memory Card",
    "category": "electronics",
    "regular_price": 14.99,
    "sale_price": 11.99,
    "stock_qty": 115,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 980,
    "attributes": {
      "Brand": "Sony",
      "Speed": "Up to 100MB/s",
      "Protection": "Water & Temp Proof"
    },
    "image": "/uploads/Sony_32GB_Class_10_UHS-I_SDHC_Memory_Card-1790862609621-549258.jpg"
  },
  {
    "id": 26,
    "sku": "SO-BEAU-01",
    "title": "CeraVe Hydrating Facial Cleanser 16oz Hyaluronic Acid",
    "category": "beauty",
    "regular_price": 19.99,
    "sale_price": 15.99,
    "stock_qty": 119,
    "is_flash_sale": true,
    "sold_percent": 90,
    "rating": 4.8,
    "reviews_count": 4200,
    "attributes": {
      "Size": "16 fl oz (473ml)",
      "Skin": "Normal to Dry",
      "Brand": "CeraVe"
    },
    "image": "/uploads/CeraVe_Hydrating_Facial_Cleanser_16oz_Hyaluronic_Acid-1790855957787-596021.jpg"
  },
  {
    "id": 27,
    "sku": "SO-BEAU-02",
    "title": "CeraVe Moisturizing Cream 19oz Tub with Daily Pump",
    "category": "beauty",
    "regular_price": 23.99,
    "sale_price": 18.99,
    "stock_qty": 95,
    "is_flash_sale": true,
    "sold_percent": 79,
    "rating": 4.9,
    "reviews_count": 5800,
    "attributes": {
      "Size": "19 oz (539g)",
      "Brand": "CeraVe",
      "Ceramides": "3 Essential Ceramides"
    },
    "image": "/uploads/CeraVe_Moisturizing_Cream_19oz_Tub_with_Daily_Pump-1790855972987-264328.jfif"
  },
  {
    "id": 28,
    "sku": "SO-BEAU-03",
    "title": "CeraVe Daily Moisturizing Lotion 12oz Lightweight",
    "category": "beauty",
    "regular_price": 17.99,
    "sale_price": 13.99,
    "stock_qty": 110,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3600,
    "attributes": {
      "Size": "12 fl oz",
      "Brand": "CeraVe",
      "Feature": "MVE Technology 24H Hydration"
    },
    "image": "/uploads/CeraVe_Daily_Moisturizing_Lotion_12oz_Lightweight-1790856112792-624399.jpg"
  },
  {
    "id": 29,
    "sku": "SO-BEAU-04",
    "title": "CeraVe Eye Repair Cream 0.5oz for Dark Circles",
    "category": "beauty",
    "regular_price": 18.99,
    "sale_price": 14.99,
    "stock_qty": 80,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2100,
    "attributes": {
      "Brand": "CeraVe",
      "Target": "Puffiness & Dark Circles",
      "Tested": "Ophthalmologist"
    },
    "image": "/uploads/CeraVe_Eye_Repair_Cream_0_5oz_for_Dark_Circles-1790856187853-294582.jfif"
  },
  {
    "id": 30,
    "sku": "SO-BEAU-05",
    "title": "CeraVe Foaming Facial Cleanser 16oz for Normal-Oily Skin",
    "category": "beauty",
    "regular_price": 19.99,
    "sale_price": 15.99,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3100,
    "attributes": {
      "Size": "16 fl oz",
      "Brand": "CeraVe",
      "Benefit": "Niacinamide Calming Formula"
    },
    "image": "/uploads/CeraVe_Foaming_Facial_Cleanser_16oz_for_Normal-Oily_Skin-1790856282156-881026.jfif"
  },
  {
    "id": 31,
    "sku": "SO-BEAU-06",
    "title": "CeraVe Healing Ointment 5oz Tube for Dry Cracked Skin",
    "category": "beauty",
    "regular_price": 16.99,
    "sale_price": 12.49,
    "stock_qty": 85,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 1850,
    "attributes": {
      "Size": "5 oz",
      "Brand": "CeraVe",
      "Texture": "Non-Greasy Petrolatum"
    },
    "image": "/uploads/CeraVe_Healing_Ointment_5oz_Tube_for_Dry_Cracked_Skin-1790856522707-633446.jfif"
  },
  {
    "id": 32,
    "sku": "SO-BEAU-07",
    "title": "CeraVe AM Facial Moisturizing Lotion with SPF 30",
    "category": "beauty",
    "regular_price": 21.99,
    "sale_price": 16.99,
    "stock_qty": 75,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2700,
    "attributes": {
      "Size": "3 oz",
      "Brand": "CeraVe",
      "Sunscreen": "Broad Spectrum SPF 30"
    },
    "image": "/uploads/CeraVe_AM_Facial_Moisturizing_Lotion_with_SPF_30-1790856641586-464882.jfif"
  },
  {
    "id": 33,
    "sku": "SO-BEAU-08",
    "title": "CeraVe PM Facial Moisturizing Lotion 3oz Night Cream",
    "category": "beauty",
    "regular_price": 19.99,
    "sale_price": 15.49,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3400,
    "attributes": {
      "Size": "3 oz",
      "Brand": "CeraVe",
      "Night": "Ultra-Lightweight Night"
    },
    "image": "/uploads/CeraVe_PM_Facial_Moisturizing_Lotion_3oz_Night_Cream-1790856716491-546827.jfif"
  },
  {
    "id": 34,
    "sku": "SO-BEAU-09",
    "title": "CeraVe Resurfacing Retinol Serum 1oz Post-Acne Marks",
    "category": "beauty",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 65,
    "is_flash_sale": true,
    "sold_percent": 72,
    "rating": 4.7,
    "reviews_count": 1920,
    "attributes": {
      "Size": "1 fl oz",
      "Brand": "CeraVe",
      "Formula": "Encapsulated Retinol"
    },
    "image": "/uploads/CeraVe_Resurfacing_Retinol_Serum_1oz_Post-Acne_Marks-1790856822279-684900.jfif"
  },
  {
    "id": 35,
    "sku": "SO-BEAU-10",
    "title": "Neutrogena Hydro Boost Water Gel Face Moisturizer 1.7oz",
    "category": "beauty",
    "regular_price": 26.99,
    "sale_price": 19.97,
    "stock_qty": 105,
    "is_flash_sale": true,
    "sold_percent": 85,
    "rating": 4.8,
    "reviews_count": 6200,
    "attributes": {
      "Brand": "Neutrogena",
      "Texture": "Oil-Free Gel",
      "Hydration": "Pure Hyaluronic Acid"
    },
    "image": "/uploads/Neutrogena_Hydro_Boost_Water_Gel_Face_Moisturizer_1_7oz-1790857218013-865646.jfif"
  },
  {
    "id": 36,
    "sku": "SO-BEAU-11",
    "title": "Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 70",
    "category": "beauty",
    "regular_price": 15.49,
    "sale_price": 11.99,
    "stock_qty": 110,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 4100,
    "attributes": {
      "Brand": "Neutrogena",
      "Water": "80 Min Resistant",
      "Protection": "Helioplex Broad Spectrum"
    },
    "image": "/uploads/Neutrogena_Ultra_Sheer_Dry-Touch_Sunscreen_SPF_70-1790857311169-299265.jpg"
  },
  {
    "id": 37,
    "sku": "SO-BEAU-12",
    "title": "Neutrogena Fragrance-Free Makeup Remover Wipes 2-Pack",
    "category": "beauty",
    "regular_price": 16.99,
    "sale_price": 12.99,
    "stock_qty": 130,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 5300,
    "attributes": {
      "Brand": "Neutrogena",
      "Count": "50 Total Towelettes",
      "Cleanse": "Dissolves 99.3% Makeup"
    },
    "image": "/uploads/Neutrogena_Fragrance-Free_Makeup_Remover_Wipes_2-Pack-1790857397710-77699.jpg"
  },
  {
    "id": 38,
    "sku": "SO-BEAU-13",
    "title": "Neutrogena Oil-Free Acne Wash Salicylic Acid Cleanser",
    "category": "beauty",
    "regular_price": 13.99,
    "sale_price": 10.99,
    "stock_qty": 95,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 2800,
    "attributes": {
      "Size": "9.1 fl oz",
      "Brand": "Neutrogena",
      "Active": "2% Salicylic Acid"
    },
    "image": "/uploads/Neutrogena_Oil-Free_Acne_Wash_Salicylic_Acid_Cleanser-1790857593035-208648.jpg"
  },
  {
    "id": 39,
    "sku": "SO-BEAU-14",
    "title": "Neutrogena Hydro Boost Hydrating Gel Cleanser 7.7oz",
    "category": "beauty",
    "regular_price": 15.99,
    "sale_price": 12.49,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2150,
    "attributes": {
      "Size": "7.7 oz",
      "Brand": "Neutrogena",
      "Benefit": "Boosts Skin Hydration"
    },
    "image": "/uploads/Neutrogena_Hydro_Boost_Water_Gel_Face_Moisturizer_1_7oz-1790857607707-851416.jfif"
  },
  {
    "id": 40,
    "sku": "SO-BEAU-15",
    "title": "Neutrogena Rapid Wrinkle Repair Retinol Face Cream",
    "category": "beauty",
    "regular_price": 29.99,
    "sale_price": 24.99,
    "stock_qty": 55,
    "is_flash_sale": true,
    "sold_percent": 65,
    "rating": 4.7,
    "reviews_count": 2900,
    "attributes": {
      "Size": "1.7 oz",
      "Brand": "Neutrogena",
      "Action": "Accelerated Retinol SA"
    },
    "image": "/uploads/Neutrogena_Rapid_Wrinkle_Repair_Retinol_Face_Cream-1790857660831-535229.jfif"
  },
  {
    "id": 41,
    "sku": "SO-BEAU-16",
    "title": "Neutrogena Body Clear Pink Grapefruit Body Wash 8.5oz",
    "category": "beauty",
    "regular_price": 14.99,
    "sale_price": 11.49,
    "stock_qty": 85,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1750,
    "attributes": {
      "Brand": "Neutrogena",
      "Scent": "Naturally Derived Grapefruit",
      "Target": "Body Breakouts"
    },
    "image": "/uploads/Neutrogena_Body_Clear_Pink_Grapefruit_Body_Wash_8_5oz-1790857743907-548317.jfif"
  },
  {
    "id": 42,
    "sku": "SO-BEAU-17",
    "title": "Neutrogena Norwegian Formula Concentrated Hand Cream 2-Pack",
    "category": "beauty",
    "regular_price": 13.99,
    "sale_price": 10.99,
    "stock_qty": 115,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 2600,
    "attributes": {
      "Size": "2x 2 oz",
      "Brand": "Neutrogena",
      "Glycerin": "Rich Glycerin Formula"
    },
    "image": "/uploads/Neutrogena_Norwegian_Formula_Concentrated_Hand_Cream_2-Pack-1790857843904-181343.jpg"
  },
  {
    "id": 43,
    "sku": "SO-BEAU-18",
    "title": "La Roche-Posay Toleriane Purifying Foaming Cleanser 13.5oz",
    "category": "beauty",
    "regular_price": 22.99,
    "sale_price": 17.99,
    "stock_qty": 85,
    "is_flash_sale": true,
    "sold_percent": 74,
    "rating": 4.8,
    "reviews_count": 3800,
    "attributes": {
      "Size": "13.5 fl oz",
      "Skin": "Normal to Oily Sensitive",
      "Brand": "La Roche-Posay"
    },
    "image": "/uploads/La_Roche-Posay_Toleriane_Purifying_Foaming_Cleanser_13_5oz-1790857919365-210234.jpg"
  },
  {
    "id": 44,
    "sku": "SO-BEAU-19",
    "title": "La Roche-Posay Cicaplast Baume B5 Soothing Multi-Purpose Balm",
    "category": "beauty",
    "regular_price": 21,
    "sale_price": 16.99,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.9,
    "reviews_count": 4900,
    "attributes": {
      "Size": "1.35 oz",
      "Brand": "La Roche-Posay",
      "Ingredients": "Panthenol B5 & Madecassoside"
    },
    "image": "/uploads/La_Roche-Posay_Cicaplast_Baume_B5_Soothing_Multi-Purpose_Balm-1790858004540-509126.jpg"
  },
  {
    "id": 45,
    "sku": "SO-BEAU-20",
    "title": "La Roche-Posay Effaclar Medicated Gel Cleanser Salicylic Acid",
    "category": "beauty",
    "regular_price": 20.99,
    "sale_price": 16.99,
    "stock_qty": 70,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2100,
    "attributes": {
      "Size": "6.76 fl oz",
      "Brand": "La Roche-Posay",
      "Active": "2% Salicylic Acid + LHA"
    },
    "image": "/uploads/La_Roche-Posay_Effaclar_Medicated_Gel_Cleanser_Salicylic_Acid-1790858091591-459257.jpg"
  },
  {
    "id": 46,
    "sku": "SO-BEAU-21",
    "title": "La Roche-Posay Thermal Spring Water Mineral Face Mist 10.1oz",
    "category": "beauty",
    "regular_price": 23,
    "sale_price": 18.99,
    "stock_qty": 75,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1400,
    "attributes": {
      "Size": "10.1 oz (300g)",
      "Brand": "La Roche-Posay",
      "Minerals": "Antioxidant Selenium"
    },
    "image": "/uploads/La_Roche-Posay_Thermal_Spring_Water_Mineral_Face_Mist_10_1oz-1790858191876-826640.jpg"
  },
  {
    "id": 47,
    "sku": "SO-BEAU-22",
    "title": "La Roche-Posay Lipikar AP+ Gentle Foaming Body Cleansing Oil",
    "category": "beauty",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 59,
    "is_flash_sale": false,
    "sold_percent": 2,
    "rating": 4.8,
    "reviews_count": 1250,
    "attributes": {
      "Size": "13.5 fl oz",
      "Brand": "La Roche-Posay",
      "Formula": "Lipid-Replenishing Shea Butter"
    },
    "image": "/uploads/La_Roche-Posay_Lipikar_AP__Gentle_Foaming_Body_Cleansing_Oil-1790858252207-611155.jpg"
  },
  {
    "id": 48,
    "sku": "SO-BEAU-23",
    "title": "La Roche-Posay Toleriane Double Repair Face Moisturizer 2.5oz",
    "category": "beauty",
    "regular_price": 29.99,
    "sale_price": 23.99,
    "stock_qty": 80,
    "is_flash_sale": true,
    "sold_percent": 81,
    "rating": 4.8,
    "reviews_count": 4100,
    "attributes": {
      "Size": "2.5 fl oz",
      "Brand": "La Roche-Posay",
      "Barrier": "Prebiotic Thermal Water"
    },
    "image": "/uploads/La_Roche-Posay_Toleriane_Double_Repair_Face_Moisturizer_2_5oz-1790858353366-948404.jpg"
  },
  {
    "id": 49,
    "sku": "SO-BEAU-24",
    "title": "La Roche-Posay Anthelios Ultra-Light Fluid Sunscreen SPF 60",
    "category": "beauty",
    "regular_price": 29.99,
    "sale_price": 28.99,
    "stock_qty": 55,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3200,
    "attributes": {
      "Size": "1.7 fl oz",
      "Brand": "La Roche-Posay",
      "Texture": "Fast-Absorbing Matte"
    },
    "image": "/uploads/La_Roche-Posay_Anthelios_Ultra-Light_Fluid_Sunscreen_SPF_60-1790858429692-1163.webp"
  },
  {
    "id": 50,
    "sku": "SO-BEAU-25",
    "title": "La Roche-Posay Lipikar Triple Repair Moisturizing Cream 6.76oz",
    "category": "beauty",
    "regular_price": 26.99,
    "sale_price": 21.99,
    "stock_qty": 65,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 1950,
    "attributes": {
      "Size": "6.76 oz",
      "Brand": "La Roche-Posay",
      "Moisture": "48 Hour Body Hydration"
    },
    "image": "/uploads/La_Roche-Posay_Lipikar_Triple_Repair_Moisturizing_Cream_13_5oz-1790858657475-641826.jpg"
  },
  {
    "id": 51,
    "sku": "SO-APPL-01",
    "title": "MINIPRESSO NS2 Capsule Espresso Machine.",
    "category": "appliances",
    "regular_price": 17.99,
    "sale_price": 12.99,
    "stock_qty": 140,
    "is_flash_sale": true,
    "sold_percent": 92,
    "rating": 4.8,
    "reviews_count": 7800,
    "attributes": {
      "Size": "4-inch Surface",
      "Brand": "Dash",
      "Power": "350 Watts"
    },
    "image": "/uploads/MINIPRESSO_NS2_Capsule_Espresso_Machine-1790863090455-755077.jpg"
  },
  {
    "id": 52,
    "sku": "SO-APPL-02",
    "title": "Dash Rapid Egg Cooker, 7 Eggs, Hard Boiled, Poached & Omelettes, Black",
    "category": "appliances",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 100,
    "is_flash_sale": true,
    "sold_percent": 86,
    "rating": 4.7,
    "reviews_count": 6200,
    "attributes": {
      "Brand": "Dash",
      "AutoOff": "Auto-Shut Off Buzzer",
      "Capacity": "6 Eggs"
    },
    "image": "/uploads/Dash_Rapid_Egg_Cooker__7_Eggs__Hard_Boiled__Poached___Omelettes__Black-1790863448708-419011.jpg"
  },
  {
    "id": 53,
    "sku": "SO-APPL-03",
    "title": "Dash Mini Griddle Electric Maker for Pancakes & Cookies",
    "category": "appliances",
    "regular_price": 16.99,
    "sale_price": 12.99,
    "stock_qty": 95,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2400,
    "attributes": {
      "Brand": "Dash",
      "Plate": "4-inch Nonstick",
      "Heating": "Quick Preheat"
    },
    "image": "/uploads/Dash_Mini_Griddle_Electric_Maker_for_Pancakes___Cookies-1790863518325-439891.jpg"
  },
  {
    "id": 54,
    "sku": "SO-APPL-04",
    "title": "Dash Mini Rice Cooker Steamer 2-Cup Removable Pot",
    "category": "appliances",
    "regular_price": 49.99,
    "sale_price": 27.99,
    "stock_qty": 17,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1850,
    "attributes": {
      "Brand": "Dash",
      "Capacity": "2 Cups Cooked",
      "Features": "Keep Warm Function"
    },
    "image": "/uploads/Dash_Mini_Rice_Cooker_Steamer_2-Cup_Removable_Pot-1790863662734-936280.jpg"
  },
  {
    "id": 55,
    "sku": "SO-APPL-05",
    "title": "Dash Compact Electric Citrus Juicer 32oz Pitcher",
    "category": "appliances",
    "regular_price": 45,
    "sale_price": 32.99,
    "stock_qty": 80,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1420,
    "attributes": {
      "Brand": "Dash",
      "Cones": "Dual Reversing Cones",
      "Volume": "32 oz Pitcher"
    },
    "image": "/uploads/Dash_Compact_Electric_Citrus_Juicer_32oz_Pitcher-1790863836021-110160.jpg"
  },
  {
    "id": 56,
    "sku": "SO-APPL-06",
    "title": "Dash Fresh Pop Popcorn Maker Hot Air Popper Machine",
    "category": "appliances",
    "regular_price": 29.99,
    "sale_price": 24.99,
    "stock_qty": 65,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1780,
    "attributes": {
      "Tech": "Hot Air No Oil Needed",
      "Brand": "Dash",
      "Yield": "Up to 16 Cups"
    },
    "image": "/uploads/Dash_Fresh_Pop_Popcorn_Maker_Hot_Air_Popper_Machine-1790863956435-942997.jpg"
  },
  {
    "id": 57,
    "sku": "SO-APPL-07",
    "title": "Dash Handheld Electric Milk Frother Wand with Metal Stand",
    "category": "appliances",
    "regular_price": 19.99,
    "sale_price": 14.99,
    "stock_qty": 120,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2900,
    "attributes": {
      "Brand": "Dash",
      "Stand": "Included Stand",
      "Whisk": "Stainless Steel"
    },
    "image": "/uploads/Dash_Handheld_Electric_Milk_Frother_Wand_with_Metal_Stand-1790864052101-795753.jpg"
  },
  {
    "id": 58,
    "sku": "SO-APPL-08",
    "title": "Dash Mini Toaster Oven Baking Pan and Broil Crisper Set",
    "category": "appliances",
    "regular_price": 45,
    "sale_price": 28.99,
    "stock_qty": 23,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.5,
    "reviews_count": 980,
    "attributes": {
      "Fits": "Compact Toaster Ovens",
      "Brand": "Dash",
      "Material": "Carbon Steel Nonstick"
    },
    "image": "/uploads/Dash_Mini_Toaster_Oven_Baking_Pan_and_Broil_Crisper_Set-1790864180071-325562.jpg"
  },
  {
    "id": 59,
    "sku": "SO-APPL-09",
    "title": "Dash Everyday Ice Cream Maker Pint Sized Soft Serve",
    "category": "appliances",
    "regular_price": 65.99,
    "sale_price": 39.99,
    "stock_qty": 12,
    "is_flash_sale": true,
    "sold_percent": 70,
    "rating": 4.6,
    "reviews_count": 1340,
    "attributes": {
      "Time": "20 Min Fresh Cream",
      "Brand": "Dash",
      "Capacity": "1 Pint Bowl"
    },
    "image": "/uploads/Dash_Everyday_Ice_Cream_Maker_Pint_Sized_Soft_Serve-1790864289884-519045.jpg"
  },
  {
    "id": 60,
    "sku": "SO-APPL-10",
    "title": "Hamilton Beach 6-Speed Hand Mixer with Snap-On Case",
    "category": "appliances",
    "regular_price": 29.99,
    "sale_price": 22.99,
    "stock_qty": 85,
    "is_flash_sale": true,
    "sold_percent": 81,
    "rating": 4.7,
    "reviews_count": 3600,
    "attributes": {
      "Brand": "Hamilton Beach",
      "Speeds": "6 Speed + QuickBurst",
      "Storage": "Snap-On Case"
    },
    "image": "/uploads/Hamilton_Beach_6-Speed_Hand_Mixer_with_Snap-On_Case-1790864419698-734840.jpg"
  },
  {
    "id": 61,
    "sku": "SO-APPL-11",
    "title": "Hamilton Beach Personal Blender 14oz Portable Travel Cup",
    "category": "appliances",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 80,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 4200,
    "attributes": {
      "Jar": "14oz BPA-Free Jar",
      "Brand": "Hamilton Beach",
      "Power": "175 Watt Motor"
    },
    "image": "/uploads/Hamilton_Beach_Personal_Blender_14oz_Portable_Travel_Cup-1790864571466-272494.jpg"
  },
  {
    "id": 62,
    "sku": "SO-APPL-12",
    "title": "Hamilton Beach 3-Cup Electric Vegetable Food Chopper",
    "category": "appliances",
    "regular_price": 32,
    "sale_price": 27.99,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 2800,
    "attributes": {
      "Bowl": "3-Cup Capacity",
      "Brand": "Hamilton Beach",
      "Blades": "Stainless Steel"
    },
    "image": "/uploads/Hamilton_Beach_3-Cup_Electric_Vegetable_Food_Chopper-1790864650431-212395.jpg"
  },
  {
    "id": 63,
    "sku": "SO-APPL-13",
    "title": "Hamilton Beach Fresh Grind Electric Coffee Bean Grinder",
    "category": "appliances",
    "regular_price": 28.99,
    "sale_price": 23.99,
    "stock_qty": 95,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 3100,
    "attributes": {
      "Brand": "Hamilton Beach",
      "Yield": "Up to 12 Cups",
      "Chamber": "Removable Stainless"
    },
    "image": "/uploads/Hamilton_Beach_Fresh_Grind_Electric_Coffee_Bean_Grinder-1790864714799-349835.jpg"
  },
  {
    "id": 64,
    "sku": "SO-APPL-14",
    "title": "Hamilton Beach 1-Liter Compact Electric Stainless Kettle",
    "category": "appliances",
    "regular_price": 29.99,
    "sale_price": 26.99,
    "stock_qty": 70,
    "is_flash_sale": true,
    "sold_percent": 78,
    "rating": 4.7,
    "reviews_count": 2400,
    "attributes": {
      "Brand": "Hamilton Beach",
      "Capacity": "1.0 Liter",
      "AutoShutoff": "Boil-Dry Protection"
    },
    "image": "/uploads/Hamilton_Beach_1-Liter_Compact_Electric_Stainless_Kettle-1790864804858-135594.jpg"
  },
  {
    "id": 65,
    "sku": "SO-APPL-15",
    "title": "Hamilton Beach 2-Slice Extra-Wide Slot Toaster Defrost",
    "category": "appliances",
    "regular_price": 38.99,
    "sale_price": 29.99,
    "stock_qty": 75,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1900,
    "attributes": {
      "Brand": "Hamilton Beach",
      "Shade": "Toast Boost High-Lift",
      "Slots": "Extra Wide Slots"
    },
    "image": "/uploads/Hamilton_Beach_2-Slice_Extra-Wide_Slot_Toaster_Defrost-1790864868589-996956.jpg"
  },
  {
    "id": 66,
    "sku": "SO-APPL-16",
    "title": "Hamilton Beach Breakfast Sandwich Maker Quick Cooker",
    "category": "appliances",
    "regular_price": 29.99,
    "sale_price": 29.99,
    "stock_qty": 60,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 5100,
    "attributes": {
      "Brand": "Hamilton Beach",
      "Cleaning": "Dishwasher Safe",
      "CookTime": "5 Minutes Ready"
    },
    "image": "/uploads/Hamilton_Beach_Breakfast_Sandwich_Maker_Quick_Cooker-1790864918850-161133.jpg"
  },
  {
    "id": 67,
    "sku": "SO-APPL-17",
    "title": "Hamilton Beach Egg Bite Maker Microwave & Electric Cooker",
    "category": "appliances",
    "regular_price": 34.99,
    "sale_price": 27.85,
    "stock_qty": 85,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1450,
    "attributes": {
      "Cups": "2 Silicone Cups",
      "Brand": "Hamilton Beach",
      "Power": "Nonstick Water Base"
    },
    "image": "/uploads/Hamilton_Beach_Egg_Bite_Maker_Microwave___Electric_Cooker-1790864991387-970944.jfif"
  },
  {
    "id": 68,
    "sku": "SO-APPL-18",
    "title": "Black+Decker 1.5-Cup One-Touch Electric Food Chopper",
    "category": "appliances",
    "regular_price": 45,
    "sale_price": 32,
    "stock_qty": 36,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 4800,
    "attributes": {
      "Brand": "Black+Decker",
      "Control": "One-Touch Pulse",
      "Capacity": "1.5-Cup Bowl"
    },
    "image": "/uploads/Black_Decker_1_5-Cup_One-Touch_Electric_Food_Chopper-1790865143124-115727.jpg"
  },
  {
    "id": 69,
    "sku": "SO-APPL-19",
    "title": "Black+Decker Lightweight Steam Iron Nonstick Soleplate",
    "category": "appliances",
    "regular_price": 25.99,
    "sale_price": 19.99,
    "stock_qty": 85,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.5,
    "reviews_count": 3200,
    "attributes": {
      "Brand": "Black+Decker",
      "Steam": "SmartSteam Tech",
      "Soleplate": "TrueGlide Nonstick"
    },
    "image": "/uploads/Black_Decker_Lightweight_Steam_Iron_Nonstick_Soleplate-1790865197560-616995.jpg"
  },
  {
    "id": 70,
    "sku": "SO-APPL-20",
    "title": "Black+Decker ComfortGrip Electric Carving Knife 9-Inch",
    "category": "appliances",
    "regular_price": 27.99,
    "sale_price": 21.99,
    "stock_qty": 70,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1980,
    "attributes": {
      "Brand": "Black+Decker",
      "Blades": "9-inch Serrated Stainless",
      "Safety": "Lock Button"
    },
    "image": "/uploads/Black_Decker_ComfortGrip_Electric_Carving_Knife_9-Inch-1790865273818-7071.jpg"
  },
  {
    "id": 71,
    "sku": "SO-APPL-21",
    "title": "Black+Decker 5-Speed Corded Hand Mixer with Beaters",
    "category": "appliances",
    "regular_price": 54.99,
    "sale_price": 43.99,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.5,
    "reviews_count": 2150,
    "attributes": {
      "Brand": "Black+Decker",
      "Speeds": "5 Speed Settings",
      "Attachments": "2 Wire Beaters"
    },
    "image": "/uploads/Black_Decker_5-Speed_Corded_Hand_Mixer_with_Beaters-1790865401060-376976.jpg"
  },
  {
    "id": 72,
    "sku": "SO-APPL-22",
    "title": "Black+Decker 34oz Electric Citrus Juicer Dual Cones",
    "category": "appliances",
    "regular_price": 29.99,
    "sale_price": 24.99,
    "stock_qty": 75,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.5,
    "reviews_count": 1640,
    "attributes": {
      "Brand": "Black+Decker",
      "Cones": "Self-Reversing Cones",
      "Pitcher": "34 oz Capacity"
    },
    "image": "/uploads/Black_Decker_34oz_Electric_Citrus_Juicer_Dual_Cones-1790865481304-772849.jpg"
  },
  {
    "id": 73,
    "sku": "SO-APPL-23",
    "title": "Black+Decker 5-Cup Coffeemaker Duralife Glass Carafe",
    "category": "appliances",
    "regular_price": 29.99,
    "sale_price": 27.99,
    "stock_qty": 65,
    "is_flash_sale": true,
    "sold_percent": 74,
    "rating": 4.6,
    "reviews_count": 3100,
    "attributes": {
      "Cups": "5-Cup Capacity",
      "Brand": "Black+Decker",
      "Filter": "Removable Filter Basket"
    },
    "image": "/uploads/Black_Decker_5-Cup_Coffeemaker_Duralife_Glass_Carafe-1790865546534-771548.jpg"
  },
  {
    "id": 74,
    "sku": "SO-APPL-24",
    "title": "Black+Decker 2-Slice Compact Toaster Bagel Settings",
    "category": "appliances",
    "regular_price": 32.99,
    "sale_price": 32.99,
    "stock_qty": 80,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.5,
    "reviews_count": 1800,
    "attributes": {
      "Tray": "Drop-Down Crumb Tray",
      "Brand": "Black+Decker",
      "Functions": "Bagel & Defrost"
    },
    "image": "/uploads/Black_Decker_2-Slice_Compact_Toaster_Bagel_Settings-1790865638682-237531.jpg"
  },
  {
    "id": 75,
    "sku": "SO-APPL-25",
    "title": "Black+Decker Handheld Immersion Blender 2-Speed Stick",
    "category": "appliances",
    "regular_price": 26.99,
    "sale_price": 22.99,
    "stock_qty": 75,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1400,
    "attributes": {
      "Brand": "Black+Decker",
      "Shaft": "Stainless Steel Blending",
      "Speeds": "2 Speeds"
    },
    "image": "/uploads/Black_Decker_Handheld_Immersion_Blender_2-Speed_Stick-1790865794607-169485.jpg"
  },
  {
    "id": 76,
    "sku": "SO-HLTH-01",
    "title": "Nutricost Creatine Monohydrate Micronized Powder 500g",
    "category": "health_household",
    "regular_price": 28.99,
    "sale_price": 22.99,
    "stock_qty": 120,
    "is_flash_sale": true,
    "sold_percent": 85,
    "rating": 4.9,
    "reviews_count": 5200,
    "attributes": {
      "Brand": "Nutricost",
      "Purity": "Micronized Unflavored",
      "Servings": "100 Servings (5g)"
    },
    "image": "/uploads/Nutricost_Creatine_Monohydrate_Micronized_Powder_500g-1790944482871-191489.jpg"
  },
  {
    "id": 77,
    "sku": "SO-HLTH-02",
    "title": "Nutricost Vitamin D3 5000 IU Softgels 240 Count",
    "category": "health_household",
    "regular_price": 18.99,
    "sale_price": 13.99,
    "stock_qty": 140,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 4100,
    "attributes": {
      "Brand": "Nutricost",
      "Count": "240 Softgels",
      "Strength": "5000 IU (125mcg)"
    },
    "image": "/uploads/Nutricost_Vitamin_D3_5000_IU_Softgels_240_Count-1790944578099-600501.jpg"
  },
  {
    "id": 78,
    "sku": "SO-HLTH-03",
    "title": "Nutricost Whey Protein Powder Chocolate Flavor 2 Lbs",
    "category": "health_household",
    "regular_price": 29.99,
    "sale_price": 28.99,
    "stock_qty": 65,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2400,
    "attributes": {
      "Size": "2 Lbs (907g)",
      "Brand": "Nutricost",
      "Protein": "25g per scoop"
    },
    "image": "/uploads/Nutricost_Whey_Protein_Powder_Chocolate_Flavor_2_Lbs-1790944644297-954033.jpg"
  },
  {
    "id": 79,
    "sku": "SO-HLTH-04",
    "title": "Nutricost Magnesium Glycinate 210mg Capsules 180 Count",
    "category": "health_household",
    "regular_price": 22.99,
    "sale_price": 17.99,
    "stock_qty": 110,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3600,
    "attributes": {
      "Form": "Chelated Glycinate",
      "Brand": "Nutricost",
      "Count": "210 Veggie Capsules"
    },
    "image": "/uploads/Nutricost_Magnesium_Glycinate_210mg_Capsules_180_Count-1790944746613-18738.jpg"
  },
  {
    "id": 80,
    "sku": "SO-HLTH-05",
    "title": "Nutricost Organic Ashwagandha Extract 600mg 120 Capsules",
    "category": "health_household",
    "regular_price": 19.99,
    "sale_price": 15.99,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1950,
    "attributes": {
      "Brand": "Nutricost",
      "Count": "120 Capsules",
      "Organic": "USDA Certified Organic"
    },
    "image": "/uploads/Nutricost_Organic_Ashwagandha_Extract_600mg_120_Capsules-1790944860545-755927.jpg"
  },
  {
    "id": 81,
    "sku": "SO-HLTH-06",
    "title": "Nutricost Zinc Picolinate 50mg Tablets 240 Count",
    "category": "health_household",
    "regular_price": 15.99,
    "sale_price": 11.99,
    "stock_qty": 130,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 2700,
    "attributes": {
      "Brand": "Nutricost",
      "Count": "240 Tablets",
      "Strength": "50mg Zinc"
    },
    "image": "/uploads/Nutricost_Zinc_Picolinate_50mg_Tablets_240_Count-1790945016682-307527.jpg"
  },
  {
    "id": 82,
    "sku": "SO-HLTH-07",
    "title": "Nutricost Pre-Workout High Energy Powder Blue Raspberry",
    "category": "health_household",
    "regular_price": 26.99,
    "sale_price": 21.99,
    "stock_qty": 75,
    "is_flash_sale": true,
    "sold_percent": 78,
    "rating": 4.6,
    "reviews_count": 1400,
    "attributes": {
      "Brand": "Nutricost",
      "Caffeine": "300mg Complex",
      "Servings": "30 Servings"
    },
    "image": "/uploads/Nutricost_Pre-Workout_High_Energy_Powder_Blue_Raspberry-1790945369768-585080.jpg"
  },
  {
    "id": 83,
    "sku": "SO-HLTH-08",
    "title": "Nutricost Melatonin 5mg Fast Dissolve Tablets 240 Count",
    "category": "health_household",
    "regular_price": 16.99,
    "sale_price": 12.99,
    "stock_qty": 105,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 3200,
    "attributes": {
      "Dose": "5mg Melatonin",
      "Brand": "Nutricost",
      "Count": "240 Dissolvable"
    },
    "image": "/uploads/Nutricost_Melatonin_5mg_Fast_Dissolve_Tablets_240_Count-1790945438761-52918.jpg"
  },
  {
    "id": 84,
    "sku": "SO-HLTH-09",
    "title": "OXO Good Grips Smooth Edge Handheld Safety Can Opener",
    "category": "health_household",
    "regular_price": 29.99,
    "sale_price": 22.99,
    "stock_qty": 85,
    "is_flash_sale": true,
    "sold_percent": 80,
    "rating": 4.8,
    "reviews_count": 4900,
    "attributes": {
      "Edge": "No Sharp Edges",
      "Grip": "Cushioned Handle",
      "Brand": "OXO"
    },
    "image": "/uploads/OXO_Good_Grips_Smooth_Edge_Handheld_Safety_Can_Opener-1790945548242-399066.jpg"
  },
  {
    "id": 85,
    "sku": "SO-HLTH-10",
    "title": "OXO Good Grips Swivel Stainless Steel Vegetable Peeler",
    "category": "health_household",
    "regular_price": 14.99,
    "sale_price": 11.99,
    "stock_qty": 150,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.9,
    "reviews_count": 7200,
    "attributes": {
      "Blade": "Japanese Stainless Steel",
      "Brand": "OXO",
      "Handle": "Non-Slip Grip"
    },
    "image": "/uploads/OXO_Good_Grips_Swivel_Stainless_Steel_Vegetable_Peeler-1790945679555-836838.jpg"
  },
  {
    "id": 86,
    "sku": "SO-HLTH-11",
    "title": "OXO Good Grips POP Airtight Food Storage Container 1.7 Qt",
    "category": "health_household",
    "regular_price": 23.95,
    "sale_price": 18.95,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3600,
    "attributes": {
      "Seal": "Push-Button Airtight",
      "Brand": "OXO",
      "Volume": "1.7 Quarts"
    },
    "image": "/uploads/OXO_Good_Grips_POP_Airtight_Food_Storage_Container_1_7_Qt-1790945861658-260938.jpg"
  },
  {
    "id": 87,
    "sku": "SO-HLTH-12",
    "title": "OXO Good Grips Stainless Steel 9-Inch Locking Tongs",
    "category": "health_household",
    "regular_price": 18.99,
    "sale_price": 14.99,
    "stock_qty": 110,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 2800,
    "attributes": {
      "Lock": "Pull-Tab Lock",
      "Brand": "OXO",
      "Length": "9-inch Tongs"
    },
    "image": "/uploads/OXO_Good_Grips_Stainless_Steel_9-Inch_Locking_Tongs-1790946197719-690968.jpg"
  },
  {
    "id": 88,
    "sku": "SO-HLTH-13",
    "title": "OXO Good Grips 3-Piece Silicone Everyday Spatula Set",
    "category": "health_household",
    "regular_price": 21.99,
    "sale_price": 16.99,
    "stock_qty": 80,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 1950,
    "attributes": {
      "Set": "3 Spatulas",
      "Heat": "600°F Heat Resistant",
      "Brand": "OXO"
    },
    "image": "/uploads/OXO_Good_Grips_3-Piece_Silicone_Everyday_Spatula_Set-1790946261618-30252.jpg"
  },
  {
    "id": 89,
    "sku": "SO-HLTH-14",
    "title": "OXO Good Grips Measuring Cups and Spoons Stainless Set",
    "category": "health_household",
    "regular_price": 17.99,
    "sale_price": 12.99,
    "stock_qty": 65,
    "is_flash_sale": true,
    "sold_percent": 71,
    "rating": 4.7,
    "reviews_count": 1600,
    "attributes": {
      "Snap": "Magnetic Storage Snaps",
      "Brand": "OXO",
      "Metal": "Stainless Steel"
    },
    "image": "/uploads/OXO_Good_Grips_Measuring_Cups_and_Spoons_Stainless_Set-1790946416979-46230.jpg"
  },
  {
    "id": 90,
    "sku": "SO-HLTH-15",
    "title": "OXO Good Grips Bottle Cleaning Brush Soft Ergonomic Grip",
    "category": "health_household",
    "regular_price": 13.99,
    "sale_price": 10.99,
    "stock_qty": 130,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3400,
    "attributes": {
      "Neck": "Flexible Reach",
      "Brand": "OXO",
      "Bristles": "Dual-Type Bristles"
    },
    "image": "/uploads/OXO_Good_Grips_Bottle_Cleaning_Brush_Soft_Ergonomic_Grip-1790946534564-404830.jpg"
  },
  {
    "id": 91,
    "sku": "SO-HLTH-16",
    "title": "OXO Good Grips Stainless Steel Wheel Pizza Slicer Cutter",
    "category": "health_household",
    "regular_price": 15.99,
    "sale_price": 9.99,
    "stock_qty": 90,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2200,
    "attributes": {
      "Brand": "OXO",
      "Guard": "Die-Cast Zinc Thumb Guard",
      "Wheel": "4-inch Stainless Steel"
    },
    "image": "/uploads/OXO_Good_Grips_Stainless_Steel_Wheel_Pizza_Slicer_Cutter-1790946698495-993308.jfif"
  },
  {
    "id": 92,
    "sku": "SO-HLTH-17",
    "title": "Stanley Quencher FlowState Replacement Straws 4-Pack",
    "category": "health_household",
    "regular_price": 12.99,
    "sale_price": 7.85,
    "stock_qty": 150,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.9,
    "reviews_count": 4800,
    "attributes": {
      "Fits": "30oz & 40oz Tumblers",
      "Brand": "Stanley",
      "Material": "BPA-Free Reusable"
    },
    "image": "/uploads/Stanley_Quencher_FlowState_Replacement_Straws_4-Pack-1790946800791-156631.webp"
  },
  {
    "id": 93,
    "sku": "SO-HLTH-18",
    "title": "Stanley Classic Vacuum Camp Mug 12oz Stainless Steel",
    "category": "health_household",
    "regular_price": 28,
    "sale_price": 23,
    "stock_qty": 85,
    "is_flash_sale": true,
    "sold_percent": 83,
    "rating": 4.8,
    "reviews_count": 3600,
    "attributes": {
      "Brand": "Stanley",
      "Capacity": "12 oz (350ml)",
      "Insulation": "Double Wall Vacuum"
    },
    "image": "/uploads/Stanley_Classic_Vacuum_Camp_Mug_12oz_Stainless_Steel-1790946944896-779492.jpg"
  },
  {
    "id": 94,
    "sku": "SO-HLTH-19",
    "title": "Stanley Adventure Nesting Shot Glass Set Stainless Steel",
    "category": "health_household",
    "regular_price": 26.99,
    "sale_price": 21.99,
    "stock_qty": 70,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1400,
    "attributes": {
      "Set": "4 Shot Glasses + Case",
      "Brand": "Stanley",
      "Travel": "Steel Carrying Case"
    },
    "image": "/uploads/Stanley_Adventure_Nesting_Shot_Glass_Set_Stainless_Steel-1790947028753-802225.jpg"
  },
  {
    "id": 95,
    "sku": "SO-HLTH-20",
    "title": "Stanley IceFlow Flip Straw Replacement Lid Assembly",
    "category": "health_household",
    "regular_price": 18,
    "sale_price": 14.5,
    "stock_qty": 90,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1850,
    "attributes": {
      "Lid": "Leakproof Flip Straw",
      "Fits": "IceFlow Jugs & Tumblers",
      "Brand": "Stanley"
    },
    "image": "/uploads/Stanley_IceFlow_Flip_Straw_Replacement_Lid_Assembly-1790947180449-520858.jpg"
  },
  {
    "id": 96,
    "sku": "SO-HLTH-21",
    "title": "Stanley Classic Stay-Chill Beer Pint Glass 16oz",
    "category": "health_household",
    "regular_price": 25,
    "sale_price": 20,
    "stock_qty": 80,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 2200,
    "attributes": {
      "Cold": "Stays Cold 4 Hours",
      "Size": "16 oz (473ml)",
      "Brand": "Stanley"
    },
    "image": "/uploads/Stanley_Classic_Stay-Chill_Beer_Pint_Glass_16oz-1790947253812-716187.jpg"
  },
  {
    "id": 97,
    "sku": "SO-HLTH-22",
    "title": "Levoit Core 300 Replacement Filter True HEPA 3-in-1",
    "category": "health_household",
    "regular_price": 29.99,
    "sale_price": 25.99,
    "stock_qty": 95,
    "is_flash_sale": true,
    "sold_percent": 86,
    "rating": 4.8,
    "reviews_count": 6100,
    "attributes": {
      "Fits": "Levoit Core 300 Series",
      "Brand": "Levoit",
      "Filter": "H13 True HEPA"
    },
    "image": "/uploads/Levoit_Core_300_Replacement_Filter_True_HEPA_3-in-1-1790947626224-600306.jpg"
  },
  {
    "id": 98,
    "sku": "SO-HLTH-23",
    "title": "Levoit Core Mini Air Purifier Replacement Filters 2-Pack",
    "category": "health_household",
    "regular_price": 59.99,
    "sale_price": 45.99,
    "stock_qty": 110,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3400,
    "attributes": {
      "Pack": "2 Genuine Filters",
      "Brand": "Levoit",
      "Target": "Dust & Pet Dander"
    },
    "image": "/uploads/Levoit_Core_Mini_Air_Purifier_Replacement_Filters_2-Pack-1790947788102-523327.jpg"
  },
  {
    "id": 99,
    "sku": "SO-HLTH-24",
    "title": "Levoit Aroma Replacement Pads for Humidifiers 12-Pack",
    "category": "health_household",
    "regular_price": 15.99,
    "sale_price": 11.99,
    "stock_qty": 140,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1750,
    "attributes": {
      "Fits": "Levoit Humidifiers",
      "Pads": "12 Essential Oil Pads",
      "Brand": "Levoit"
    },
    "image": "/uploads/Levoit_Aroma_Replacement_Pads_for_Humidifiers_12-Pack-1790947915958-256708.webp"
  },
  {
    "id": 100,
    "sku": "SO-HLTH-25",
    "title": "Levoit Humidifier Demineralization Mineral Cartridges 10-Pack",
    "category": "health_household",
    "regular_price": 19.99,
    "sale_price": 15.99,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1200,
    "attributes": {
      "Pack": "10 Cartridges",
      "Brand": "Levoit",
      "Benefit": "Prevents White Dust Build"
    },
    "image": "/uploads/Levoit_Humidifier_Demineralization_Mineral_Cartridges_10-Pack-1790947980366-929870.jpg"
  },
  {
    "id": 101,
    "sku": "SO-PET-01",
    "title": "Purina Pro Plan High Protein Adult Dog Shredded Blend 6 Lb",
    "category": "pet_supplies",
    "regular_price": 18.99,
    "sale_price": 15.99,
    "stock_qty": 100,
    "is_flash_sale": false,
    "sold_percent": 88,
    "rating": 4.8,
    "reviews_count": 4500,
    "attributes": {
      "Brand": "Purina",
      "Flavor": "Chicken & Rice",
      "Weight": "6 Lbs (2.7kg)"
    },
    "image": "/uploads/Purina_Pro_Plan_High_Protein_Adult_Dog_Shredded_Blend_6_Lb-1790948249626-417102.jpg"
  },
  {
    "id": 102,
    "sku": "SO-PET-02",
    "title": "Purina ONE SmartBlend Natural Dry Cat Food Salmon 7 Lb",
    "category": "pet_supplies",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 110,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3600,
    "attributes": {
      "Brand": "Purina",
      "Weight": "7 Lbs",
      "Protein": "Real Salmon #1"
    },
    "image": "/uploads/Purina_ONE_SmartBlend_Natural_Dry_Cat_Food_Salmon_7_Lb-1790948410469-605804.jpg"
  },
  {
    "id": 103,
    "sku": "SO-PET-03",
    "title": "Purina Dentalife Daily Oral Care Dog Chews Large 40 Count",
    "category": "pet_supplies",
    "regular_price": 19.99,
    "sale_price": 14.99,
    "stock_qty": 125,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2900,
    "attributes": {
      "Brand": "Purina",
      "Count": "40 Large Chews",
      "Dental": "Reduces Tartar Build"
    },
    "image": "/uploads/Purina_Dentalife_Daily_Oral_Care_Dog_Chews_Large_40_Count-1790948588467-646257.jpg"
  },
  {
    "id": 104,
    "sku": "SO-PET-04",
    "title": "Purina Beggin Strips Real Bacon Dog Treats 25oz Bag",
    "category": "pet_supplies",
    "regular_price": 16.99,
    "sale_price": 12.99,
    "stock_qty": 140,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 5200,
    "attributes": {
      "Meat": "Real Bacon Flavor",
      "Brand": "Purina",
      "Weight": "25 oz Pouch"
    },
    "image": "/uploads/Purina_Beggin_Strips_Real_Bacon_Dog_Treats_25oz_Bag_jp-1791011226562-523940.webp"
  },
  {
    "id": 105,
    "sku": "SO-PET-05",
    "title": "Purina Friskies Wet Cat Food Variety Pack 24 Cans",
    "category": "pet_supplies",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 90,
    "is_flash_sale": true,
    "sold_percent": 79,
    "rating": 4.7,
    "reviews_count": 4100,
    "attributes": {
      "Brand": "Purina",
      "Gravy": "Meaty Bits in Gravy",
      "Meals": "24x 5.5oz Cans"
    },
    "image": "/uploads/Purina_Friskies_Wet_Cat_Food_Variety_Pack_24_Cans-1791011286437-632018.jpg"
  },
  {
    "id": 106,
    "sku": "SO-PET-06",
    "title": "Purina Busy Bone Long-Lasting Chew Dog Treats 10 Count",
    "category": "pet_supplies",
    "regular_price": 15.99,
    "sale_price": 11.99,
    "stock_qty": 115,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2300,
    "attributes": {
      "Brand": "Purina",
      "Count": "10 Medium/Large Bones",
      "Center": "Real Meat Center"
    },
    "image": "/uploads/Purina_Busy_Bone_Long-Lasting_Chew_Dog_Treats_10_Count-1791011335623-597372.jpg"
  },
  {
    "id": 107,
    "sku": "SO-PET-07",
    "title": "Purina Tidy Cats Clumping Litter 20 Lb Jug Low Dust",
    "category": "pet_supplies",
    "regular_price": 21.99,
    "sale_price": 16.99,
    "stock_qty": 85,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 3800,
    "attributes": {
      "Odor": "24/7 Performance Odor",
      "Brand": "Purina",
      "Weight": "20 Lbs"
    },
    "image": "/uploads/Purina_Tidy_Cats_Clumping_Litter_20_Lb_Jug_Low_Dust-1791011381006-395592.jfif"
  },
  {
    "id": 108,
    "sku": "SO-PET-08",
    "title": "Purina Fancy Feast Gourmet Wet Cat Food 12 Cans Salmon",
    "category": "pet_supplies",
    "regular_price": 19.99,
    "sale_price": 14.49,
    "stock_qty": 95,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 2700,
    "attributes": {
      "Brand": "Purina",
      "Count": "12x 3oz Cans",
      "Gourmet": "Grilled Salmon Feast"
    },
    "image": "/uploads/Purina_Fancy_Feast_Gourmet_Wet_Cat_Food_12_Cans_Salmon-1791011465295-110442.jfif"
  },
  {
    "id": 109,
    "sku": "SO-PET-09",
    "title": "Purina Pro Plan Veterinary Diets FortiFlora Probiotics 30 Pack",
    "category": "pet_supplies",
    "regular_price": 29.99,
    "sale_price": 28.99,
    "stock_qty": 70,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.9,
    "reviews_count": 3400,
    "attributes": {
      "Gut": "Digestive Health Powder",
      "Brand": "Purina",
      "Count": "30 Sachets"
    },
    "image": "/uploads/Purina_Pro_Plan_Veterinary_Diets_FortiFlora_Probiotics_30_Pack-1791011538466-947413.jfif"
  },
  {
    "id": 110,
    "sku": "SO-PET-10",
    "title": "KONG Classic Durable Natural Rubber Dog Chew Toy Large",
    "category": "pet_supplies",
    "regular_price": 18.99,
    "sale_price": 14.99,
    "stock_qty": 130,
    "is_flash_sale": true,
    "sold_percent": 84,
    "rating": 4.8,
    "reviews_count": 6800,
    "attributes": {
      "Size": "Large (30-65 lbs)",
      "Brand": "KONG",
      "Rubber": "All-Natural Red Rubber"
    },
    "image": "/uploads/KONG_Classic_Durable_Natural_Rubber_Dog_Chew_Toy_Large-1791011629936-654527.jfif"
  },
  {
    "id": 111,
    "sku": "SO-PET-11",
    "title": "KONG Extreme Tough Black Rubber Dog Toy for Power Chewers",
    "category": "pet_supplies",
    "regular_price": 22.99,
    "sale_price": 17.99,
    "stock_qty": 110,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 4200,
    "attributes": {
      "Size": "Large",
      "Brand": "KONG",
      "Strength": "Ultra-Durable Black Formula"
    },
    "image": "/uploads/KONG_Extreme_Tough_Black_Rubber_Dog_Toy_for_Power_Chewers-1791011749647-841502.webp"
  },
  {
    "id": 112,
    "sku": "SO-PET-12",
    "title": "KONG Easy Treat Real Peanut Butter Recipe Paste 8oz Can",
    "category": "pet_supplies",
    "regular_price": 13.99,
    "sale_price": 10.99,
    "stock_qty": 140,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 3100,
    "attributes": {
      "Brand": "KONG",
      "Flavor": "Peanut Butter Paste",
      "Dispenser": "No-Mess Nozzle"
    },
    "image": "/uploads/KONG_Easy_Treat_Real_Peanut_Butter_Recipe_Paste_8oz_Can-1791011827983-109314.webp"
  },
  {
    "id": 113,
    "sku": "SO-PET-13",
    "title": "KONG Cozie Marvin the Moose Plush Squeaky Dog Toy",
    "category": "pet_supplies",
    "regular_price": 14.99,
    "sale_price": 11.49,
    "stock_qty": 115,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 5100,
    "attributes": {
      "Brand": "KONG",
      "Layer": "Extra Layer of Material",
      "Sound": "Internal Squeaker"
    },
    "image": "/uploads/KONG_Cozie_Marvin_the_Moose_Plush_Squeaky_Dog_Toy-1791011874928-910331.jfif"
  },
  {
    "id": 114,
    "sku": "SO-PET-14",
    "title": "KONG Wobbler Interactive Treat Dispensing Dog Toy Large",
    "category": "pet_supplies",
    "regular_price": 27.99,
    "sale_price": 21.99,
    "stock_qty": 75,
    "is_flash_sale": true,
    "sold_percent": 76,
    "rating": 4.7,
    "reviews_count": 3800,
    "attributes": {
      "Brand": "KONG",
      "Feeder": "Action Slow Feeder",
      "Dishwasher": "Top Rack Safe"
    },
    "image": "/uploads/KONG_Wobbler_Interactive_Treat_Dispensing_Dog_Toy_Large-1791011920654-336721.jfif"
  },
  {
    "id": 115,
    "sku": "SO-PET-15",
    "title": "KONG Wild Knots Internal Knotted Ropes Bear Dog Toy",
    "category": "pet_supplies",
    "regular_price": 16.99,
    "sale_price": 12.99,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2400,
    "attributes": {
      "Core": "Knotted Skeleton Rope",
      "Brand": "KONG",
      "Stuffing": "Minimal Stuffing"
    },
    "image": "/uploads/KONG_Wild_Knots_Internal_Knotted_Ropes_Bear_Dog_Toy-1791011960299-434261.jfif"
  },
  {
    "id": 116,
    "sku": "SO-PET-16",
    "title": "KONG Squeezz Durable Squeaking Action Ball Large 2-Pack",
    "category": "pet_supplies",
    "regular_price": 15.99,
    "sale_price": 12.49,
    "stock_qty": 100,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1900,
    "attributes": {
      "Pack": "2 Large Balls",
      "Brand": "KONG",
      "Bounce": "Recessed Squeaker"
    },
    "image": "/uploads/KONG_Squeezz_Durable_Squeaking_Action_Ball_Large_2-Pack-1791011996137-27797.jfif"
  },
  {
    "id": 117,
    "sku": "SO-PET-17",
    "title": "KONG Puppy Soft Natural Teething Rubber Toy Medium",
    "category": "pet_supplies",
    "regular_price": 14.99,
    "sale_price": 11.99,
    "stock_qty": 105,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3600,
    "attributes": {
      "Gums": "Soothes Sore Gums",
      "Brand": "KONG",
      "Teething": "Customized Puppy Rubber"
    },
    "image": "/uploads/KONG_Puppy_Soft_Natural_Teething_Rubber_Toy_Medium-1791012143995-753988.jfif"
  },
  {
    "id": 118,
    "sku": "SO-PET-18",
    "title": "Blue Buffalo Life Protection Natural Adult Dog Food Chicken 5 Lb",
    "category": "pet_supplies",
    "regular_price": 25.99,
    "sale_price": 21.99,
    "stock_qty": 85,
    "is_flash_sale": true,
    "sold_percent": 81,
    "rating": 4.8,
    "reviews_count": 4200,
    "attributes": {
      "Brand": "Blue Buffalo",
      "Weight": "5 Lbs (2.2kg)",
      "Protein": "Real Deboned Chicken"
    },
    "image": "/uploads/Blue_Buffalo_Life_Protection_Natural_Adult_Dog_Food_Chicken_5_Lb-1791012198713-109573.jfif"
  },
  {
    "id": 119,
    "sku": "SO-PET-19",
    "title": "Blue Buffalo Wilderness High Protein Grain Free Cat Food 5 Lb",
    "category": "pet_supplies",
    "regular_price": 28.99,
    "sale_price": 24.99,
    "stock_qty": 70,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 2900,
    "attributes": {
      "Brand": "Blue Buffalo",
      "Grain": "100% Grain Free",
      "Recipe": "Chicken Recipe"
    },
    "image": "/uploads/Blue_Buffalo_Wilderness_High_Protein_Grain_Free_Cat_Food_5_Lb-1791012245502-779257.jfif"
  },
  {
    "id": 120,
    "sku": "SO-PET-20",
    "title": "Blue Buffalo Health Bars Crunchy Dog Biscuits Bacon & Cheese 16oz",
    "category": "pet_supplies",
    "regular_price": 13.99,
    "sale_price": 10.99,
    "stock_qty": 120,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 3100,
    "attributes": {
      "Oats": "Wholesome Whole Grains",
      "Brand": "Blue Buffalo",
      "Weight": "16 oz (453g)"
    },
    "image": "/uploads/Blue_Buffalo_Health_Bars_Crunchy_Dog_Biscuits_Bacon___Cheese_16oz-1791012291657-779567.jfif"
  },
  {
    "id": 121,
    "sku": "SO-PET-21",
    "title": "Blue Buffalo Blue Bits Soft-Moist Training Dog Treats Beef 11oz",
    "category": "pet_supplies",
    "regular_price": 15.99,
    "sale_price": 11.99,
    "stock_qty": 110,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2600,
    "attributes": {
      "Brand": "Blue Buffalo",
      "Treats": "DHA Support Training Bits",
      "RealMeat": "Real Beef #1"
    },
    "image": "/uploads/Blue_Buffalo_Blue_Bits_Soft-Moist_Training_Dog_Treats_Beef_11oz-1791012342874-755431.jfif"
  },
  {
    "id": 122,
    "sku": "SO-PET-22",
    "title": "Blue Buffalo Tastefuls Natural Wet Cat Food Variety 12 Cans",
    "category": "pet_supplies",
    "regular_price": 22.99,
    "sale_price": 17.99,
    "stock_qty": 90,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1800,
    "attributes": {
      "Brand": "Blue Buffalo",
      "Count": "12x 3oz Cans",
      "Pâté": "Smooth Chicken & Turkey"
    },
    "image": "/uploads/Blue_Buffalo_Tastefuls_Natural_Wet_Cat_Food_Variety_12_Cans-1791012417771-557962.jpg"
  },
  {
    "id": 123,
    "sku": "SO-PET-23",
    "title": "Blue Buffalo Sizzlers Real Pork Bacon-Style Dog Treats 15oz",
    "category": "pet_supplies",
    "regular_price": 16.99,
    "sale_price": 12.99,
    "stock_qty": 100,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.6,
    "reviews_count": 1400,
    "attributes": {
      "Pork": "USA Farm-Raised Pork",
      "Brand": "Blue Buffalo",
      "Texture": "Chewy Bacon Strips"
    },
    "image": "/uploads/Blue_Buffalo_Sizzlers_Real_Pork_Bacon-Style_Dog_Treats_15oz-1791012536493-841871.jpg"
  },
  {
    "id": 124,
    "sku": "SO-PET-24",
    "title": "Blue Buffalo Homestyle Recipe Natural Wet Dog Food 6 Cans",
    "category": "pet_supplies",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 80,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 2100,
    "attributes": {
      "Brand": "Blue Buffalo",
      "Count": "6x 12.5oz Cans",
      "Entree": "Chicken Dinner with Veggies"
    },
    "image": "/uploads/Blue_Buffalo_Homestyle_Recipe_Natural_Wet_Dog_Food_6_Cans-1791012584081-216573.jfif"
  },
  {
    "id": 125,
    "sku": "SO-PET-25",
    "title": "Blue Buffalo Dental Bones All-Natural Dental Chews Regular 12 Count",
    "category": "pet_supplies",
    "regular_price": 19.99,
    "sale_price": 15.49,
    "stock_qty": 95,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1650,
    "attributes": {
      "Brand": "Blue Buffalo",
      "Count": "12 Regular Bones",
      "Teeth": "Cleans Teeth Freshens Breath"
    },
    "image": "/uploads/Blue_Buffalo_Dental_Bones_All-Natural_Dental_Chews_Regular_12_Count-1791012633927-490300.jfif"
  },
  {
    "id": 126,
    "sku": "SO-TOY-01",
    "title": "LEGO Creator 3-in-1 Exotic Parrot Building Toy Set 31136",
    "category": "toys_games_baby",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 110,
    "is_flash_sale": true,
    "sold_percent": 85,
    "rating": 4.9,
    "reviews_count": 4200,
    "attributes": {
      "Brand": "LEGO",
      "Models": "Parrot, Fish & Frog",
      "Pieces": "253 Pieces"
    },
    "image": "/uploads/LEGO_Creator_3-in-1_Exotic_Parrot_Building_Toy_Set_31136-1791037402318-212614.jpg"
  },
  {
    "id": 127,
    "sku": "SO-TOY-02",
    "title": "LEGO Speed Champions Pagani Utopia Hypercar Race Car 76915",
    "category": "toys_games_baby",
    "regular_price": 26.99,
    "sale_price": 21.99,
    "stock_qty": 90,
    "is_flash_sale": true,
    "sold_percent": 78,
    "rating": 4.9,
    "reviews_count": 3600,
    "attributes": {
      "Brand": "LEGO",
      "Pieces": "249 Pieces + Minifigure",
      "Series": "Speed Champions"
    },
    "image": "/uploads/LEGO_Speed_Champions_Pagani_Utopia_Hypercar_Race_Car_76915-1791037629947-110335.jpg"
  },
  {
    "id": 128,
    "sku": "SO-TOY-03",
    "title": "LEGO City Fire Rescue Helicopter Building Toy Set 60281",
    "category": "toys_games_baby",
    "regular_price": 22.99,
    "sale_price": 17.99,
    "stock_qty": 100,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 2100,
    "attributes": {
      "Brand": "LEGO",
      "Theme": "LEGO City Emergency",
      "Pieces": "212 Pieces"
    },
    "image": "/uploads/LEGO_City_Fire_Rescue_Helicopter_Building_Toy_Set_60281-1791037865546-192927.jpg"
  },
  {
    "id": 129,
    "sku": "SO-TOY-04",
    "title": "LEGO Classic Medium Creative Brick Box Construction Set 10696",
    "category": "toys_games_baby",
    "regular_price": 29.99,
    "sale_price": 23.99,
    "stock_qty": 75,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.9,
    "reviews_count": 500,
    "attributes": {
      "Brand": "LEGO",
      "Bricks": "484 Colorful Pieces",
      "Storage": "Plastic Storage Box"
    },
    "image": "/uploads/2445_S_Hiawassee_Rd-1791038398562-878610.jpg"
  },
  {
    "id": 130,
    "sku": "SO-TOY-05",
    "title": "LEGO Star Wars 501st Clone Troopers Battle Pack 75345",
    "category": "toys_games_baby",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 95,
    "is_flash_sale": true,
    "sold_percent": 0,
    "rating": 4.9,
    "reviews_count": 4800,
    "attributes": {
      "Brand": "LEGO",
      "Cannon": "AV-7 Anti-Vehicle Cannon",
      "Figures": "4 Star Wars Minifigures"
    },
    "image": "/uploads/LEGO_Star_Wars_501st_Clone_Troopers_Battle_Pack_75345-1791038668441-89335.jpg"
  },
  {
    "id": 131,
    "sku": "SO-TOY-06",
    "title": "LEGO Marvel Spider-Man Car and Doc Ock Showdown 10789",
    "category": "toys_games_baby",
    "regular_price": 14.99,
    "sale_price": 11.99,
    "stock_qty": 120,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 1950,
    "attributes": {
      "Age": "Ages 4+",
      "Brand": "LEGO",
      "Pieces": "48 Large Starter Pieces"
    },
    "image": "/uploads/LEGO_Marvel_Spider-Man_Car_and_Doc_Ock_Showdown_10789-1791038822664-372523.jpg"
  },
  {
    "id": 132,
    "sku": "SO-TOY-07",
    "title": "LEGO Minecraft The Swamp Adventure Zombie Action Set 21240",
    "category": "toys_games_baby",
    "regular_price": 15.99,
    "sale_price": 12.99,
    "stock_qty": 115,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3100,
    "attributes": {
      "Game": "Minecraft Authentic Biome",
      "Brand": "LEGO",
      "Figures": "Alex & Zombie"
    },
    "image": "/uploads/LEGO_Minecraft_The_Swamp_Adventure_Zombie_Action_Set_21240-1791038885237-567955.jpg"
  },
  {
    "id": 133,
    "sku": "SO-TOY-08",
    "title": "LEGO Disney Princess Twirling Rapunzel Music Box 43214",
    "category": "toys_games_baby",
    "regular_price": 14.99,
    "sale_price": 11.99,
    "stock_qty": 105,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1600,
    "attributes": {
      "Brand": "LEGO",
      "Dress": "Diamond Dress Stand",
      "Character": "Rapunzel & Pascal"
    },
    "image": "/uploads/LEGO_Disney_Princess_Twirling_Rapunzel_Music_Box_43214-1791038937560-513642.jpg"
  },
  {
    "id": 134,
    "sku": "SO-TOY-09",
    "title": "LEGO Technic Monster Jam Megalodon Pull-Back Truck 42134",
    "category": "toys_games_baby",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 85,
    "is_flash_sale": true,
    "sold_percent": 70,
    "rating": 4.8,
    "reviews_count": 2400,
    "attributes": {
      "Brand": "LEGO",
      "Build": "2-in-1 Lusca Racer",
      "Mechanism": "Pull-Back Action Motor"
    },
    "image": "/uploads/LEGO_Technic_Monster_Jam_Megalodon_Pull-Back_Truck_42134-1791039270345-808088.jfif"
  },
  {
    "id": 135,
    "sku": "SO-TOY-10",
    "title": "Hasbro Gaming Classic Monopoly Family Board Game",
    "category": "toys_games_baby",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 90,
    "is_flash_sale": true,
    "sold_percent": 82,
    "rating": 4.8,
    "reviews_count": 6500,
    "attributes": {
      "Brand": "Hasbro",
      "Edition": "Classic 8 Tokens",
      "Players": "2 to 6 Players"
    },
    "image": "/uploads/Hasbro_Gaming_Classic_Monopoly_Family_Board_Game-1791039634323-825863.jfif"
  },
  {
    "id": 136,
    "sku": "SO-TOY-11",
    "title": "Hasbro Gaming Connect 4 Classic Grid Strategy Disc Game",
    "category": "toys_games_baby",
    "regular_price": 15.99,
    "sale_price": 11.99,
    "stock_qty": 130,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 7200,
    "attributes": {
      "Age": "Ages 6 and up",
      "Brand": "Hasbro",
      "Discs": "42 Red & Gold Discs"
    },
    "image": "/uploads/Hasbro_Gaming_Connect_4_Classic_Grid_Strategy_Disc_Game-1791039698551-315150.jfif"
  },
  {
    "id": 137,
    "sku": "SO-TOY-12",
    "title": "Hasbro Gaming Jenga Classic Wooden Block Stacking Game",
    "category": "toys_games_baby",
    "regular_price": 19.99,
    "sale_price": 15.99,
    "stock_qty": 110,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.9,
    "reviews_count": 8100,
    "attributes": {
      "Wood": "54 Precision Hardwood Blocks",
      "Brand": "Hasbro",
      "Stacking": "Tower Sleeve Included"
    },
    "image": "/uploads/Hasbro_Gaming_Jenga_Classic_Wooden_Block_Stacking_Game-1791039847893-968552.jfif"
  },
  {
    "id": 138,
    "sku": "SO-TOY-13",
    "title": "Hasbro Gaming Clue Classic Mystery Suspense Board Game",
    "category": "toys_games_baby",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 85,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 3900,
    "attributes": {
      "Brand": "Hasbro",
      "Mystery": "Mansion Crime Investigation",
      "Players": "2 to 6 Players"
    },
    "image": "/uploads/Hasbro_Gaming_Clue_Classic_Mystery_Suspense_Board_Game-1791039937289-23708.jpg"
  },
  {
    "id": 139,
    "sku": "SO-TOY-14",
    "title": "Hasbro Play-Doh Modeling Compound Starter Colors 10-Pack",
    "category": "toys_games_baby",
    "regular_price": 14.99,
    "sale_price": 10.99,
    "stock_qty": 150,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 5900,
    "attributes": {
      "Cans": "10x 2oz Cans",
      "Safe": "Non-Toxic Dough",
      "Brand": "Hasbro"
    },
    "image": "/uploads/Hasbro_Play-Doh_Modeling_Compound_Starter_Colors_10-Pack-1791040005286-1847.jfif"
  },
  {
    "id": 140,
    "sku": "SO-TOY-15",
    "title": "Hasbro Nerf Elite 2.0 Commander RD-6 Dart Blaster 12 Darts",
    "category": "toys_games_baby",
    "regular_price": 18.99,
    "sale_price": 14.99,
    "stock_qty": 95,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 4200,
    "attributes": {
      "Drum": "6-Dart Rotating Drum",
      "Brand": "Hasbro",
      "Distance": "Fires up to 90 Feet"
    },
    "image": "/uploads/Hasbro_Nerf_Elite_2_0_Commander_RD-6_Dart_Blaster_12_Darts-1791040068965-771218.jfif"
  },
  {
    "id": 141,
    "sku": "SO-TOY-16",
    "title": "Hasbro Gaming Yahtzee Classic Dice Rolling Family Game",
    "category": "toys_games_baby",
    "regular_price": 14.99,
    "sale_price": 10.99,
    "stock_qty": 125,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 4800,
    "attributes": {
      "Dice": "5 Dice + Rolling Cup",
      "Brand": "Hasbro",
      "Scoresheet": "Score Pads Included"
    },
    "image": "/uploads/Hasbro_Gaming_Yahtzee_Classic_Dice_Rolling_Family_Game-1791040129183-585334.jfif"
  },
  {
    "id": 142,
    "sku": "SO-TOY-17",
    "title": "Hasbro Gaming Operation Electronic Classic Board Game",
    "category": "toys_games_baby",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 80,
    "is_flash_sale": true,
    "sold_percent": 75,
    "rating": 4.6,
    "reviews_count": 3100,
    "attributes": {
      "Brand": "Hasbro",
      "Buzzer": "Light-Up Red Nose Buzzer",
      "Pieces": "12 Cavity Ailments"
    },
    "image": "/uploads/Hasbro_Gaming_Operation_Electronic_Classic_Board_Game-1791040219079-816461.webp"
  },
  {
    "id": 143,
    "sku": "SO-TOY-18",
    "title": "Mattel Games UNO Classic Card Game with Wild Custom Cards",
    "category": "toys_games_baby",
    "regular_price": 13.99,
    "sale_price": 10.49,
    "stock_qty": 180,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.9,
    "reviews_count": 9800,
    "attributes": {
      "Brand": "Mattel",
      "Cards": "112 Cards in Deck",
      "Players": "2 to 10 Players"
    },
    "image": "/uploads/Mattel_Games_UNO_Classic_Card_Game_with_Wild_Custom_Cards-1791040282878-316469.jpg"
  },
  {
    "id": 144,
    "sku": "SO-TOY-19",
    "title": "Mattel Hot Wheels 1:64 Scale Die-Cast Toy Cars 10-Pack Box",
    "category": "toys_games_baby",
    "regular_price": 19.99,
    "sale_price": 15.99,
    "stock_qty": 140,
    "is_flash_sale": true,
    "sold_percent": 88,
    "rating": 4.9,
    "reviews_count": 7400,
    "attributes": {
      "Brand": "Mattel",
      "Scale": "1:64 Scale",
      "Vehicles": "10 Authentic Die-Cast Cars"
    },
    "image": "/uploads/819aqrlr8qL__AC_-1791040508509-964231.jpg"
  },
  {
    "id": 145,
    "sku": "SO-TOY-20",
    "title": "Mattel Games Phase 10 Rummy-Style Challenging Card Game",
    "category": "toys_games_baby",
    "regular_price": 14.99,
    "sale_price": 10.99,
    "stock_qty": 135,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 5200,
    "attributes": {
      "Brand": "Mattel",
      "Rounds": "10 Varied Phases",
      "Players": "2 to 6 Players"
    },
    "image": "/uploads/Mattel_Games_Phase_10_Rummy-Style_Challenging_Card_Game-1791040559009-54575.jfif"
  },
  {
    "id": 146,
    "sku": "SO-TOY-21",
    "title": "Mattel Barbie Fashionistas Doll with Trendy Floral Dress",
    "category": "toys_games_baby",
    "regular_price": 15.99,
    "sale_price": 11.99,
    "stock_qty": 110,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3600,
    "attributes": {
      "Doll": "Authentic Barbie Doll",
      "Brand": "Mattel",
      "Outfit": "Dress, Shoes & Sunglasses"
    },
    "image": "/uploads/Mattel_Barbie_Fashionistas_Doll_with_Trendy_Floral_Dress-1791040636520-574997.jpg"
  },
  {
    "id": 147,
    "sku": "SO-TOY-22",
    "title": "Mattel Games Skip-Bo Sequencing Card Family Game",
    "category": "toys_games_baby",
    "regular_price": 14.99,
    "sale_price": 10.99,
    "stock_qty": 120,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 4400,
    "attributes": {
      "Age": "Ages 7 and older",
      "Brand": "Mattel",
      "Decks": "162 Cards Total"
    },
    "image": "/uploads/Mattel_Games_Skip-Bo_Sequencing_Card_Family_Game-1791040676670-975444.jpg"
  },
  {
    "id": 148,
    "sku": "SO-TOY-23",
    "title": "Mattel Hot Wheels Track Builder Unlimited Straight Track Pack",
    "category": "toys_games_baby",
    "regular_price": 16.99,
    "sale_price": 12.99,
    "stock_qty": 95,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 2800,
    "attributes": {
      "Brand": "Mattel",
      "Track": "12 Feet of Orange Track",
      "Connectors": "Included Track Connectors"
    },
    "image": "/uploads/Mattel_Hot_Wheels_Track_Builder_Unlimited_Straight_Track_Pack-1791040717451-868765.jpg"
  },
  {
    "id": 149,
    "sku": "SO-TOY-24",
    "title": "Mattel Fisher-Price Rock-a-Stack Classic Stacking Toy Rings",
    "category": "toys_games_baby",
    "regular_price": 13.99,
    "sale_price": 10.99,
    "stock_qty": 130,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.9,
    "reviews_count": 6700,
    "attributes": {
      "Base": "Bat-at Rocker Base",
      "Brand": "Mattel",
      "Rings": "5 Colorful Grasp Rings"
    },
    "image": "/uploads/Mattel_Fisher-Price_Rock-a-Stack_Classic_Stacking_Toy_Rings-1791040768255-22431.jpg"
  },
  {
    "id": 150,
    "sku": "SO-TOY-25",
    "title": "Mattel Games Blokus Fast-Paced Strategy Geometry Board Game",
    "category": "toys_games_baby",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 85,
    "is_flash_sale": true,
    "sold_percent": 74,
    "rating": 4.8,
    "reviews_count": 3900,
    "attributes": {
      "Brand": "Mattel",
      "Pieces": "84 Colored Game Pieces",
      "Strategy": "Tile Placement Game"
    },
    "image": "/uploads/Mattel_Games_Blokus_Fast-Paced_Strategy_Geometry_Board_Game-1791040826660-228529.jpg"
  },
  {
    "id": 151,
    "sku": "SO-APPL-WATCH",
    "title": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Rugged Case",
    "category": "electronics",
    "regular_price": 29.99,
    "sale_price": 26.99,
    "stock_qty": 45,
    "is_flash_sale": true,
    "sold_percent": 82,
    "rating": 4.9,
    "reviews_count": 2450,
    "attributes": {
      "Brand": "Apple",
      "Display": "49mm OLED",
      "Connectivity": "Cellular + GPS"
    },
    "image": "/apple_watch_ultra_2.jpg"
  },
  {
    "id": 152,
    "sku": "SO-APPL-AIRPODS",
    "title": "Apple AirPods Pro 2 Wireless Earbuds with MagSafe Case USB-C",
    "category": "electronics",
    "regular_price": 29.99,
    "sale_price": 24.99,
    "stock_qty": 60,
    "is_flash_sale": true,
    "sold_percent": 74,
    "rating": 4.8,
    "reviews_count": 1890,
    "attributes": {
      "Brand": "Apple",
      "Sound": "Active Noise Cancelling",
      "Battery": "30H Playtime"
    },
    "image": "/elec_earbuds.png"
  },
  {
    "id": 153,
    "sku": "SO-APPL-CHARGER",
    "title": "Apple 20W USB-C Power Adapter Fast Wall Charging Block",
    "category": "electronics",
    "regular_price": 22.99,
    "sale_price": 19,
    "stock_qty": 90,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 3100,
    "attributes": {
      "Brand": "Apple",
      "Wattage": "20W Fast Charge",
      "Connector": "USB Type-C"
    },
    "image": "/usb_cable.png"
  },
  {
    "id": 154,
    "sku": "SO-APPL-MAGSAFE",
    "title": "Apple MagSafe Fast Wireless Charger Pad 15W Qi Compatible",
    "category": "electronics",
    "regular_price": 29.99,
    "sale_price": 27.5,
    "stock_qty": 55,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 980,
    "attributes": {
      "Brand": "Apple",
      "Cable": "1m Integrated",
      "Power": "15W Magnetic Fast Qi"
    },
    "image": "/uploads/Anker_Magnetic_Wireless_Charging_Pad_with_5ft_Cable-1790859557371-863436.jpg"
  },
  {
    "id": 155,
    "sku": "SO-OUD-01",
    "title": "Royal Oud Eau De Parfum Luxury Arabian Spray 100ml / 3.4oz",
    "category": "beauty",
    "regular_price": 29.99,
    "sale_price": 24.99,
    "stock_qty": 70,
    "is_flash_sale": true,
    "sold_percent": 88,
    "rating": 4.9,
    "reviews_count": 1420,
    "attributes": {
      "Brand": "Royal Oud",
      "Notes": "Cambodian Agarwood & Amber",
      "Volume": "100ml EDP"
    },
    "image": "/royal_oud.png"
  },
  {
    "id": 156,
    "sku": "SO-OUD-02",
    "title": "Royal Oud Amber Intense Concentrated Perfume Oil Attar 50ml",
    "category": "beauty",
    "regular_price": 27.99,
    "sale_price": 22.99,
    "stock_qty": 50,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 890,
    "attributes": {
      "Type": "Alcohol-Free Oil",
      "Brand": "Royal Oud",
      "Notes": "Golden Amber & Sandalwood"
    },
    "image": "/royal_oud.png"
  },
  {
    "id": 157,
    "sku": "SO-OUD-03",
    "title": "Royal Oud Velvet Rose & Musk Luxury Body Mist 250ml",
    "category": "beauty",
    "regular_price": 21.99,
    "sale_price": 18.5,
    "stock_qty": 65,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 630,
    "attributes": {
      "Brand": "Royal Oud",
      "Scent": "Taif Rose & White Musk",
      "Sillage": "All-Day Long Lasting"
    },
    "image": "/royal_oud.png"
  },
  {
    "id": 158,
    "sku": "SO-OUD-04",
    "title": "Royal Oud Heritage Elite Smokey Wood Extract 100ml",
    "category": "beauty",
    "regular_price": 29.99,
    "sale_price": 28,
    "stock_qty": 40,
    "is_flash_sale": true,
    "sold_percent": 79,
    "rating": 4.9,
    "reviews_count": 510,
    "attributes": {
      "Brand": "Royal Oud",
      "Origin": "Dubai UAE Formulation",
      "Series": "Elite Heritage Blend"
    },
    "image": "/royal_oud.png"
  },
  {
    "id": 159,
    "sku": "SO-NINJA-01",
    "title": "Ninja AF101 Air Fryer 4-Quart Capacity Crisps and Dehydrates",
    "category": "appliances",
    "regular_price": 29.99,
    "sale_price": 27.99,
    "stock_qty": 65,
    "is_flash_sale": true,
    "sold_percent": 91,
    "rating": 4.9,
    "reviews_count": 4200,
    "attributes": {
      "Brand": "Ninja",
      "Capacity": "4-Quart Ceramic Basket",
      "Temperature": "105°F - 400°F"
    },
    "image": "/air_fryer.png"
  },
  {
    "id": 160,
    "sku": "SO-NINJA-02",
    "title": "Ninja Fit Compact Personal Blender 700W High-Speed Motor",
    "category": "appliances",
    "regular_price": 28.99,
    "sale_price": 23.99,
    "stock_qty": 55,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.8,
    "reviews_count": 2800,
    "attributes": {
      "Cups": "Two 16oz Nutri Ninja Cups",
      "Brand": "Ninja",
      "Motor": "700-Watt Peak Power"
    },
    "image": "/uploads/Hamilton_Beach_Personal_Blender_14oz_Portable_Travel_Cup-1790864571466-272494.jpg"
  },
  {
    "id": 161,
    "sku": "SO-NINJA-03",
    "title": "Ninja Foodi 8-in-1 Digital Air Fry Toaster Oven Bake & Broil",
    "category": "appliances",
    "regular_price": 29.99,
    "sale_price": 28.5,
    "stock_qty": 40,
    "is_flash_sale": true,
    "sold_percent": 85,
    "rating": 4.8,
    "reviews_count": 1750,
    "attributes": {
      "Brand": "Ninja",
      "Storage": "Flips Up to Save Space",
      "Functions": "8-in-1 Digital Air Fry"
    },
    "image": "/uploads/Black_Decker_2-Slice_Compact_Toaster_Bagel_Settings-1790865638682-237531.jpg"
  },
  {
    "id": 162,
    "sku": "SO-NINJA-04",
    "title": "Ninja Express Chop 16oz Compact Food Chopper Mince & Puree",
    "category": "appliances",
    "regular_price": 24.99,
    "sale_price": 19.99,
    "stock_qty": 80,
    "is_flash_sale": false,
    "sold_percent": 0,
    "rating": 4.7,
    "reviews_count": 1620,
    "attributes": {
      "Bowl": "16oz BPA-Free Bowl",
      "Brand": "Ninja",
      "Blades": "4-Blade Quick Prep"
    },
    "image": "/uploads/Black_Decker_1_5-Cup_One-Touch_Electric_Food_Chopper-1790865143124-115727.jpg"
  }
];

const SWIFT_SEED_ORDERS = [];

class SwiftOrbitsEngineApp {
  constructor() {
    try {
      localStorage.removeItem('daraz_orders');
      localStorage.removeItem('daraz_products');
      // Wipe legacy global customer orders key so previous database orders do not appear in visitor's cart
      localStorage.removeItem('swift_customer_orders');
    } catch (e) {}

    this.adminToken = sessionStorage.getItem('swift_admin_token') || null;
    this.adminUser = JSON.parse(sessionStorage.getItem('swift_admin_user') || 'null');

    // Authoritative Server-backed State
    this.products = SWIFT_SEED_PRODUCTS;
    this.adminOrders = []; // Global store orders for Admin ERP
    this.myOrders = this.loadCustomerLocalOrders(); // Visitor's personal cart & placed orders on this PC only
    this.categories = [];
    this.backendHealthy = false;
    this.unreadOrders = [];
    this.activeDetailOrder = null;

    this.userProfile = this.loadState('swift_user_profile', {
      name: 'Johnathan Smith',
      phone: '+1 (555) 019-2834',
      email: 'john.smith@swiftorbits.us',
      address: '742 Evergreen Terrace, Suite 100',
      city: 'Los Angeles',
      state: 'CA',
      prime: true
    });

    this.currentView = 'storefront';
    this.adminSubview = 'inventory';
    this.selectedCategory = 'appliances';
    this.searchQuery = '';

    this.categoryPageFilters = {
      minPrice: null,
      maxPrice: null,
      selectedBrands: [],
      minRating: 0,
      inStockOnly: false,
      sortBy: 'featured'
    };

    this.activeModalProduct = null;
    this.activeTrackedOrder = null;

    // Real Product Rotator State for 4-Quadrant Cards
    const savedSeconds = parseInt(localStorage.getItem('swift_quad_rotation_seconds') || '10', 10);
    this.quadRotationIntervalSeconds = (!isNaN(savedSeconds) && savedSeconds >= 1) ? savedSeconds : 10;
    this.quadRotationEnabled = localStorage.getItem('swift_quad_rotation_enabled') !== 'false';
    this.quadRotationTimer = null;
    this.quadCardIndices = {
      appliances: 0,
      electronics: 0,
      beauty: 0,
      health_household: 0
    };
    this.quadIsHovered = {
      appliances: false,
      electronics: false,
      beauty: false,
      health_household: false
    };

    this.initDOM();
    this.updateUserProfileUI();
    this.startFlashTimer();
    this.bindEvents();
    this.initCategoryPageEvents();
    this.initHashRouting();
    this.renderAll();
    this.initSettings();

    // Connect to PostgreSQL API and Realtime Socket.IO
    this.initSocket();
    this.fetchProducts();
    this.fetchCategories();
    if (this.adminToken) {
      this.loadAdminData();
    }
  }

  // Dual compatibility getter/setter
  get orders() {
    return this.currentView === 'admin' ? this.adminOrders : this.myOrders;
  }
  set orders(val) {
    if (this.currentView === 'admin') {
      this.adminOrders = Array.isArray(val) ? val : [];
    } else {
      this.myOrders = Array.isArray(val) ? val : [];
    }
  }

  loadCustomerLocalOrders() {
    try {
      localStorage.removeItem('swift_customer_orders');
      const saved = localStorage.getItem('swift_my_cart_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Exclude old mock/seed order references
          return parsed.filter(o => o.order_number !== 'SO-US-89104A' && o.order_number !== 'SO-US-44719B');
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  saveCustomerLocalOrders() {
    try {
      localStorage.setItem('swift_my_cart_items', JSON.stringify(this.myOrders));
    } catch (e) {}
  }

  loadState(key, defaultVal) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  saveState() {
    this.saveCustomerLocalOrders();
  }

  initSocket() {
    try {
      this.socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: 15,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        console.log('[Socket.IO] Connected to SwiftOrbits backend realtime engine.');
        if (this.adminToken) {
          this.socket.emit('join:admin');
        }
      });

      this.socket.on('product:created', (product) => {
        console.log('[Socket.IO] Received product:created event:', product);
        const idx = this.products.findIndex(p => p.id === product.id || p.sku === product.sku);
        if (idx === -1) {
          this.products.unshift(product);
        } else {
          this.products[idx] = product;
        }
        this.renderAll();
        if (this.currentView === 'admin') this.renderAdmin();
      });

      this.socket.on('product:updated', (product) => {
        console.log('[Socket.IO] Received product:updated event:', product);
        const idx = this.products.findIndex(p => p.id === product.id || p.sku === product.sku);
        if (idx !== -1) {
          this.products[idx] = { ...this.products[idx], ...product };
        } else {
          this.products.unshift(product);
        }
        this.renderAll();
        if (this.currentView === 'admin') this.renderAdmin();
      });

      this.socket.on('product:stock-updated', (stockData) => {
        console.log('[Socket.IO] Received product:stock-updated event:', stockData);
        const product = this.products.find(p => p.id === stockData.id || p.sku === stockData.sku);
        if (product) {
          product.stock_qty = stockData.stock_qty;
          this.renderAll();
          if (this.currentView === 'admin') this.renderAdmin();
        }
      });

      this.socket.on('product:deleted', (data) => {
        console.log('[Socket.IO] Received product:deleted event:', data);
        this.products = this.products.filter(p => p.id !== data.id && p.sku !== data.sku);
        this.renderAll();
        if (this.currentView === 'admin') this.renderAdmin();
      });

      this.socket.on('order:created', (order) => {
        console.log('[Socket.IO] Received order:created event:', order);
        const idx = this.adminOrders.findIndex(o => o.id === order.id || o.order_number === order.order_number);
        if (idx === -1) {
          this.adminOrders.unshift(order);
        } else {
          this.adminOrders[idx] = order;
        }

        if (this.currentView === 'admin') {
          this.handleNewOrderNotification(order);
          this.showToast(`🔔 New Order Received: #${order.order_number} by ${order.customer_name} ($${Number(order.grand_total).toFixed(2)})`, 'success');
          this.renderAdmin();
        } else {
          this.unreadOrders.push(order);
        }
      });

      this.socket.on('order:updated', (order) => {
        console.log('[Socket.IO] Received order:updated event:', order);
        const idx = this.adminOrders.findIndex(o => o.id === order.id || o.order_number === order.order_number);
        if (idx !== -1) {
          this.adminOrders[idx] = { ...this.adminOrders[idx], ...order };
        } else {
          this.adminOrders.unshift(order);
        }

        // If this order is also in the visitor's personal orders on this PC, keep its status updated
        const myIdx = this.myOrders.findIndex(o => o.id === order.id || o.order_number === order.order_number);
        if (myIdx !== -1) {
          this.myOrders[myIdx] = { ...this.myOrders[myIdx], ...order };
          this.saveCustomerLocalOrders();
          this.updateHeaderCart();
          this.renderCustomerOrdersQueue();
        }

        if (this.currentView === 'admin') {
          this.renderAdmin();
        }
      });

      this.socket.on('settings:updated', (settings) => {
        console.log('[Socket.IO] Received settings:updated event:', settings);
        if (settings.hero_quad_rotation_seconds !== undefined) {
          const sec = Math.max(1, Math.min(300, parseInt(settings.hero_quad_rotation_seconds, 10) || 10));
          this.quadRotationIntervalSeconds = sec;
          localStorage.setItem('swift_quad_rotation_seconds', sec.toString());
        }
        if (settings.hero_quad_rotation_enabled !== undefined) {
          this.quadRotationEnabled = settings.hero_quad_rotation_enabled !== false;
          localStorage.setItem('swift_quad_rotation_enabled', this.quadRotationEnabled ? 'true' : 'false');
        }
        this.renderAdminSettingsUI();
        this.initHeroQuadRotation();
      });

      this.socket.on('reconnect', () => {
        console.log('[Socket.IO] Reconnected. Re-fetching authoritative data from PostgreSQL...');
        this.fetchProducts();
        if (this.adminToken) {
          this.socket.emit('join:admin');
          this.loadAdminData();
        }
      });
    } catch (err) {
      console.warn('Realtime Socket connection unavailable:', err.message);
    }

    // Cross-tab & Multi-window Real-Time Broadcast Engine
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('swiftorbits_realtime');
        bc.onmessage = (event) => {
          if (event.data && event.data.type === 'order:created') {
            const order = event.data.order;
            const idx = this.adminOrders.findIndex(o => o.id === order.id || o.order_number === order.order_number);
            if (idx === -1) {
              this.adminOrders.unshift(order);
            } else {
              this.adminOrders[idx] = order;
            }
            if (this.currentView === 'admin') {
              this.handleNewOrderNotification(order);
              this.showToast(`🔔 New Order Received: #${order.order_number} by ${order.customer_name} ($${Number(order.grand_total).toFixed(2)})`, 'success');
              this.renderAdmin();
            } else {
              this.unreadOrders.push(order);
            }
          }
        };
      } catch (e) {}
    }
  }

  playOrderSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  }

  clearNewOrderAlerts() {
    this.unreadOrders = [];
    if (this.liveOrderAlertPopup) {
      this.liveOrderAlertPopup.classList.add('hidden');
    }
    if (this.adminHeaderNewOrderAlert) {
      this.adminHeaderNewOrderAlert.classList.add('hidden');
    }
    if (this.adminStatOrderAlertBadge) {
      this.adminStatOrderAlertBadge.classList.add('hidden');
    }
    if (this.adminStatOrderAlertBanner) {
      this.adminStatOrderAlertBanner.classList.add('hidden');
    }
    if (this.adminStatOrdersCard) {
      this.adminStatOrdersCard.classList.remove('has-new-orders');
    }
  }

  updateAlertBadgesUI() {
    const count = (this.unreadOrders || []).length;
    if (count <= 0) {
      this.clearNewOrderAlerts();
      return;
    }
    const titleText = count > 1 ? 'You have New Orders' : 'You have a New Order';
    const counterText = `(${count})`;

    if (this.alertOrderCounter) this.alertOrderCounter.textContent = counterText;
    if (this.alertPopupTitle) this.alertPopupTitle.textContent = titleText;
    if (this.adminHeaderAlertText) this.adminHeaderAlertText.textContent = titleText;
    if (this.adminHeaderOrderCounter) this.adminHeaderOrderCounter.textContent = counterText;
    if (this.adminStatAlertText) this.adminStatAlertText.textContent = titleText;
    if (this.adminStatOrderCounter) this.adminStatOrderCounter.textContent = counterText;
    if (this.adminCardBannerText) this.adminCardBannerText.textContent = titleText;
    if (this.adminCardBannerCount) this.adminCardBannerCount.textContent = counterText;
  }

  handleNewOrderNotification(order) {
    if (!order) return;
    this.unreadOrders.push(order);
    const count = this.unreadOrders.length;
    const titleText = count > 1 ? 'You have New Orders' : 'You have a New Order';
    const counterText = `(${count})`;

    // 1. Floating live order alert popup
    if (this.alertOrderCounter) {
      this.alertOrderCounter.textContent = counterText;
    }
    if (this.alertPopupTitle) {
      this.alertPopupTitle.textContent = titleText;
    }
    if (this.alertPopupProduct) {
      const title = order.product_title || (order.items && order.items[0]?.title) || 'SwiftOrbits Catalog Order';
      this.alertPopupProduct.textContent = title;
    }
    if (this.alertPopupCustomer) {
      this.alertPopupCustomer.textContent = order.customer_name || 'Customer';
    }
    if (this.alertPopupTotal) {
      this.alertPopupTotal.textContent = '$' + Number(order.grand_total || 0).toFixed(2);
    }

    // 2. Admin Header Top-Right Alert
    if (this.adminHeaderAlertText) {
      this.adminHeaderAlertText.textContent = titleText;
    }
    if (this.adminHeaderOrderCounter) {
      this.adminHeaderOrderCounter.textContent = counterText;
    }
    if (this.adminHeaderNewOrderAlert) {
      this.adminHeaderNewOrderAlert.classList.remove('hidden');
    }

    // 3. Admin Stat Card Alert (Where Orders & Gross Revenue Payment are displayed)
    if (this.adminStatAlertText) {
      this.adminStatAlertText.textContent = titleText;
    }
    if (this.adminStatOrderCounter) {
      this.adminStatOrderCounter.textContent = counterText;
    }
    if (this.adminStatOrderAlertBadge) {
      this.adminStatOrderAlertBadge.classList.remove('hidden');
    }
    if (this.adminCardBannerText) {
      this.adminCardBannerText.textContent = titleText;
    }
    if (this.adminCardBannerCount) {
      this.adminCardBannerCount.textContent = counterText;
    }
    if (this.adminStatOrderAlertBanner) {
      this.adminStatOrderAlertBanner.classList.remove('hidden');
    }
    if (this.adminStatOrdersCard) {
      this.adminStatOrdersCard.classList.add('has-new-orders');
    }

    // STRICT: The floating notification popup and chime sound must ONLY trigger on the backend Admin Portal!
    // Never show or play on the storefront frontend!
    if (this.currentView === 'admin') {
      if (this.liveOrderAlertPopup) {
        this.liveOrderAlertPopup.classList.remove('hidden');
      }
      this.playOrderSound();
    } else {
      if (this.liveOrderAlertPopup) {
        this.liveOrderAlertPopup.classList.add('hidden');
      }
    }
  }

  showOrderSuccessConfirmation(order) {
    if (!order) return;
    this.latestPlacedOrder = order;

    const refEl = document.getElementById('order-success-ref');
    if (refEl) refEl.textContent = `#${order.order_number}`;

    const prodTitleEl = document.getElementById('order-success-product-title');
    const firstItem = (Array.isArray(order.items) && order.items.length > 0) ? order.items[0] : {};
    const title = order.product_title || firstItem.title || firstItem.product_title || 'SwiftOrbits Catalog Product';
    if (prodTitleEl) prodTitleEl.textContent = title;

    const qtySkuEl = document.getElementById('order-success-qty-sku');
    const sku = order.sku || firstItem.sku || 'SO-US-01';
    const qty = order.quantity || firstItem.quantity || 1;
    if (qtySkuEl) qtySkuEl.textContent = `Qty: ${qty} • SKU: ${sku}`;

    const totalEl = document.getElementById('order-success-total');
    const grandTotal = Number(order.grand_total || order.subtotal || 0).toFixed(2);
    if (totalEl) totalEl.textContent = `$${grandTotal}`;

    if (this.orderSuccessModal) {
      this.toggleModal(this.orderSuccessModal, true);
    }
  }

  openOrderDetailModal(order) {
    if (!order) return;
    this.activeDetailOrder = order;

    // Filter viewed order out from unread count
    this.unreadOrders = (this.unreadOrders || []).filter(o => o.order_number !== order.order_number && o.id !== order.id);
    this.updateAlertBadgesUI();

    const refEl = document.getElementById('order-detail-modal-ref');
    if (refEl) refEl.textContent = `📋 Order Details — #${order.order_number}`;

    const pillEl = document.getElementById('order-detail-status-pill');
    if (pillEl) {
      const status = order.order_status || order.status || 'processing';
      pillEl.className = `status-pill status-${status}`;
      pillEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }

    const timeEl = document.getElementById('order-detail-modal-time');
    if (timeEl) {
      const dateStr = order.created_at ? new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now';
      timeEl.textContent = `Received on ${dateStr} • Real-Time Order`;
    }

    const nameEl = document.getElementById('order-detail-cust-name');
    if (nameEl) nameEl.textContent = order.customer_name || '-';

    const phoneEl = document.getElementById('order-detail-cust-phone');
    if (phoneEl) phoneEl.textContent = order.customer_phone || '-';

    const emailEl = document.getElementById('order-detail-cust-email');
    if (emailEl) emailEl.textContent = order.customer_email || 'Not provided';

    const trackingEl = document.getElementById('order-detail-tracking');
    if (trackingEl) trackingEl.textContent = order.tracking_number || ('9400' + Math.floor(1000000000000000 + Math.random() * 9000000000000000));

    const addrEl = document.getElementById('order-detail-cust-address');
    if (addrEl) addrEl.textContent = `${order.shipping_address}, ${order.city || ''}, ${order.state || 'US'}`;

    const itemsContainer = document.getElementById('order-detail-items-list');
    if (itemsContainer) {
      const items = (Array.isArray(order.items) && order.items.length > 0)
        ? order.items
        : [{
            title: order.product_title || 'SwiftOrbits Catalog Product',
            sku: order.sku || 'SO-ITEM-01',
            quantity: order.quantity || 1,
            unit_price: order.unit_price || (order.grand_total ? (order.grand_total / (order.quantity || 1)) : 29.99),
            line_total: order.subtotal || order.grand_total || 29.99,
            image: order.image || ''
          }];

      itemsContainer.innerHTML = items.map(item => {
        const prodMatch = this.products.find(p => p.sku === item.sku);
        const img = item.image || (prodMatch ? prodMatch.image : '/elec_phone.png');
        const price = Number(item.unit_price || 0).toFixed(2);
        const lineTotal = Number(item.line_total || (item.unit_price * (item.quantity || 1))).toFixed(2);

        return `
          <div class="order-detail-item-row">
            <img src="${img}" alt="${item.title || 'Product'}" class="order-detail-item-img" onerror="this.src='/elec_phone.png';" />
            <div class="order-detail-item-info">
              <div class="order-detail-item-title">${item.title || item.product_title || 'Catalog Product'}</div>
              <div class="order-detail-item-sub">Qty: <strong>${item.quantity || 1}</strong> • SKU: <span style="font-family:var(--font-mono);">${item.sku || 'N/A'}</span> • Unit Price: $${price}</div>
            </div>
            <div class="order-detail-item-price">$${lineTotal}</div>
          </div>
        `;
      }).join('');
    }

    const shipFeeEl = document.getElementById('order-detail-shipping-fee');
    if (shipFeeEl) {
      const fee = parseFloat(order.shipping_fee || 0);
      shipFeeEl.textContent = fee > 0 ? `$${fee.toFixed(2)} Standard Shipping` : 'Free Prime 2-Day';
    }

    const totalEl = document.getElementById('order-detail-grand-total');
    if (totalEl) totalEl.textContent = '$' + Number(order.grand_total || 0).toFixed(2);

    const statusSel = document.getElementById('order-detail-status-select');
    if (statusSel) {
      statusSel.value = order.order_status || order.status || 'processing';
    }

    const waLink = document.getElementById('order-detail-whatsapp-link');
    if (waLink) {
      const msg = encodeURIComponent(`Hello ${order.customer_name}, your SwiftOrbits US Order #${order.order_number} for "${order.product_title || (order.items && order.items[0]?.title) || 'items'}" is confirmed. Total: $${Number(order.grand_total).toFixed(2)}.`);
      waLink.href = `https://wa.me/${(order.customer_phone || '').replace(/[^0-9]/g, '')}?text=${msg}`;
    }

    this.toggleModal(this.orderDetailModal, true);
  }

  async fetchProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.products) && data.products.length > 0) {
        this.products = data.products;
        this.backendHealthy = true;
        this.renderAll();
        if (window.location.hash.toLowerCase().startsWith('#product=')) {
          const sku = decodeURIComponent(window.location.hash.replace(/^#product=/i, ''));
          const targetProd = this.products.find(p => p.sku && p.sku.toLowerCase() === sku.toLowerCase());
          if (targetProd) {
            this.openProductDetailPage(targetProd);
          }
        }
      }
    } catch (err) {
      console.warn('Backend API not responding for products, using seed fallback:', err.message);
    }
  }

  async fetchCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.categories)) {
        this.categories = data.categories;
      }
    } catch (err) {
      console.warn('Backend API not responding for categories:', err.message);
    }
  }

  async loadAdminData() {
    if (!this.adminToken) return;

    let ordersLoadedFromServer = false;
    let analyticsLoaded = false;

    try {
      // 1. Fetch Orders from Database if available
      try {
        const ordersRes = await fetch(`${API_BASE}/orders`, {
          headers: { Authorization: `Bearer ${this.adminToken}` }
        });
        const contentType = ordersRes.headers.get('content-type') || '';
        if (ordersRes.ok && contentType.includes('application/json')) {
          const ordersData = await ordersRes.json();
          if (ordersData.ok && Array.isArray(ordersData.orders)) {
            this.adminOrders = ordersData.orders;
            ordersLoadedFromServer = true;
          }
        }
      } catch (e) {}

      if (!ordersLoadedFromServer && !this.adminOrders) {
        this.adminOrders = [];
      }

      // 2. Fetch Analytics from Database or compute locally
      try {
        const analyticsRes = await fetch(`${API_BASE}/analytics`, {
          headers: { Authorization: `Bearer ${this.adminToken}` }
        });
        const contentType = analyticsRes.headers.get('content-type') || '';
        if (analyticsRes.ok && contentType.includes('application/json')) {
          const analyticsData = await analyticsRes.json();
          if (analyticsData.ok && analyticsData.analytics) {
            this.applyAnalytics(analyticsData.analytics);
            analyticsLoaded = true;
          }
        }
      } catch (e) {}

      if (!analyticsLoaded) {
        const gross = this.adminOrders.reduce((sum, o) => sum + (parseFloat(o.grand_total) || 0), 0);
        const processing = this.adminOrders.filter(o => o.order_status === 'processing' || o.order_status === 'pending' || o.status === 'pending').length;
        const delivered = this.adminOrders.filter(o => o.order_status === 'delivered' || o.status === 'delivered').length;
        const aov = this.adminOrders.length ? (gross / this.adminOrders.length) : 0;
        this.applyAnalytics({
          department_stock: { tech: 240, fashion: 180, beauty: 320 },
          active_orders: this.adminOrders.length,
          gross_revenue: gross,
          processing_orders: processing,
          delivered_orders: delivered,
          aov: aov
        });
      }

      this.renderAdmin();
    } catch (err) {
      console.error('Admin data notice:', err);
      this.renderAdmin();
    }
  }

  applyAnalytics(analytics) {
    if (this.statElec) this.statElec.textContent = `${analytics.department_stock.tech || 0} Units`;
    if (this.statFashion) this.statFashion.textContent = `${analytics.department_stock.fashion || 0} Units`;
    if (this.statBeauty) this.statBeauty.textContent = `${analytics.department_stock.beauty || 0} Units`;
    if (this.statOrders) this.statOrders.textContent = `${analytics.active_orders || 0} Orders`;
    if (this.statRevenue) this.statRevenue.textContent = `Gross: $${analytics.gross_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const grossEl = document.getElementById('ledger-gross');
    if (grossEl) grossEl.textContent = `$${analytics.gross_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const procEl = document.getElementById('ledger-processing-count');
    if (procEl) procEl.textContent = analytics.processing_orders || 0;

    const delEl = document.getElementById('ledger-delivered-count');
    if (delEl) delEl.textContent = analytics.delivered_orders || 0;

    const aovEl = document.getElementById('ledger-aov');
    if (aovEl) aovEl.textContent = `$${analytics.aov.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  initDOM() {
    this.viewStorefront = document.getElementById('view-storefront');
    this.viewCategoryPage = document.getElementById('view-category-page');
    this.viewProductDetail = document.getElementById('view-product-detail');
    this.viewAdmin = document.getElementById('view-admin');

    this.topSwitchBtn = document.getElementById('top-switch-mode-btn');
    this.adminExitBtn = document.getElementById('admin-exit-btn');
    this.brandHomeLogo = document.getElementById('brand-home-logo');

    this.flashProductsGrid = document.getElementById('flash-products-grid');
    this.productsGrid = document.getElementById('products-grid');
    this.catalogCountInfo = document.getElementById('catalog-count-info');

    this.darazSearchInput = document.getElementById('daraz-search-input');
    this.darazSearchBtn = document.getElementById('daraz-search-btn');

    this.cartCountBadge = document.getElementById('cart-count');
    this.headerCartTotal = document.getElementById('header-cart-total');

    // Modals
    this.checkoutModal = document.getElementById('checkout-modal');
    this.addProductModal = document.getElementById('add-product-modal');
    this.receiptModal = document.getElementById('receipt-modal');
    this.userProfileModal = document.getElementById('user-profile-modal');
    this.authModal = document.getElementById('auth-modal');
    this.closeAuthModalBtn = document.getElementById('close-auth-modal');
    this.authAlertBox = document.getElementById('auth-alert-box');
    this.authUser = JSON.parse(localStorage.getItem('swiftorbits_user') || 'null');
    this.authToken = localStorage.getItem('swiftorbits_token') || null;
    this.pendingAuthEmail = '';
    this.pendingAuthPurpose = 'email_verification';
    this.pendingResetToken = null;
    this.otpTimerInterval = null;
    this.resendCooldownInterval = null;

    this.ordersQueueModal = document.getElementById('orders-queue-modal');
    this.editOrderModal = document.getElementById('edit-order-modal');
    this.trackingModal = document.getElementById('tracking-modal');
    this.infoModal = document.getElementById('info-modal');
    this.adminLoginModal = document.getElementById('admin-login-modal');
    this.adminLogoutBtn = document.getElementById('admin-logout-btn');

    // Header interactive triggers
    this.headerUserProfile = document.getElementById('header-user-profile');
    this.headerCartBtn = document.getElementById('header-cart-btn');

    // Top announcement links
    this.topPrimeLink = document.getElementById('top-prime-link');
    this.topSellLink = document.getElementById('top-sell-link');
    this.topSupportLink = document.getElementById('top-support-link');
    this.topTrackLink = document.getElementById('top-track-link');
    this.topCarrierLink = document.getElementById('top-carrier-link');

    // Tracking Elements
    this.trackInput = document.getElementById('track-input');
    this.trackSearchBtn = document.getElementById('track-search-btn');
    this.trackingDetailsBox = document.getElementById('tracking-details-box');
    this.trackViewLabelBtn = document.getElementById('track-view-label-btn');

    // Universal Info Modal Elements
    this.infoModalTitle = document.getElementById('info-modal-title');
    this.infoModalSub = document.getElementById('info-modal-sub');
    this.infoModalPill = document.getElementById('info-modal-pill');
    this.infoModalContent = document.getElementById('info-modal-content');

    // Toast Container
    this.toastContainer = document.getElementById('toast-container');

    // Live Order Alert Popup & Details Modal Elements
    this.liveOrderAlertPopup = document.getElementById('live-order-alert-popup');
    this.alertPopupTitle = document.getElementById('alert-popup-main-title');
    this.alertOrderCounter = document.getElementById('alert-order-counter');
    this.alertPopupProduct = document.getElementById('alert-popup-product-title');
    this.alertPopupCustomer = document.getElementById('alert-popup-customer');
    this.alertPopupTotal = document.getElementById('alert-popup-total');
    this.closeLiveOrderAlertBtn = document.getElementById('close-live-order-alert');
    this.orderDetailModal = document.getElementById('order-detail-modal');
    this.closeOrderDetailModalBtn = document.getElementById('close-order-detail-modal');
    this.closeOrderDetailBtn = document.getElementById('close-order-detail-btn');
    this.orderDetailStatusSelect = document.getElementById('order-detail-status-select');
    this.orderDetailPrintBtn = document.getElementById('order-detail-print-receipt-btn');
    this.orderDetailWhatsappLink = document.getElementById('order-detail-whatsapp-link');

    // Admin Top-Right & Stat Card Alert Elements
    this.adminHeaderNewOrderAlert = document.getElementById('admin-header-new-order-alert');
    this.adminHeaderAlertText = document.getElementById('admin-header-alert-text');
    this.adminHeaderOrderCounter = document.getElementById('admin-header-order-counter');
    this.adminStatOrdersCard = document.getElementById('admin-stat-orders-card');
    this.adminStatOrderAlertBadge = document.getElementById('admin-stat-order-alert-badge');
    this.adminStatAlertText = document.getElementById('admin-stat-alert-text');
    this.adminStatOrderCounter = document.getElementById('admin-stat-order-counter');
    this.adminStatOrderAlertBanner = document.getElementById('admin-stat-order-alert-banner');
    this.adminCardBannerText = document.getElementById('admin-card-banner-text');
    this.adminCardBannerCount = document.getElementById('admin-card-banner-count');
    this.latestPlacedOrder = null;

    // Storefront Compact Order Confirmation Modal Elements
    this.orderSuccessModal = document.getElementById('order-success-modal');
    this.closeOrderSuccessModalBtn = document.getElementById('close-order-success-modal');
    this.orderSuccessViewReceiptBtn = document.getElementById('order-success-view-receipt-btn');
    this.orderSuccessContinueBtn = document.getElementById('order-success-continue-btn');

    // Category Page Elements
    this.catPageBreadcrumbTitle = document.getElementById('cat-page-breadcrumb-title');
    this.catPageItemCount = document.getElementById('cat-page-item-count');
    this.catPageHeroBadge = document.getElementById('cat-page-hero-badge');
    this.catPageHeroTitle = document.getElementById('cat-page-hero-title');
    this.catPageHeroDesc = document.getElementById('cat-page-hero-desc');
    this.catPageHeroBrands = document.getElementById('cat-page-hero-brands');
    this.filterBrandsContainer = document.getElementById('filter-brands-container');
    this.catResultsSummary = document.getElementById('cat-results-summary');
    this.catProductsGrid = document.getElementById('cat-products-grid');
    this.catEmptyState = document.getElementById('cat-empty-state');
    this.catSortSelect = document.getElementById('cat-sort-select');

    // Admin Elements
    this.statElec = document.getElementById('stat-elec');
    this.statFashion = document.getElementById('stat-fashion');
    this.statBeauty = document.getElementById('stat-beauty');
    this.statOrders = document.getElementById('stat-orders');
    this.statRevenue = document.getElementById('stat-revenue');

    this.adminProductsTbody = document.getElementById('admin-products-tbody');
    this.adminOrdersTbody = document.getElementById('admin-orders-tbody');

    // Ledger
    this.ledgerGross = document.getElementById('ledger-gross');
    this.ledgerProcessingCount = document.getElementById('ledger-processing-count');
    this.ledgerDeliveredCount = document.getElementById('ledger-delivered-count');
    this.ledgerAov = document.getElementById('ledger-aov');

    // Admin Rotator & Showcase Elements
    this.statRotatorSpeed = document.getElementById('stat-rotator-speed');
    this.statRotatorStatus = document.getElementById('stat-rotator-status');
    this.statCardRotator = document.getElementById('stat-card-rotator');
    this.adminRotatorDisplayBadge = document.getElementById('admin-rotator-display-badge');
    this.adminRotatorSecondsVal = document.getElementById('admin-rotator-seconds-val');
    this.adminRotatorSlider = document.getElementById('admin-rotator-slider');
    this.adminRotatorNumInput = document.getElementById('admin-rotator-num-input');
    this.adminRotatorActiveSummary = document.getElementById('admin-rotator-active-summary');
    this.adminRotatorToggleActive = document.getElementById('admin-rotator-toggle-active');
    this.adminRotatorLiveIndicator = document.getElementById('admin-rotator-live-indicator');
  }

  startFlashTimer() {
    let hours = 5;
    let mins = 42;
    let secs = 19;

    setInterval(() => {
      secs--;
      if (secs < 0) {
        secs = 59;
        mins--;
        if (mins < 0) {
          mins = 59;
          hours--;
          if (hours < 0) {
            hours = 12;
          }
        }
      }

      const hStr = String(hours).padStart(2, '0');
      const mStr = String(mins).padStart(2, '0');
      const sStr = String(secs).padStart(2, '0');

      const elH = document.getElementById('t-hours');
      const elM = document.getElementById('t-mins');
      const elS = document.getElementById('t-secs');

      if (elH) elH.textContent = hStr;
      if (elM) elM.textContent = mStr;
      if (elS) elS.textContent = sStr;
    }, 1000);
  }

  initHashRouting() {
    const handleHash = () => {
      const rawHash = window.location.hash;
      const hash = rawHash.toLowerCase();
      if (hash.startsWith('#product=')) {
        const sku = decodeURIComponent(rawHash.replace(/^#product=/i, ''));
        const targetProd = this.products.find(p => p.sku && p.sku.toLowerCase() === sku.toLowerCase());
        if (targetProd && (!this.activeModalProduct || this.activeModalProduct.sku !== targetProd.sku || this.currentView !== 'product')) {
          this.openProductDetailPage(targetProd);
        }
      } else if (hash.startsWith('#category=')) {
        if (this.currentView === 'product') {
          this.switchView('storefront');
        }
        const cat = hash.replace('#category=', '');
        if (cat && cat !== this.selectedCategory) {
          this.switchCategory(cat);
        }
      } else if (hash === '#deals') {
        if (this.currentView === 'product') {
          this.switchView('storefront');
        }
        const dealsBtn = document.querySelector('.swift-nav-btn[data-filter="deals"]');
        if (dealsBtn) dealsBtn.click();
      } else if (hash === '#bestsellers') {
        if (this.currentView === 'product') {
          this.switchView('storefront');
        }
        const bsBtn = document.querySelector('.swift-nav-btn[data-filter="bestsellers"]');
        if (bsBtn) bsBtn.click();
      } else if (hash === '#track') {
        this.openTrackingModal();
      } else if (hash === '#orders' || hash === '#cart') {
        this.openOrdersQueueModal();
      } else if (hash === '#admin') {
        if (this.adminToken) {
          this.switchView('admin');
          this.loadAdminData();
        } else {
          this.toggleModal(this.adminLoginModal, true);
        }
      } else if (['#support', '#contact', '#prime-shipping', '#carrier', '#faq', '#about', '#terms', '#privacy', '#warranty', '#returns'].includes(hash)) {
        this.openInfoModal(hash.replace('#', ''));
      } else {
        if (this.currentView === 'product') {
          this.switchView('storefront');
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    if (window.location.hash) {
      handleHash();
    }
  }

  bindEvents() {
    // Mode Switching with Authentication Guard
    if (this.topSwitchBtn) {
      this.topSwitchBtn.addEventListener('click', () => {
        if (this.currentView === 'admin') {
          this.switchCategory('all');
        } else {
          if (this.adminToken) {
            this.switchView('admin');
            this.loadAdminData();
          } else {
            this.toggleModal(this.adminLoginModal, true);
          }
        }
      });
    }

    if (this.adminLogoutBtn) {
      this.adminLogoutBtn.addEventListener('click', () => {
        this.adminToken = null;
        this.adminUser = null;
        sessionStorage.removeItem('swift_admin_token');
        sessionStorage.removeItem('swift_admin_user');
        this.switchCategory('all');
        this.showToast('Signed out of Merchant Portal.', 'info');
      });
    }

    // Admin Login Modal Handlers
    const closeLoginBtn = document.getElementById('close-admin-login-modal');
    if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => this.toggleModal(this.adminLoginModal, false));
    const cancelLoginBtn = document.getElementById('cancel-admin-login-btn');
    if (cancelLoginBtn) cancelLoginBtn.addEventListener('click', () => this.toggleModal(this.adminLoginModal, false));

    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
      adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-login-email').value.trim();
        const password = document.getElementById('admin-login-password').value;
        const submitBtn = document.getElementById('submit-admin-login-btn');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Verifying...'; }

        try {
          let loginSuccess = false;
          let token = null;
          let adminObj = null;

          try {
            const res = await fetch(`${API_BASE}/admin/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            const contentType = res.headers.get('content-type') || '';
            if (res.ok && contentType.includes('application/json')) {
              const data = await res.json();
              if (data && data.ok) {
                token = data.token;
                adminObj = data.admin;
                loginSuccess = true;
              }
            }
          } catch (netErr) {}

          // Standalone / Vercel fallback for verified merchant
          if (!loginSuccess) {
            if (email.toLowerCase() === 'admin@swiftorbits.us' && password === 'admin123456') {
              token = 'swift_admin_jwt_' + Date.now();
              adminObj = {
                id: 1,
                email: 'admin@swiftorbits.us',
                name: 'SwiftOrbits Merchant Operations',
                role: 'superadmin'
              };
              loginSuccess = true;
            }
          }

          if (loginSuccess) {
            this.adminToken = token;
            this.adminUser = adminObj;
            sessionStorage.setItem('swift_admin_token', token);
            sessionStorage.setItem('swift_admin_user', JSON.stringify(adminObj));

            this.toggleModal(this.adminLoginModal, false);
            if (this.socket) {
              try { this.socket.emit('join:admin'); } catch (e) {}
            }
            this.switchView('admin');
            this.loadAdminData();
            this.showToast('Signed in to Merchant Hub successfully!', 'success');
          } else {
            alert('Invalid credentials. Please enter authorized merchant email and password.');
          }
        } catch (err) {
          alert('Admin Sign-In notice: ' + err.message);
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Sign In to Merchant Hub'; }
        }
      });
    }

    // Image Preview in Add Product Modal
    const newProdFile = document.getElementById('new-prod-file');
    const previewWrap = document.getElementById('new-prod-preview-wrap');
    const previewImg = document.getElementById('new-prod-preview');
    if (newProdFile && previewWrap && previewImg) {
      newProdFile.addEventListener('change', () => {
        const file = newProdFile.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            previewImg.src = ev.target.result;
            previewWrap.style.display = 'block';
          };
          reader.readAsDataURL(file);
        } else {
          previewWrap.style.display = 'none';
        }
      });
    }

    this.adminExitBtn.addEventListener('click', () => this.switchCategory('all'));
    if (this.brandHomeLogo) {
      this.brandHomeLogo.addEventListener('click', () => {
        this.searchQuery = '';
        if (this.darazSearchInput) this.darazSearchInput.value = '';
        this.resetCategoryFilters();
        this.switchCategory('all', true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // All Departments Mega Menu Dropdown
    const allDeptsBtn = document.getElementById('all-departments-btn');
    const megaDropdown = document.getElementById('mega-menu-dropdown');

    if (allDeptsBtn && megaDropdown) {
      allDeptsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = megaDropdown.classList.contains('open');
        if (isOpen) {
          megaDropdown.classList.remove('open');
          allDeptsBtn.classList.remove('active');
        } else {
          megaDropdown.classList.add('open');
          allDeptsBtn.classList.add('active');
        }
      });

      document.addEventListener('click', (e) => {
        if (!megaDropdown.contains(e.target) && !allDeptsBtn.contains(e.target)) {
          megaDropdown.classList.remove('open');
          allDeptsBtn.classList.remove('active');
        }
      });

      document.querySelectorAll('.dept-item[data-category]').forEach(item => {
        item.addEventListener('click', () => {
          const cat = item.dataset.category;
          megaDropdown.classList.remove('open');
          allDeptsBtn.classList.remove('active');
          this.switchCategory(cat);
        });
      });
    }

    // Category Buttons
    document.querySelectorAll('.swift-nav-btn[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchCategory(btn.dataset.category);
      });
    });

    // Category Roundels
    document.querySelectorAll('.cat-card[data-category]').forEach(card => {
      card.addEventListener('click', () => {
        this.switchCategory(card.dataset.category);
      });
    });

    // Hero 3-Category Tabs (Target/Retail Style: Kitchen, Beauty, Electronics)
    document.querySelectorAll('.hero-category-tab-card[data-category]').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.dataset.category;
        this.categoryPageFilters.selectedBrands = [];
        this.switchCategory(cat, false, true);
        const target = document.querySelector('.clean-storefront-layout');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Amazon Quad Category Cards & Headers (Clicking card header changes category smoothly without scroll)
    document.querySelectorAll('.bream-quad-card[data-category], .bream-quad-header[data-category]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.bream-quad-item')) return;
        const cat = el.dataset.category || el.closest('.bream-quad-card').dataset.category;
        this.categoryPageFilters.selectedBrands = [];
        this.switchCategory(cat, false, false);
      });
    });

    // Amazon Quad Specific Real Items (Clicking any real item directly opens that product's full page modal)
    const quadContainer = document.querySelector('.bream-quad-container');
    if (quadContainer) {
      quadContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.bream-quad-item');
        if (!item) return;
        e.stopPropagation();
        e.preventDefault();

        const sku = item.dataset.sku;
        const brand = item.dataset.brand;
        const cat = item.dataset.category;

        let targetProduct = sku ? this.products.find(p => p.sku === sku) : null;
        if (!targetProduct && brand) {
          targetProduct = this.products.find(p => {
            const matchesBrand = p.attributes?.Brand && p.attributes.Brand.toLowerCase() === brand.toLowerCase();
            const matchesTitle = p.title && p.title.toLowerCase().includes(brand.toLowerCase());
            if (cat) {
              return p.category === cat && (matchesBrand || matchesTitle);
            }
            return matchesBrand || matchesTitle;
          });
        }

        if (targetProduct) {
          this.openCheckoutModal(targetProduct);
        } else if (cat && brand) {
          this.handleQuadBrandClick(cat, brand);
        }
      });
    }

    // Search
    const triggerSearch = () => {
      this.searchQuery = this.darazSearchInput.value.toLowerCase().trim();
      if (this.currentView === 'product') {
        this.switchView('storefront');
      }
      if (this.selectedCategory !== 'all') {
        this.switchCategory('all');
      } else {
        this.renderStorefront();
      }
    };

    this.darazSearchBtn.addEventListener('click', triggerSearch);
    this.darazSearchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') triggerSearch();
    });
    this.darazSearchInput.addEventListener('input', () => {
      triggerSearch();
    });

    // Hero banner buttons
    const heroBtn = document.getElementById('hero-shop-now-btn');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        window.scrollTo({ top: 520, behavior: 'smooth' });
      });
    }
    const flashBtn = document.getElementById('flash-shop-more-btn');
    if (flashBtn) {
      flashBtn.addEventListener('click', () => {
        window.scrollTo({ top: 920, behavior: 'smooth' });
      });
    }

    // Admin Tabs Navigation
    document.querySelectorAll('.seller-tab-btn[data-admin-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.seller-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.adminSubview = btn.dataset.adminView;
        this.renderAdminSubviews();
      });
    });

    // Product Detail Page (PDP) Navigation & Return handlers
    const pdpBackBtn = document.getElementById('pdp-back-to-results-btn');
    if (pdpBackBtn) pdpBackBtn.addEventListener('click', () => this.closeProductDetailPage());
    const cancelCheckoutBtn = document.getElementById('cancel-checkout-btn');
    if (cancelCheckoutBtn) cancelCheckoutBtn.addEventListener('click', () => this.closeProductDetailPage());
    const closeCheckoutBtn = document.getElementById('close-checkout-modal');
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => this.closeProductDetailPage());
    const crumbHome = document.getElementById('pdp-crumb-home');
    if (crumbHome) crumbHome.addEventListener('click', (e) => { e.preventDefault(); this.switchCategory('all'); });
    const crumbCat = document.getElementById('pdp-crumb-cat');
    if (crumbCat) crumbCat.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.activeModalProduct?.category) this.switchCategory(this.activeModalProduct.category);
      else this.switchCategory('all');
    });
    const brandStoreLink = document.getElementById('pdp-brand-store-link');
    if (brandStoreLink) brandStoreLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.activeModalProduct) {
        this.handleQuadBrandClick(this.activeModalProduct.category, this.activeModalProduct.attributes?.Brand);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentView === 'product') {
        this.closeProductDetailPage();
      }
    });

    const openAddProductBtn = document.getElementById('open-add-product-btn');
    if (openAddProductBtn) openAddProductBtn.addEventListener('click', () => this.toggleModal(this.addProductModal, true));
    const closeAddProductBtn = document.getElementById('close-add-product-modal');
    if (closeAddProductBtn) closeAddProductBtn.addEventListener('click', () => this.toggleModal(this.addProductModal, false));
    const cancelAddProductBtn = document.getElementById('cancel-add-product-btn');
    if (cancelAddProductBtn) cancelAddProductBtn.addEventListener('click', () => this.toggleModal(this.addProductModal, false));

    const closeReceiptBtn = document.getElementById('close-receipt-modal');
    if (closeReceiptBtn) closeReceiptBtn.addEventListener('click', () => this.toggleModal(this.receiptModal, false));
    const closeReceiptBtn2 = document.getElementById('close-receipt-btn');
    if (closeReceiptBtn2) closeReceiptBtn2.addEventListener('click', () => this.toggleModal(this.receiptModal, false));

    const tabReceiptThermal = document.getElementById('tab-receipt-thermal');
    const tabReceiptA4 = document.getElementById('tab-receipt-a4');
    if (tabReceiptThermal) tabReceiptThermal.addEventListener('click', () => this.switchReceiptFormat('thermal'));
    if (tabReceiptA4) tabReceiptA4.addEventListener('click', () => this.switchReceiptFormat('a4'));

    const printA4Btn = document.getElementById('print-a4-btn');
    if (printA4Btn) {
      printA4Btn.addEventListener('click', () => {
        const isThermalActive = document.getElementById('tab-receipt-thermal')?.classList.contains('active');
        this.printReceiptDocument(isThermalActive ? 'thermal' : 'a4');
      });
    }

    // Qty change calculation
    const orderQtyInput = document.getElementById('order-qty');
    if (orderQtyInput) orderQtyInput.addEventListener('input', () => this.updateCheckoutCalculations());

    // PDP Add to Cart Button
    const pdpAddToCartBtn = document.getElementById('pdp-add-to-cart-btn');
    if (pdpAddToCartBtn) {
      pdpAddToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!this.activeModalProduct) return;
        const qty = parseInt(document.getElementById('order-qty')?.value) || 1;
        this.addToCart(this.activeModalProduct, qty);
      });
    }

    // Form Submit: Order Checkout
    const orderForm = document.getElementById('order-form');
    if (orderForm) orderForm.addEventListener('submit', (e) => this.handleOrderSubmit(e));

    // Form Submit: Add Product
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) addProductForm.addEventListener('submit', (e) => this.handleAddProductSubmit(e));

    // User Profile & Authentication
    if (this.headerUserProfile) {
      this.headerUserProfile.addEventListener('click', () => {
        if (this.authUser) {
          this.openUserProfileModal();
        } else {
          this.openAuthModal('signin');
        }
      });
    }
    const closeProfileBtn = document.getElementById('close-user-profile-modal');
    if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => this.toggleModal(this.userProfileModal, false));
    const cancelProfileBtn = document.getElementById('cancel-user-profile-btn');
    if (cancelProfileBtn) cancelProfileBtn.addEventListener('click', () => this.toggleModal(this.userProfileModal, false));
    const logoutProfileBtn = document.getElementById('logout-user-profile-btn');
    if (logoutProfileBtn) logoutProfileBtn.addEventListener('click', () => this.handleAuthSignOut());
    const userProfileForm = document.getElementById('user-profile-form');
    if (userProfileForm) userProfileForm.addEventListener('submit', (e) => this.handleUserProfileSubmit(e));

    // Bind Customer Auth Modal Handlers
    this.bindAuthEvents();

    // Orders Queue & Cart
    if (this.headerCartBtn) {
      this.headerCartBtn.addEventListener('click', () => this.openOrdersQueueModal());
    }
    const closeQueueBtn = document.getElementById('close-orders-queue-modal');
    if (closeQueueBtn) closeQueueBtn.addEventListener('click', () => this.toggleModal(this.ordersQueueModal, false));
    const closeQueueBtn2 = document.getElementById('close-orders-queue-btn');
    if (closeQueueBtn2) closeQueueBtn2.addEventListener('click', () => this.toggleModal(this.ordersQueueModal, false));
    // Edit Order Modal Event Listeners
    const closeEditOrderBtn = document.getElementById('close-edit-order-modal');
    if (closeEditOrderBtn) closeEditOrderBtn.addEventListener('click', () => this.toggleModal(this.editOrderModal, false));
    const cancelEditOrderBtn = document.getElementById('cancel-edit-order-btn');
    if (cancelEditOrderBtn) cancelEditOrderBtn.addEventListener('click', () => this.toggleModal(this.editOrderModal, false));

    const editOrderQtyInput = document.getElementById('edit-order-qty');
    const editQtyDecBtn = document.getElementById('edit-qty-decrease-btn');
    const editQtyIncBtn = document.getElementById('edit-qty-increase-btn');
    if (editQtyDecBtn) {
      editQtyDecBtn.addEventListener('click', () => {
        let val = parseInt(editOrderQtyInput.value) || 1;
        if (val > 1) {
          editOrderQtyInput.value = val - 1;
          this.recalculateEditOrderTotal();
        }
      });
    }
    if (editQtyIncBtn) {
      editQtyIncBtn.addEventListener('click', () => {
        let val = parseInt(editOrderQtyInput.value) || 1;
        if (val < 99) {
          editOrderQtyInput.value = val + 1;
          this.recalculateEditOrderTotal();
        }
      });
    }
    if (editOrderQtyInput) {
      editOrderQtyInput.addEventListener('input', () => this.recalculateEditOrderTotal());
    }

    const editOrderForm = document.getElementById('edit-order-form');
    if (editOrderForm) {
      editOrderForm.addEventListener('submit', (e) => this.handleEditOrderSubmit(e));
    }

    // Top Links & Carrier / Tracking
    if (this.topPrimeLink) {
      this.topPrimeLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openInfoModal('prime-shipping');
      });
    }
    if (this.topSellLink) {
      this.topSellLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('admin');
      });
    }
    if (this.topSupportLink) {
      this.topSupportLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openInfoModal('support');
      });
    }
    if (this.topTrackLink) {
      this.topTrackLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openTrackingModal();
      });
    }
    if (this.topCarrierLink) {
      this.topCarrierLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openInfoModal('carrier');
      });
    }

    // Tracking Modal Handlers
    const closeTrackBtn = document.getElementById('close-tracking-modal');
    if (closeTrackBtn) closeTrackBtn.addEventListener('click', () => this.toggleModal(this.trackingModal, false));
    const closeTrackBtn2 = document.getElementById('close-tracking-btn');
    if (closeTrackBtn2) closeTrackBtn2.addEventListener('click', () => this.toggleModal(this.trackingModal, false));
    if (this.trackSearchBtn) this.trackSearchBtn.addEventListener('click', () => this.handleTrackSearch());
    if (this.trackInput) {
      this.trackInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') this.handleTrackSearch();
      });
    }
    if (this.trackViewLabelBtn) {
      this.trackViewLabelBtn.addEventListener('click', () => {
        if (this.activeTrackedOrder) {
          this.toggleModal(this.trackingModal, false);
          this.openThermalReceipt(this.activeTrackedOrder);
        }
      });
    }

    // Dynamic Universal Info Modal Handlers
    const closeInfoModalBtn = document.getElementById('close-info-modal');
    if (closeInfoModalBtn) closeInfoModalBtn.addEventListener('click', () => this.toggleModal(this.infoModal, false));
    const closeInfoBtn2 = document.getElementById('close-info-btn');
    if (closeInfoBtn2) closeInfoBtn2.addEventListener('click', () => this.toggleModal(this.infoModal, false));

    // Clickable Homepage Guarantee Badges
    document.querySelectorAll('.clickable-guarantee').forEach(item => {
      item.addEventListener('click', () => {
        this.openInfoModal(item.dataset.info);
      });
    });

    // Clickable Payment Badges
    document.querySelectorAll('.clickable-pay').forEach(item => {
      item.addEventListener('click', () => {
        this.openInfoModal(item.dataset.info);
      });
    });

    // Clickable Footer Links
    document.querySelectorAll('.footer-info-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http'))) {
          return;
        }
        e.preventDefault();
        const infoKey = link.dataset.info;
        if (!infoKey) return;
        if (infoKey === 'track') {
          this.openTrackingModal();
        } else if (infoKey === 'admin') {
          if (this.adminToken) {
            this.switchView('admin');
            this.loadAdminData();
          } else {
            this.toggleModal(this.adminLoginModal, true);
          }
        } else {
          this.openInfoModal(infoKey);
        }
      });
    });

    // Live Order Alert Popup Click & Dismiss
    if (this.liveOrderAlertPopup) {
      this.liveOrderAlertPopup.addEventListener('click', () => {
        const targetOrder = (this.unreadOrders && this.unreadOrders.length > 0)
          ? this.unreadOrders[this.unreadOrders.length - 1]
          : (this.adminOrders && this.adminOrders[0]);
        this.clearNewOrderAlerts();
        if (targetOrder) {
          this.openOrderDetailModal(targetOrder);
        }
      });
    }

    if (this.closeLiveOrderAlertBtn) {
      this.closeLiveOrderAlertBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearNewOrderAlerts();
      });
    }

    // Admin Header Top-Right Alert Click Handler
    if (this.adminHeaderNewOrderAlert) {
      this.adminHeaderNewOrderAlert.addEventListener('click', (e) => {
        e.preventDefault();
        const targetOrder = (this.unreadOrders && this.unreadOrders.length > 0)
          ? this.unreadOrders[this.unreadOrders.length - 1]
          : (this.adminOrders && this.adminOrders[0]);
        this.clearNewOrderAlerts();
        if (targetOrder) {
          this.openOrderDetailModal(targetOrder);
        }
      });
    }

    // Admin Stat Card Alert Banner & Card Click Handler
    if (this.adminStatOrderAlertBanner) {
      this.adminStatOrderAlertBanner.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetOrder = (this.unreadOrders && this.unreadOrders.length > 0)
          ? this.unreadOrders[this.unreadOrders.length - 1]
          : (this.adminOrders && this.adminOrders[0]);
        this.clearNewOrderAlerts();
        if (targetOrder) {
          this.openOrderDetailModal(targetOrder);
        }
      });
    }

    if (this.adminStatOrdersCard) {
      this.adminStatOrdersCard.addEventListener('click', () => {
        if (this.unreadOrders && this.unreadOrders.length > 0) {
          const targetOrder = this.unreadOrders[this.unreadOrders.length - 1];
          this.clearNewOrderAlerts();
          this.openOrderDetailModal(targetOrder);
        } else {
          this.switchAdminView('orders');
        }
      });
    }

    // Storefront Compact Order Success Modal Event Handlers
    if (this.closeOrderSuccessModalBtn) {
      this.closeOrderSuccessModalBtn.addEventListener('click', () => {
        this.toggleModal(this.orderSuccessModal, false);
      });
    }

    if (this.orderSuccessContinueBtn) {
      this.orderSuccessContinueBtn.addEventListener('click', () => {
        this.toggleModal(this.orderSuccessModal, false);
      });
    }

    if (this.orderSuccessViewReceiptBtn) {
      this.orderSuccessViewReceiptBtn.addEventListener('click', () => {
        this.toggleModal(this.orderSuccessModal, false);
        const orderToPrint = this.latestPlacedOrder || (this.myOrders && this.myOrders[0]) || (this.adminOrders && this.adminOrders[0]);
        if (orderToPrint) {
          this.openThermalReceipt(orderToPrint);
        }
      });
    }

    // Order Detail Modal Close & Action Handlers
    if (this.closeOrderDetailModalBtn) {
      this.closeOrderDetailModalBtn.addEventListener('click', () => this.toggleModal(this.orderDetailModal, false));
    }
    if (this.closeOrderDetailBtn) {
      this.closeOrderDetailBtn.addEventListener('click', () => this.toggleModal(this.orderDetailModal, false));
    }

    if (this.orderDetailPrintBtn) {
      this.orderDetailPrintBtn.addEventListener('click', () => {
        if (this.activeDetailOrder) {
          this.openThermalReceipt(this.activeDetailOrder);
        }
      });
    }

    if (this.orderDetailStatusSelect) {
      this.orderDetailStatusSelect.addEventListener('change', async (e) => {
        if (!this.activeDetailOrder) return;
        const newStatus = e.target.value;
        this.activeDetailOrder.order_status = newStatus;
        this.activeDetailOrder.status = newStatus;

        // Update pill in modal
        const pillEl = document.getElementById('order-detail-status-pill');
        if (pillEl) {
          pillEl.className = `status-pill status-${newStatus}`;
          pillEl.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        }

        // Update in this.adminOrders
        const idx = this.adminOrders.findIndex(o => o.id === this.activeDetailOrder.id || o.order_number === this.activeDetailOrder.order_number);
        if (idx !== -1) {
          this.adminOrders[idx] = { ...this.adminOrders[idx], order_status: newStatus, status: newStatus };
        }
        // Also update in myOrders if present
        const myIdx = this.myOrders.findIndex(o => o.id === this.activeDetailOrder.id || o.order_number === this.activeDetailOrder.order_number);
        if (myIdx !== -1) {
          this.myOrders[myIdx] = { ...this.myOrders[myIdx], order_status: newStatus, status: newStatus };
          this.saveCustomerLocalOrders();
          this.updateHeaderCart();
        }
        this.renderAdmin();

        try {
          await fetch(`${API_BASE}/orders/${this.activeDetailOrder.id}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(this.adminToken ? { Authorization: `Bearer ${this.adminToken}` } : {})
            },
            body: JSON.stringify({ status: newStatus })
          });
        } catch (err) {}

        this.showToast(`Order #${this.activeDetailOrder.order_number} status updated to '${newStatus}'!`, 'success');
      });
    }

    this.bindRotatorSettingsEvents();
  }

  initCategoryPageEvents() {
    const backBtn = document.getElementById('cat-page-back-home');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.switchCategory('all'));
    }

    const resetBtn = document.getElementById('cat-reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetCategoryFilters());
    }

    const emptyResetBtn = document.getElementById('cat-empty-reset-btn');
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', () => this.resetCategoryFilters());
    }

    const applyPriceBtn = document.getElementById('filter-apply-price-btn');
    if (applyPriceBtn) {
      applyPriceBtn.addEventListener('click', () => {
        const minVal = parseFloat(document.getElementById('filter-price-min').value);
        const maxVal = parseFloat(document.getElementById('filter-price-max').value);
        this.categoryPageFilters.minPrice = !isNaN(minVal) ? minVal : null;
        this.categoryPageFilters.maxPrice = !isNaN(maxVal) ? maxVal : null;
        this.renderCatalogGrid();
      });
    }

    // All Category Master Header & Checkbox Click
    const allCatHeader = document.getElementById('all-category-header');
    const toggleIcon = document.getElementById('dept-toggle-icon');
    const subcatsList = document.getElementById('dept-subcategories');

    if (allCatHeader) {
      allCatHeader.addEventListener('click', (e) => {
        // If clicked on toggle collapse icon
        if (e.target.closest('#dept-toggle-icon')) {
          e.stopPropagation();
          e.preventDefault();
          if (subcatsList) subcatsList.classList.toggle('collapsed');
          if (toggleIcon) toggleIcon.classList.toggle('collapsed');
          return;
        }

        e.preventDefault();
        // If collapsed, expand it
        if (subcatsList && subcatsList.classList.contains('collapsed')) {
          subcatsList.classList.remove('collapsed');
          if (toggleIcon) toggleIcon.classList.remove('collapsed');
        }

        // Trigger smooth cascade select for All Category
        this.switchCategory('all_categories', true);
      });
    }

    if (toggleIcon) {
      toggleIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (subcatsList) subcatsList.classList.toggle('collapsed');
        toggleIcon.classList.toggle('collapsed');
      });
    }

    // Subcategory item click listeners (Beauty, Electronics, Appliances, etc.)
    document.querySelectorAll('.subcat-label').forEach(label => {
      label.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const catKey = label.dataset.cat;
        if (!catKey) return;

        // If this category is already the only one selected, clicking it again toggles back to 'all_categories' smoothly
        if (this.selectedCategory === catKey) {
          this.switchCategory('all_categories', true);
        } else {
          // Select only this category
          this.switchCategory(catKey);
        }
      });
    });

    // Deals & Discounts radio filter
    document.querySelectorAll('input[name="discount-filter"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.categoryPageFilters.minDiscount = parseInt(e.target.value, 10) || 0;
        this.renderCatalogGrid();
      });
    });

    // Breadcrumb link in sidebar
    const deptBreadcrumb = document.getElementById('sidebar-dept-breadcrumb');
    if (deptBreadcrumb) {
      deptBreadcrumb.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchCategory('all_categories');
      });
    }

    // Subnav special filter buttons (Today's Deals, Best Sellers)
    document.querySelectorAll('.swift-nav-btn[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.swift-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.currentView !== 'storefront') {
          this.switchView('storefront');
        }
        const filterType = btn.dataset.filter;
        if (filterType === 'deals') {
          this.selectedCategory = 'all';
          this.categoryPageFilters.minDiscount = 10;
          const discRadio = document.querySelector('input[name="discount-filter"][value="10"]');
          if (discRadio) discRadio.checked = true;
          const pageTitle = document.getElementById('page-deals-title');
          if (pageTitle) pageTitle.textContent = "Today's Deals";
          const allCatRadio = document.getElementById('all-category-radio');
          const allCatHeader = document.getElementById('all-category-header');
          if (allCatRadio) allCatRadio.checked = true;
          if (allCatHeader) allCatHeader.classList.add('active-all');
          document.querySelectorAll('.dept-subcat-input').forEach(i => i.checked = true);
          document.querySelectorAll('.subcat-label').forEach(l => l.classList.remove('selected-single'));
          const breadcrumb = document.getElementById('sidebar-dept-breadcrumb');
          if (breadcrumb) {
            breadcrumb.textContent = "All Category";
            breadcrumb.style.display = 'none';
          }
          window.location.hash = 'deals';
        } else if (filterType === 'bestsellers') {
          this.categoryPageFilters.sortBy = 'rating';
          if (this.catSortSelect) this.catSortSelect.value = 'rating';
          const pageTitle = document.getElementById('page-deals-title');
          if (pageTitle) pageTitle.textContent = "Best Sellers";
          window.location.hash = 'bestsellers';
        }
        this.renderCatalogGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // In Stock Only Checkbox
    const inStockCheckbox = document.getElementById('filter-in-stock-only');
    if (inStockCheckbox) {
      inStockCheckbox.addEventListener('change', (e) => {
        this.categoryPageFilters.inStockOnly = e.target.checked;
        this.renderCatalogGrid();
      });
    }

    // Sort Dropdown
    if (this.catSortSelect) {
      this.catSortSelect.addEventListener('change', (e) => {
        this.categoryPageFilters.sortBy = e.target.value;
        this.renderCatalogGrid();
      });
    }
  }

  resetCategoryFilters() {
    this.categoryPageFilters = {
      minPrice: null,
      maxPrice: null,
      selectedBrands: [],
      minRating: 0,
      minDiscount: 0,
      inStockOnly: false,
      sortBy: 'featured'
    };
    const minInput = document.getElementById('filter-price-min');
    const maxInput = document.getElementById('filter-price-max');
    if (minInput) minInput.value = '';
    if (maxInput) maxInput.value = '';

    const defaultRatingRadio = document.querySelector('input[name="cat-rating"][value="0"]');
    if (defaultRatingRadio) defaultRatingRadio.checked = true;

    const allDiscountRadio = document.querySelector('input[name="discount-filter"][value="0"]');
    if (allDiscountRadio) allDiscountRadio.checked = true;

    const inStockCheckbox = document.getElementById('filter-in-stock-only');
    if (inStockCheckbox) inStockCheckbox.checked = false;

    if (this.catSortSelect) this.catSortSelect.value = 'featured';

    if (this.filterBrandsContainer) {
      this.filterBrandsContainer.querySelectorAll('.brand-filter-cb').forEach(cb => {
        cb.checked = false;
      });
    }

    this.renderCatalogGrid();
  }

  updateSidebarBrands() {
    if (!this.filterBrandsContainer) return;

    let candidateProducts = this.products.filter(p => ALLOWED_CATEGORIES.includes(p.category));
    if (this.selectedCategory !== 'all') {
      candidateProducts = candidateProducts.filter(p => p.category === this.selectedCategory);
    }

    let displayBrands = [];
    if (this.selectedCategory === 'all') {
      // Show top 10 premier brands requested by user
      displayBrands = [...PREMIER_TOP_BRANDS];
    } else {
      // In specific department, calculate counts for items in that department
      const deptCounts = {};
      candidateProducts.forEach(p => {
        const b = (p.attributes && p.attributes['Brand']) ? p.attributes['Brand'] : (p.title.split(' ')[0] || 'SwiftOrbits');
        deptCounts[b] = (deptCounts[b] || 0) + 1;
      });
      // Prioritize top brands that belong to this category, then other brands
      const priorityInDept = PREMIER_TOP_BRANDS.filter(b => deptCounts[b] !== undefined);
      const otherInDept = Object.keys(deptCounts).filter(b => !priorityInDept.includes(b)).sort((a, b) => deptCounts[b] - deptCounts[a]);
      displayBrands = [...priorityInDept, ...otherInDept].slice(0, 10);
    }

    if (displayBrands.length === 0) {
      this.filterBrandsContainer.innerHTML = '<span style="font-size:0.8rem; color:#94a3b8;">No brands listed</span>';
      return;
    }

    this.filterBrandsContainer.innerHTML = displayBrands.map(brand => {
      const isChecked = this.categoryPageFilters.selectedBrands.includes(brand) ? 'checked' : '';
      const count = candidateProducts.filter(p => {
        const pb = (p.attributes && p.attributes['Brand']) ? p.attributes['Brand'] : p.title.split(' ')[0];
        return pb.toLowerCase() === brand.toLowerCase() || p.title.toLowerCase().includes(brand.toLowerCase());
      }).length;

      return `
        <label class="clean-checkbox-label">
          <input type="checkbox" class="brand-filter-cb" value="${brand}" ${isChecked} />
          <span>${brand} (${count})</span>
        </label>
      `;
    }).join('');

    this.filterBrandsContainer.querySelectorAll('.brand-filter-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = Array.from(this.filterBrandsContainer.querySelectorAll('.brand-filter-cb:checked')).map(c => c.value);
        this.categoryPageFilters.selectedBrands = selected;
        this.renderCatalogGrid();
      });
    });
  }

  switchCategory(categoryKey, animateCascade = false, scrollDirect = false) {
    const isAllDealsNav = (categoryKey === 'all');
    const effectiveCategory = isAllDealsNav ? 'appliances' : categoryKey;
    this.selectedCategory = (categoryKey === 'all_categories') ? 'all' : effectiveCategory;
    this.categoryPageFilters.selectedBrands = [];

    // Clear any active cascade timers
    if (this._catCascadeTimers) {
      this._catCascadeTimers.forEach(t => clearTimeout(t));
    }
    this._catCascadeTimers = [];

    // Update active state in subnav
    document.querySelectorAll('.swift-nav-btn').forEach(b => {
      if (isAllDealsNav) {
        if (b.dataset.category === 'all') b.classList.add('active');
        else b.classList.remove('active');
      } else {
        if (b.dataset.category === categoryKey) b.classList.add('active');
        else b.classList.remove('active');
      }
    });

    // Update Hero 3-Category Tabs active state (Kitchen, Beauty, Electronics)
    document.querySelectorAll('.hero-category-tab-card').forEach(tab => {
      if (tab.dataset.category === effectiveCategory) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Ensure Amazon Quad Category Cards stay uniform (no clicked tab outline)
    document.querySelectorAll('.bream-quad-card').forEach(card => {
      card.classList.remove('active-card');
    });

    // Synchronize category sidebar controls
    const allCatRadio = document.getElementById('all-category-radio');
    const allCatHeader = document.getElementById('all-category-header');
    const subcatInputs = document.querySelectorAll('.dept-subcat-input');
    const subcatLabels = document.querySelectorAll('.subcat-label');

    if (categoryKey === 'all_categories') {
      if (allCatRadio) allCatRadio.checked = true;
      if (allCatHeader) allCatHeader.classList.add('active-all');

      subcatLabels.forEach(l => l.classList.remove('selected-single'));

      // Auto smooth cascading selection of all subcategories
      subcatInputs.forEach((input, index) => {
        const label = input.closest('.subcat-label');
        if (animateCascade) {
          input.checked = false;
          const timer = setTimeout(() => {
            input.checked = true;
            if (label) {
              label.classList.add('cascading-highlight');
              setTimeout(() => label.classList.remove('cascading-highlight'), 360);
            }
          }, index * 45);
          this._catCascadeTimers.push(timer);
        } else {
          input.checked = true;
        }
      });
    } else {
      if (allCatRadio) allCatRadio.checked = false;
      if (allCatHeader) allCatHeader.classList.remove('active-all');

      subcatInputs.forEach(input => {
        const isTarget = (input.value === effectiveCategory);
        input.checked = isTarget;
        const label = input.closest('.subcat-label');
        if (label) {
          if (isTarget) {
            label.classList.add('selected-single');
          } else {
            label.classList.remove('selected-single');
          }
        }
      });
    }

    // Update centered page deals title and breadcrumb
    const pageTitle = document.getElementById('page-deals-title');
    const breadcrumb = document.getElementById('sidebar-dept-breadcrumb');

    if (categoryKey === 'all_categories') {
      if (pageTitle) pageTitle.textContent = "All Categories";
      if (breadcrumb) {
        breadcrumb.textContent = "All Category";
        breadcrumb.style.display = 'none';
      }
      this.categoryPageFilters.minDiscount = 0;
      const allDiscRadio = document.querySelector('input[name="discount-filter"][value="0"]');
      if (allDiscRadio) allDiscRadio.checked = true;
      window.location.hash = 'category=all';
    } else {
      const meta = CATEGORY_METADATA[effectiveCategory];
      const titleText = meta ? (meta.dealTitle || `${meta.title} Deals`) : `${effectiveCategory.toUpperCase()} Deals`;
      if (pageTitle) pageTitle.textContent = titleText;
      if (breadcrumb) {
        breadcrumb.textContent = `← Back to All Category`;
        breadcrumb.style.display = 'inline-block';
      }
      window.location.hash = isAllDealsNav ? 'category=all' : `category=${effectiveCategory}`;
    }

    // Ensure storefront view is active
    this.currentView = 'storefront';
    this.viewStorefront.classList.remove('hidden');
    if (this.viewProductDetail) this.viewProductDetail.classList.add('hidden');
    if (this.viewCategoryPage) this.viewCategoryPage.classList.add('hidden');
    this.viewAdmin.classList.add('hidden');
    if (this.topSwitchBtn) this.topSwitchBtn.textContent = '⚡ SwiftOrbits US Merchant Portal';

    // Update brands in sidebar
    this.updateSidebarBrands();

    // Render clean products
    this.renderCatalogGrid();
    if (scrollDirect) {
      const dealsSection = document.getElementById('page-deals-title') || document.querySelector('.clean-storefront-layout');
      if (dealsSection) {
        const headerOffset = 95;
        const elementPosition = dealsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else if (categoryKey === 'all' || categoryKey === 'all_categories') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  renderCategoryPage(categoryKey) {
    this.switchCategory(categoryKey);
  }

  switchView(viewName) {
    this.currentView = viewName;
    if (viewName === 'storefront') {
      if (this.liveOrderAlertPopup) this.liveOrderAlertPopup.classList.add('hidden');
      this.viewStorefront.classList.remove('hidden');
      if (this.viewProductDetail) this.viewProductDetail.classList.add('hidden');
      if (this.viewCategoryPage) this.viewCategoryPage.classList.add('hidden');
      this.viewAdmin.classList.add('hidden');
      if (this.topSwitchBtn) this.topSwitchBtn.textContent = '⚡ SwiftOrbits US Merchant Portal';
      if (!window.location.hash.startsWith('#category=') && !window.location.hash.startsWith('#deals') && !window.location.hash.startsWith('#bestsellers')) {
        window.location.hash = this.selectedCategory !== 'all' ? `category=${this.selectedCategory}` : 'category=all';
      }
      this.renderStorefront();
    } else if (viewName === 'product') {
      if (this.liveOrderAlertPopup) this.liveOrderAlertPopup.classList.add('hidden');
      this.viewStorefront.classList.add('hidden');
      this.viewAdmin.classList.add('hidden');
      if (this.viewCategoryPage) this.viewCategoryPage.classList.add('hidden');
      if (this.viewProductDetail) this.viewProductDetail.classList.remove('hidden');
      if (this.topSwitchBtn) this.topSwitchBtn.textContent = '⚡ SwiftOrbits US Merchant Portal';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = 'admin';
      this.viewAdmin.classList.remove('hidden');
      this.viewStorefront.classList.add('hidden');
      if (this.viewProductDetail) this.viewProductDetail.classList.add('hidden');
      if (this.viewCategoryPage) this.viewCategoryPage.classList.add('hidden');
      if (this.topSwitchBtn) this.topSwitchBtn.textContent = '🛒 Back to SwiftOrbits Storefront';
      this.renderAdmin();
      if (this.unreadOrders && this.unreadOrders.length > 0) {
        this.updateAlertBadgesUI();
        if (this.liveOrderAlertPopup) this.liveOrderAlertPopup.classList.remove('hidden');
      }
    }
  }

  renderAdminSubviews() {
    document.getElementById('admin-subview-inventory').classList.add('hidden');
    document.getElementById('admin-subview-orders').classList.add('hidden');
    document.getElementById('admin-subview-analytics').classList.add('hidden');
    const settingsView = document.getElementById('admin-subview-settings');
    if (settingsView) settingsView.classList.add('hidden');

    if (this.adminSubview === 'inventory') {
      document.getElementById('admin-subview-inventory').classList.remove('hidden');
    } else if (this.adminSubview === 'orders') {
      document.getElementById('admin-subview-orders').classList.remove('hidden');
    } else if (this.adminSubview === 'analytics') {
      document.getElementById('admin-subview-analytics').classList.remove('hidden');
      this.renderLedger();
    } else if (this.adminSubview === 'settings') {
      if (settingsView) settingsView.classList.remove('hidden');
      this.renderAdminSettingsUI();
    }
  }

  toggleModal(modalElem, show) {
    if (!modalElem) return;
    if (show) {
      modalElem.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } else {
      modalElem.classList.add('hidden');
      const anyModalOpen = document.querySelectorAll('.modal-overlay:not(.hidden)').length > 0;
      if (!anyModalOpen) {
        document.body.style.overflow = '';
      }
      if (modalElem === this.checkoutModal && window.location.hash.toLowerCase().startsWith('#product=')) {
        if (history.replaceState) {
          const newHash = this.selectedCategory && this.selectedCategory !== 'all' ? `#category=${this.selectedCategory}` : '#';
          history.replaceState(null, document.title, window.location.pathname + window.location.search + (newHash === '#' ? '' : newHash));
        }
      }
    }
  }

  updateQuadItemDOM(item, prod) {
    if (!item || !prod) return;

    item.dataset.sku = prod.sku;
    const brand = prod.attributes?.Brand || (prod.title ? prod.title.split(' ')[0] : 'Swift');
    item.dataset.brand = brand;
    item.dataset.category = prod.category;

    const regPrice = Number(prod.regular_price) || 0;
    const salePrice = Number(prod.sale_price) || regPrice;
    let discountPct = 0;
    if (regPrice > salePrice && regPrice > 0) {
      discountPct = Math.round(((regPrice - salePrice) / regPrice) * 100);
    } else if (prod.sold_percent > 0) {
      discountPct = Math.round(prod.sold_percent);
    } else {
      discountPct = 15;
    }

    const img = item.querySelector('.bream-quad-img');
    if (img) {
      img.src = prod.image;
      img.alt = prod.title || brand;
      img.onerror = () => { img.src = '/elec_phone.png'; };
    }

    const wrap = item.querySelector('.bream-quad-img-wrap');
    if (wrap) {
      let badge = wrap.querySelector('.bream-quad-deal-badge');
      if (discountPct > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'bream-quad-deal-badge';
          wrap.prepend(badge);
        }
        badge.textContent = `-${discountPct}% OFF`;
        badge.style.display = 'inline-block';
      } else if (badge) {
        badge.style.display = 'none';
      }
    }

    let info = item.querySelector('.bream-quad-info');
    let label = item.querySelector('.bream-quad-label');
    if (!info && label) {
      info = document.createElement('div');
      info.className = 'bream-quad-info';
      label.parentNode.insertBefore(info, label);
      info.appendChild(label);
    }

    if (label) {
      label.textContent = brand;
      label.title = prod.title;
    }

    if (info) {
      let tag = info.querySelector('.bream-quad-discount-tag');
      if (discountPct > 0) {
        if (!tag) {
          tag = document.createElement('span');
          tag.className = 'bream-quad-discount-tag';
          info.appendChild(tag);
        }
        tag.textContent = `-${discountPct}%`;
        tag.style.display = 'inline-block';
      } else if (tag) {
        tag.style.display = 'none';
      }
    }

    const savings = (regPrice - salePrice).toFixed(2);
    item.title = `${brand}: ${prod.title} — Was $${regPrice.toFixed(2)}, Now $${salePrice.toFixed(2)} (Save $${savings}, ${discountPct}% OFF)`;
  }

  renderHeroQuadShowcase() {
    const categories = ['appliances', 'electronics', 'beauty', 'health_household'];
    categories.forEach(cat => {
      const card = document.querySelector(`.bream-quad-card[data-category="${cat}"]`);
      if (!card) return;
      const items = card.querySelectorAll('.bream-quad-item');
      if (!items || items.length === 0) return;

      const catProds = this.products.filter(p => p.category === cat && p.image);
      if (catProds.length === 0) return;

      const startIdx = this.quadCardIndices ? (this.quadCardIndices[cat] || 0) : 0;
      items.forEach((item, slotIdx) => {
        const prod = catProds[(startIdx + slotIdx) % catProds.length];
        if (prod) {
          this.updateQuadItemDOM(item, prod);
        }
      });
    });

    this.initHeroQuadRotation();
  }

  rotateHeroQuadCategory(categoryKey) {
    if (this.quadIsHovered && this.quadIsHovered[categoryKey]) return;

    const card = document.querySelector(`.bream-quad-card[data-category="${categoryKey}"]`);
    if (!card) return;

    const items = card.querySelectorAll('.bream-quad-item');
    if (!items || items.length === 0) return;

    const catProds = this.products.filter(p => p.category === categoryKey && p.image);
    if (catProds.length < 4) return;

    const currentIdx = (this.quadCardIndices && this.quadCardIndices[categoryKey]) || 0;
    const nextIdx = (currentIdx + 4) % catProds.length;
    if (this.quadCardIndices) {
      this.quadCardIndices[categoryKey] = nextIdx;
    }

    items.forEach((item, slotIdx) => {
      const prod = catProds[(nextIdx + slotIdx) % catProds.length];
      if (!prod) return;

      // Stagger each slot for an elegant ripple wave animation
      setTimeout(() => {
        item.classList.add('quad-changing');
        item.classList.remove('quad-entering');

        setTimeout(() => {
          this.updateQuadItemDOM(item, prod);
          item.classList.remove('quad-changing');
          item.classList.add('quad-entering');

          setTimeout(() => {
            item.classList.remove('quad-entering');
          }, 450);
        }, 260);
      }, slotIdx * 65);
    });
  }

  initHeroQuadRotation() {
    if (this.quadRotationTimer) {
      clearInterval(this.quadRotationTimer);
      this.quadRotationTimer = null;
    }

    if (this.quadRotationEnabled === false) {
      return;
    }

    const categories = ['appliances', 'electronics', 'beauty', 'health_household'];
    categories.forEach(cat => {
      const card = document.querySelector(`.bream-quad-card[data-category="${cat}"]`);
      if (card && !card._hasHoverListeners) {
        card._hasHoverListeners = true;
        card.addEventListener('mouseenter', () => {
          if (this.quadIsHovered) this.quadIsHovered[cat] = true;
        });
        card.addEventListener('mouseleave', () => {
          if (this.quadIsHovered) this.quadIsHovered[cat] = false;
        });
      }
    });

    const intervalMs = Math.max(1000, (this.quadRotationIntervalSeconds || 10) * 1000);
    this.quadRotationTimer = setInterval(() => {
      categories.forEach((cat, cardIdx) => {
        setTimeout(() => {
          this.rotateHeroQuadCategory(cat);
        }, cardIdx * 100);
      });
    }, intervalMs);
  }

  async initSettings() {
    // 1. Load from localStorage
    const localSec = parseInt(localStorage.getItem('swift_quad_rotation_seconds') || '10', 10);
    this.quadRotationIntervalSeconds = (!isNaN(localSec) && localSec >= 1) ? localSec : 10;
    this.quadRotationEnabled = localStorage.getItem('swift_quad_rotation_enabled') !== 'false';

    // 2. Fetch authoritative settings from backend PostgreSQL
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.settings) {
          if (data.settings.hero_quad_rotation_seconds !== undefined) {
            const sec = parseInt(data.settings.hero_quad_rotation_seconds, 10);
            if (!isNaN(sec) && sec >= 1) {
              this.quadRotationIntervalSeconds = Math.max(1, Math.min(300, sec));
              localStorage.setItem('swift_quad_rotation_seconds', this.quadRotationIntervalSeconds.toString());
            }
          }
          if (data.settings.hero_quad_rotation_enabled !== undefined) {
            this.quadRotationEnabled = data.settings.hero_quad_rotation_enabled !== false;
            localStorage.setItem('swift_quad_rotation_enabled', this.quadRotationEnabled ? 'true' : 'false');
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch server settings, using local settings:', e.message);
    }

    this.renderAdminSettingsUI();
    this.initHeroQuadRotation();
  }

  renderAdminSettingsUI() {
    const sec = this.quadRotationIntervalSeconds || 10;
    const enabled = this.quadRotationEnabled !== false;

    if (this.adminRotatorSecondsVal) this.adminRotatorSecondsVal.textContent = sec;
    if (this.adminRotatorSlider) this.adminRotatorSlider.value = Math.min(60, Math.max(1, sec));
    if (this.adminRotatorNumInput) this.adminRotatorNumInput.value = sec;
    if (this.adminRotatorActiveSummary) {
      this.adminRotatorActiveSummary.textContent = enabled ? `${sec} Seconds` : 'Paused (Disabled)';
    }

    if (this.adminRotatorLiveIndicator) {
      this.adminRotatorLiveIndicator.innerHTML = enabled ?
        `<span style="width:6px; height:6px; border-radius:50%; background:#fff; display:inline-block;"></span> ACTIVE` :
        `<span style="width:6px; height:6px; border-radius:50%; background:#fff; display:inline-block;"></span> PAUSED`;
      this.adminRotatorLiveIndicator.style.background = enabled ? '#10b981' : '#64748b';
    }

    if (this.adminRotatorToggleActive) {
      this.adminRotatorToggleActive.checked = enabled;
    }

    if (this.statRotatorSpeed) {
      this.statRotatorSpeed.textContent = `${sec}s`;
    }
    if (this.statRotatorStatus) {
      this.statRotatorStatus.textContent = enabled ? `🟢 ${sec}s Cycle (Click to Edit)` : `⏸️ Paused (Click to Edit)`;
    }

    // Update preset buttons active highlight
    document.querySelectorAll('.rotator-preset-btn').forEach(btn => {
      const btnSec = parseInt(btn.dataset.seconds, 10);
      if (btnSec === sec) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  setQuadRotationSpeed(seconds, persist = true, notify = false) {
    const sec = Math.max(1, Math.min(300, parseInt(seconds, 10) || 10));
    this.quadRotationIntervalSeconds = sec;
    localStorage.setItem('swift_quad_rotation_seconds', sec.toString());

    this.renderAdminSettingsUI();
    this.initHeroQuadRotation();

    if (persist) {
      this.saveQuadRotationSettingsToServer({ hero_quad_rotation_seconds: sec });
    }

    if (notify) {
      this.showToast(`Hero Showcase rotation interval updated to ${sec} seconds!`, 'success');
    }
  }

  setQuadRotationEnabled(enabled, persist = true, notify = false) {
    this.quadRotationEnabled = !!enabled;
    localStorage.setItem('swift_quad_rotation_enabled', this.quadRotationEnabled ? 'true' : 'false');

    this.renderAdminSettingsUI();
    this.initHeroQuadRotation();

    if (persist) {
      this.saveQuadRotationSettingsToServer({ hero_quad_rotation_enabled: this.quadRotationEnabled });
    }

    if (notify) {
      this.showToast(this.quadRotationEnabled ? `Hero Showcase auto-rotation enabled!` : `Hero Showcase auto-rotation paused.`, 'info');
    }
  }

  async saveQuadRotationSettingsToServer(payload) {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Could not sync settings to server:', err.message);
    }
  }

  bindRotatorSettingsEvents() {
    // 1. Stat card click navigates to Settings tab
    const statCardRotator = document.getElementById('stat-card-rotator');
    if (statCardRotator) {
      statCardRotator.addEventListener('click', () => {
        document.querySelectorAll('.seller-tab-btn').forEach(b => b.classList.remove('active'));
        const settingsTabBtn = document.querySelector('.seller-tab-btn[data-admin-view="settings"]');
        if (settingsTabBtn) settingsTabBtn.classList.add('active');
        this.adminSubview = 'settings';
        this.renderAdminSubviews();
      });
    }

    // 2. Stepper buttons (Kam / Ziada)
    const minus5Btn = document.getElementById('admin-rotator-minus-5');
    if (minus5Btn) {
      minus5Btn.addEventListener('click', () => {
        this.setQuadRotationSpeed(Math.max(1, this.quadRotationIntervalSeconds - 5), true, true);
      });
    }

    const minus1Btn = document.getElementById('admin-rotator-minus-1');
    if (minus1Btn) {
      minus1Btn.addEventListener('click', () => {
        this.setQuadRotationSpeed(Math.max(1, this.quadRotationIntervalSeconds - 1), true, true);
      });
    }

    const plus1Btn = document.getElementById('admin-rotator-plus-1');
    if (plus1Btn) {
      plus1Btn.addEventListener('click', () => {
        this.setQuadRotationSpeed(Math.min(300, this.quadRotationIntervalSeconds + 1), true, true);
      });
    }

    const plus5Btn = document.getElementById('admin-rotator-plus-5');
    if (plus5Btn) {
      plus5Btn.addEventListener('click', () => {
        this.setQuadRotationSpeed(Math.min(300, this.quadRotationIntervalSeconds + 5), true, true);
      });
    }

    // 3. Slider
    const slider = document.getElementById('admin-rotator-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.quadRotationIntervalSeconds = val;
        if (this.adminRotatorSecondsVal) this.adminRotatorSecondsVal.textContent = val;
        if (this.adminRotatorNumInput) this.adminRotatorNumInput.value = val;
        if (this.adminRotatorActiveSummary) this.adminRotatorActiveSummary.textContent = `${val} Seconds`;
      });

      slider.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        this.setQuadRotationSpeed(val, true, true);
      });
    }

    // 4. Custom Number Input
    const numInput = document.getElementById('admin-rotator-num-input');
    if (numInput) {
      numInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        this.setQuadRotationSpeed(val, true, true);
      });
    }

    // 5. Preset chips
    document.querySelectorAll('.rotator-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sec = parseInt(btn.dataset.seconds, 10);
        this.setQuadRotationSpeed(sec, true, true);
      });
    });

    // 6. Active toggle
    const toggle = document.getElementById('admin-rotator-toggle-active');
    if (toggle) {
      toggle.addEventListener('change', (e) => {
        this.setQuadRotationEnabled(e.target.checked, true, true);
      });
    }

    // 7. Save button
    const saveBtn = document.getElementById('admin-rotator-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        saveBtn.textContent = '💾 Saving...';
        await this.saveQuadRotationSettingsToServer({
          hero_quad_rotation_seconds: this.quadRotationIntervalSeconds,
          hero_quad_rotation_enabled: this.quadRotationEnabled
        });
        localStorage.setItem('swift_quad_rotation_seconds', this.quadRotationIntervalSeconds.toString());
        localStorage.setItem('swift_quad_rotation_enabled', this.quadRotationEnabled ? 'true' : 'false');
        this.initHeroQuadRotation();
        this.showToast(`Hero Showcase settings saved (${this.quadRotationIntervalSeconds}s)!`, 'success');
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save & Apply Now';
      });
    }

    // 8. Reset button
    const resetBtn = document.getElementById('admin-rotator-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.quadRotationEnabled = true;
        this.setQuadRotationSpeed(10, true, true);
        this.showToast('Rotation speed reset to default 10 seconds.', 'info');
      });
    }

    // 9. Preview store button
    const previewBtn = document.getElementById('admin-rotator-preview-store-btn');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        this.switchView('storefront');
        window.scrollTo({ top: 380, behavior: 'smooth' });
        this.showToast(`Displaying storefront with ${this.quadRotationIntervalSeconds}s rotation.`, 'info');
      });
    }
  }

  handleQuadBrandClick(category, brand) {
    if (!category || !brand) return;

    // 1. Set selected category and selected brand
    this.selectedCategory = category;
    this.categoryPageFilters.selectedBrands = [brand];

    // 2. Ensure storefront view is active
    if (this.currentView !== 'storefront') {
      this.switchView('storefront');
    }

    // 3. Clear cascade timers if any
    if (this._catCascadeTimers) {
      this._catCascadeTimers.forEach(t => clearTimeout(t));
      this._catCascadeTimers = [];
    }

    // 4. Update Subnav buttons: highlight the category button
    document.querySelectorAll('.swift-nav-btn').forEach(b => {
      if (b.dataset.category === category) b.classList.add('active');
      else b.classList.remove('active');
    });

    // 5. Update sidebar category controls
    const allCatRadio = document.getElementById('all-category-radio');
    const allCatHeader = document.getElementById('all-category-header');
    if (allCatRadio) allCatRadio.checked = false;
    if (allCatHeader) allCatHeader.classList.remove('active-all');

    document.querySelectorAll('.dept-subcat-input').forEach(input => {
      const isTarget = (input.value === category);
      input.checked = isTarget;
      const label = input.closest('.subcat-label');
      if (label) {
        if (isTarget) label.classList.add('selected-single');
        else label.classList.remove('selected-single');
      }
    });

    // 6. Update breadcrumb
    const breadcrumb = document.getElementById('sidebar-dept-breadcrumb');
    if (breadcrumb) {
      breadcrumb.textContent = `← Back to All Category`;
      breadcrumb.style.display = 'inline-block';
    }

    // 7. Update brands in sidebar & check the selected brand's checkbox
    this.updateSidebarBrands();
    const brandCb = document.querySelector(`.brand-filter-cb[value="${brand}"]`);
    if (brandCb) brandCb.checked = true;

    // 8. Update page title
    const pageTitle = document.getElementById('page-deals-title');
    const matchingProds = this.products.filter(p => 
      p.category === category && (
        (p.attributes?.Brand && p.attributes.Brand.toLowerCase() === brand.toLowerCase()) || 
        (p.title && p.title.toLowerCase().includes(brand.toLowerCase()))
      )
    );
    if (pageTitle) {
      pageTitle.innerHTML = `<span style="color:#2563eb; font-weight:800;">${brand}</span> Collection <span class="deal-brand-count">(${matchingProds.length} Products &amp; Images)</span>`;
    }

    // 9. Render catalog grid immediately with filtered items silently in background
    this.renderCatalogGrid();

    // 10. Open Product Detail Page directly without scrolling down
    const targetProduct = this.products.find(p => {
      const matchesBrand = p.attributes?.Brand && p.attributes.Brand.toLowerCase() === brand.toLowerCase();
      const matchesTitle = p.title && p.title.toLowerCase().includes(brand.toLowerCase());
      if (category) {
        return p.category === category && (matchesBrand || matchesTitle);
      }
      return matchesBrand || matchesTitle;
    });

    if (targetProduct) {
      this.openCheckoutModal(targetProduct);
    }
  }

  renderAll() {
    this.renderStorefront();
    this.renderAdmin();
  }

  renderStorefront() {
    this.renderHeroQuadShowcase();
    this.updateSidebarBrands();
    this.renderCatalogGrid();
    this.updateHeaderCart();
  }

  renderFlashSales() {
    if (!this.flashProductsGrid) return;
    const flashItems = this.products.filter(p => p.is_flash_sale && p.stock_qty > 0);

    this.flashProductsGrid.innerHTML = flashItems.map(item => {
      const discountPercent = Math.round(((item.regular_price - item.sale_price) / item.regular_price) * 100);

      return `
        <div class="swift-product-card buy-item-card" data-sku="${item.sku}">
          <div class="prod-img-box">
            <img src="${item.image}" alt="${item.title}" class="prod-card-img" onerror="this.onerror=null; this.src='/elec_phone.png';" />
            <span class="discount-badge-tag">-${discountPercent}% OFF</span>
            <span class="prime-tag">⚡ Prime 2-Day</span>
          </div>
          <div class="prod-details-box">
            <div class="swift-prod-title">${item.title}</div>
            <div class="swift-price-area">
              <div class="swift-sale-price">$${item.sale_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div class="swift-regular-price">$${item.regular_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="rating-row">
              <span class="stars">★★★★★</span>
              <span>${item.rating} (${item.reviews_count.toLocaleString()})</span>
            </div>
            <button class="swift-buy-btn">Buy Now (USD $)</button>
          </div>
        </div>
      `;
    }).join('');

    this.flashProductsGrid.querySelectorAll('.buy-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const sku = card.dataset.sku;
        const product = this.products.find(p => p.sku === sku);
        if (product) this.openCheckoutModal(product);
      });
    });
  }

  renderCatalogGrid() {
    let filtered = this.products.filter(p => ALLOWED_CATEGORIES.includes(p.category));

    // Availability filter
    if (this.categoryPageFilters.inStockOnly) {
      filtered = filtered.filter(p => p.stock_qty > 0);
    }

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Search query filter
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Price range filter
    if (this.categoryPageFilters.minPrice !== null) {
      filtered = filtered.filter(p => (p.sale_price || p.regular_price) >= this.categoryPageFilters.minPrice);
    }
    if (this.categoryPageFilters.maxPrice !== null) {
      filtered = filtered.filter(p => (p.sale_price || p.regular_price) <= this.categoryPageFilters.maxPrice);
    }

    // Deals & Discounts radio filter
    if (this.categoryPageFilters.minDiscount > 0) {
      filtered = filtered.filter(p => {
        const salePrice = p.sale_price || p.regular_price;
        const discountPercent = p.regular_price > salePrice ? Math.round(((p.regular_price - salePrice) / p.regular_price) * 100) : 0;
        return discountPercent >= this.categoryPageFilters.minDiscount;
      });
    }

    // Brands filter
    if (this.categoryPageFilters.selectedBrands && this.categoryPageFilters.selectedBrands.length > 0) {
      filtered = filtered.filter(p => {
        const b = (p.attributes && p.attributes['Brand']) ? p.attributes['Brand'] : (p.title.split(' ')[0] || 'SwiftOrbits');
        return this.categoryPageFilters.selectedBrands.some(sel =>
          sel.toLowerCase() === b.toLowerCase() ||
          p.title.toLowerCase().includes(sel.toLowerCase())
        );
      });
    }

    // Sorting
    if (this.categoryPageFilters.sortBy === 'price-asc') {
      filtered.sort((a, b) => (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price));
    } else if (this.categoryPageFilters.sortBy === 'price-desc') {
      filtered.sort((a, b) => (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price));
    } else if (this.categoryPageFilters.sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Update count info
    if (this.catalogCountInfo) {
      this.catalogCountInfo.textContent = `Showing ${filtered.length} deals`;
    }

    // Empty state
    if (filtered.length === 0) {
      if (this.productsGrid) this.productsGrid.innerHTML = '';
      if (this.catEmptyState) {
        this.catEmptyState.classList.remove('hidden');
        this.catEmptyState.style.display = 'block';
      }
      return;
    }

    if (this.catEmptyState) {
      this.catEmptyState.classList.add('hidden');
      this.catEmptyState.style.display = 'none';
    }

    if (this.productsGrid) {
      this.productsGrid.innerHTML = filtered.map(item => {
        const salePrice = item.sale_price || item.regular_price;
        const discountPercent = item.regular_price > salePrice ? Math.round(((item.regular_price - salePrice) / item.regular_price) * 100) : 0;
        const wholePart = Math.floor(salePrice);
        const fractionPart = Math.round((salePrice - wholePart) * 100).toString().padStart(2, '0');

        return `
          <div class="clean-product-card" data-sku="${item.sku}">
            <!-- IMAGE CONTAINER WITH YELLOW CIRCULAR QUICK-ADD BUTTON -->
            <div class="clean-card-img-wrap">
              <img src="${item.image}" alt="${item.title}" class="clean-card-img" onerror="this.onerror=null; this.src='/elec_phone.png';" />
              <button class="card-quick-add-btn" data-sku="${item.sku}" title="Quick Buy / Add" aria-label="Add to cart">+</button>
            </div>

            <!-- CARD BODY -->
            <div class="clean-card-body">
              <!-- RED DEAL BADGE ROW -->
              <div class="clean-deal-row">
                ${discountPercent > 0 ? `<span class="clean-deal-pill">${discountPercent}% off</span>` : ''}
                <span class="clean-deal-label">Limited time deal</span>
              </div>

              <!-- CLEAN PRICE ROW -->
              <div class="clean-price-row">
                <span class="clean-currency">$</span>
                <span class="clean-price-whole">${wholePart}</span>
                <span class="clean-price-fraction">${fractionPart}</span>
                ${item.regular_price > salePrice ? `
                  <span class="clean-typical-wrap">
                    Typical: <span class="clean-typical-price">$${item.regular_price.toFixed(2)}</span>
                  </span>
                ` : ''}
              </div>

              <!-- PRODUCT TITLE (2-LINE CLAMP) -->
              <div class="clean-product-title" title="${item.title}">${item.title}</div>

              <!-- RATING & REVIEWS -->
              <div class="clean-rating-row">
                <span class="clean-stars">★★★★☆</span>
                <span class="clean-rating-score">${item.rating || '4.8'}</span>
                <span class="clean-reviews-count">(${(item.reviews_count || 120).toLocaleString()})</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      this.productsGrid.querySelectorAll('.clean-product-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.card-quick-add-btn')) return;
          const sku = card.dataset.sku;
          const product = this.products.find(p => p.sku === sku);
          if (product) this.openCheckoutModal(product);
        });
      });

      this.productsGrid.querySelectorAll('.card-quick-add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const sku = btn.dataset.sku;
          const product = this.products.find(p => p.sku === sku);
          if (product) {
            this.addToCart(product, 1);
          }
        });
      });
    }
  }

  addToCart(product, quantity = 1) {
    if (!product) return;
    const qty = Math.max(1, parseInt(quantity) || 1);
    const unitPrice = parseFloat(product.sale_price || product.regular_price || 0);

    // Check if this item is already in cart on this PC
    const existing = this.myOrders.find(item => item.sku === product.sku && item.is_cart_item);
    if (existing) {
      existing.quantity = (parseInt(existing.quantity) || 1) + qty;
      existing.grand_total = Math.round(existing.quantity * unitPrice * 100) / 100;
      existing.subtotal = existing.grand_total;
    } else {
      const cartItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        order_number: 'CART-' + (product.sku || Math.floor(Math.random() * 10000)),
        product_id: product.id,
        product_title: product.title,
        sku: product.sku,
        category: product.category,
        unit_price: unitPrice,
        quantity: qty,
        subtotal: Math.round(qty * unitPrice * 100) / 100,
        grand_total: Math.round(qty * unitPrice * 100) / 100,
        image: product.image || '/elec_phone.png',
        order_status: 'in_cart',
        is_cart_item: true,
        created_at: new Date().toISOString()
      };
      this.myOrders.unshift(cartItem);
    }

    this.saveCustomerLocalOrders();
    this.updateHeaderCart();
    this.showToast(`🛒 Added to Cart: ${product.title} (Qty: ${qty})`, 'success');
  }

  updateHeaderCart() {
    if (!this.cartCountBadge || !this.headerCartTotal) return;

    // ONLY show items added to cart or placed on THIS individual PC
    const activeItems = (this.myOrders || []).filter(o => o.order_status !== 'cancelled');
    const totalCount = activeItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
    const totalSpent = activeItems.reduce((sum, item) => sum + (parseFloat(item.grand_total) || 0), 0);

    this.cartCountBadge.textContent = totalCount;
    this.headerCartTotal.textContent = `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  openProductDetailPage(product) {
    if (!product) return;
    this.activeModalProduct = product;

    // Direct Page Route Hash (Amazon-style clean routing)
    if (product.sku && (!window.location.hash.toLowerCase().startsWith('#product=') || decodeURIComponent(window.location.hash.replace(/^#product=/i, '')) !== product.sku)) {
      window.location.hash = 'product=' + encodeURIComponent(product.sku);
    }

    // Breadcrumbs Navigation
    const crumbCat = document.getElementById('pdp-crumb-cat');
    if (crumbCat) {
      const catName = product.category ? (product.category.charAt(0).toUpperCase() + product.category.slice(1)) : 'Department';
      crumbCat.textContent = catName;
      crumbCat.href = `#category=${product.category || 'all'}`;
    }

    const brandName = product.attributes?.Brand || 'SwiftOrbits Choice';
    const crumbBrand = document.getElementById('pdp-crumb-brand');
    if (crumbBrand) crumbBrand.textContent = brandName;

    const crumbTitle = document.getElementById('pdp-crumb-title');
    if (crumbTitle) crumbTitle.textContent = product.title;

    // Brand Store Link
    const brandNameTag = document.getElementById('pdp-brand-name-tag');
    if (brandNameTag) brandNameTag.textContent = brandName;

    // Title & SKU & Department badge
    const titleEl = document.getElementById('checkout-product-title');
    if (titleEl) titleEl.textContent = product.title;

    const skuEl = document.getElementById('checkout-product-sku');
    if (skuEl) skuEl.textContent = `SKU: ${product.sku}`;

    const catBadge = document.getElementById('modal-product-cat');
    if (catBadge) catBadge.textContent = product.category ? product.category.toUpperCase() : 'DEPARTMENT';

    // Main Product Image
    const mainImg = document.getElementById('modal-product-img');
    if (mainImg) {
      mainImg.src = product.image;
      mainImg.alt = product.title;
      mainImg.onerror = () => { mainImg.src = '/elec_phone.png'; };
    }

    // Populate Brand Image Gallery / More Images from this Brand
    const galleryContainer = document.getElementById('modal-brand-gallery');
    const galleryThumbs = document.getElementById('modal-brand-gallery-thumbs');
    const galleryBrandName = document.getElementById('modal-gallery-brand-name');

    if (galleryContainer && galleryThumbs) {
      if (brandName) {
        let brandProducts = this.products.filter(p => 
          (p.attributes?.Brand && p.attributes.Brand.toLowerCase() === brandName.toLowerCase()) || 
          (p.title && p.title.toLowerCase().includes(brandName.toLowerCase()))
        );

        // If this brand has few products in catalog, include top related items from this department
        if (brandProducts.length < 2 && product.category) {
          const relatedDept = this.products.filter(p => p.category === product.category && p.sku !== product.sku);
          brandProducts = [...brandProducts, ...relatedDept.slice(0, 6)];
        }

        if (brandProducts.length > 1) {
          galleryContainer.classList.remove('hidden');
          const isSingleBrand = brandProducts.every(bp => bp.attributes?.Brand?.toLowerCase() === brandName.toLowerCase());
          if (galleryBrandName) {
            galleryBrandName.textContent = isSingleBrand 
              ? `${brandName} Image Gallery (${brandProducts.length} Items)`
              : `${brandName} & Related ${product.category ? product.category.toUpperCase() : ''} Gallery (${brandProducts.length} Items)`;
          }

          galleryThumbs.innerHTML = brandProducts.map(bp => `
            <div class="modal-brand-thumb-item ${bp.sku === product.sku ? 'active' : ''}" data-sku="${bp.sku}" title="${bp.title} - $${(bp.sale_price || bp.regular_price).toFixed(2)}">
              <img src="${bp.image}" alt="${bp.title}" class="modal-brand-thumb-img" onerror="this.src='/elec_phone.png'" />
            </div>
          `).join('');

          galleryThumbs.querySelectorAll('.modal-brand-thumb-item').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
              e.stopPropagation();
              const targetSku = thumb.dataset.sku;
              const targetProd = this.products.find(p => p.sku === targetSku);
              if (targetProd) {
                this.openProductDetailPage(targetProd);
              }
            });
          });
        } else {
          galleryContainer.classList.add('hidden');
        }
      } else {
        galleryContainer.classList.add('hidden');
      }
    }

    // Pricing & Savings calculation
    const salePrice = product.sale_price || product.regular_price;
    const regPrice = product.regular_price;
    const discountPercent = product.sale_price ? Math.round(((regPrice - product.sale_price) / regPrice) * 100) : 0;
    const savingsAmount = product.sale_price ? (regPrice - product.sale_price) : 0;

    const discountEl = document.getElementById('modal-product-discount');
    if (discountEl) {
      if (discountPercent > 0) {
        discountEl.style.display = 'inline-block';
        discountEl.textContent = `-${discountPercent}% OFF`;
      } else {
        discountEl.style.display = 'none';
      }
    }

    const salePriceEl = document.getElementById('modal-sale-price');
    if (salePriceEl) salePriceEl.textContent = `$${salePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const regPriceEl = document.getElementById('modal-reg-price');
    if (regPriceEl) {
      if (product.sale_price && product.sale_price < product.regular_price) {
        regPriceEl.style.display = 'inline-block';
        regPriceEl.textContent = `$${regPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      } else {
        regPriceEl.style.display = 'none';
      }
    }

    const savingsPillEl = document.getElementById('modal-savings-pill');
    if (savingsPillEl) {
      if (savingsAmount > 0) {
        savingsPillEl.style.display = 'inline-block';
        savingsPillEl.textContent = `Save $${savingsAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      } else {
        savingsPillEl.style.display = 'none';
      }
    }

    // Buy Box Price Display
    const buyboxPriceEl = document.getElementById('pdp-buybox-price-display');
    if (buyboxPriceEl) buyboxPriceEl.textContent = `$${salePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    // Rating
    const ratingValEl = document.getElementById('modal-rating-val');
    if (ratingValEl) ratingValEl.textContent = `${product.rating || 4.8} / 5.0`;

    const reviewsCountEl = document.getElementById('modal-reviews-count');
    if (reviewsCountEl) reviewsCountEl.textContent = `(${(product.reviews_count || 120).toLocaleString()} Verified Reviews)`;

    // Specs Grid
    const specsContainer = document.getElementById('modal-specs-container');
    if (specsContainer) {
      const specsHtml = Object.entries(product.attributes || {}).map(([k, v]) => `
        <div class="spec-pill">
          <span class="spec-label">${k}</span>
          <span class="spec-val">${v}</span>
        </div>
      `).join('');

      specsContainer.innerHTML = specsHtml || `
        <div class="spec-pill">
          <span class="spec-label">Warranty</span>
          <span class="spec-val">1 Year US Authorized</span>
        </div>
        <div class="spec-pill">
          <span class="spec-label">Condition</span>
          <span class="spec-val">Brand New Sealed</span>
        </div>
      `;
    }

    // Overview Highlights
    const overviewList = document.getElementById('modal-overview-list');
    if (overviewList) {
      overviewList.innerHTML = `
        <li>Official US model with 1-Year Manufacturer Warranty & US Tech Support.</li>
        <li>Free SwiftOrbits Prime 2-Day Express Shipping nationwide across all 50 US states.</li>
        <li>Real-Time Inventory: ${product.stock_qty} Units available in US Fulfillment Hub.</li>
        <li>256-Bit SSL Encrypted checkout with 30-Day Free US Returns & Buyer Protection.</li>
      `;
    }

    // Form inputs
    const skuField = document.getElementById('order-sku');
    if (skuField) skuField.value = product.sku;

    const qtyField = document.getElementById('order-qty');
    if (qtyField) qtyField.value = 1;

    // Reset inputs
    const nameEl = document.getElementById('cust-name');
    const phoneEl = document.getElementById('cust-phone');
    const emailEl = document.getElementById('cust-email');
    const addrEl = document.getElementById('cust-address');
    const cityEl = document.getElementById('cust-city');
    const stateEl = document.getElementById('cust-state');

    if (nameEl) nameEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (emailEl) emailEl.value = '';
    if (addrEl) addrEl.value = '';
    if (cityEl) cityEl.value = '';
    if (stateEl) stateEl.value = '';

    this.updateCheckoutCalculations();

    // Render Related Products Recommendations
    this.renderRelatedPDPProducts(product);

    // Switch View cleanly to PDP (no popups)
    this.switchView('product');
  }

  openCheckoutModal(product) {
    this.openProductDetailPage(product);
  }

  closeProductDetailPage() {
    this.activeModalProduct = null;
    const returnHash = (this.selectedCategory && this.selectedCategory !== 'all') 
      ? `category=${this.selectedCategory}` 
      : 'category=all';
    window.location.hash = returnHash;
    this.switchView('storefront');
  }

  renderRelatedPDPProducts(currentProduct) {
    const grid = document.getElementById('pdp-related-grid');
    if (!grid) return;

    let related = this.products.filter(p => 
      p.sku !== currentProduct.sku && 
      (p.category === currentProduct.category || (p.attributes?.Brand && p.attributes.Brand === currentProduct.attributes?.Brand))
    );

    if (related.length < 4) {
      const extra = this.products.filter(p => p.sku !== currentProduct.sku && !related.some(r => r.sku === p.sku));
      related = [...related, ...extra];
    }

    const displayItems = related.slice(0, 6);

    grid.innerHTML = displayItems.map(item => {
      const sale = item.sale_price || item.regular_price;
      const reg = item.regular_price;
      const hasDiscount = item.sale_price && item.sale_price < reg;

      return `
        <div class="pdp-related-card" data-sku="${item.sku}">
          <div class="pdp-rel-img-wrap">
            <img src="${item.image}" alt="${item.title}" onerror="this.src='/elec_phone.png';" />
          </div>
          <div class="pdp-rel-title" title="${item.title}">${item.title}</div>
          <div class="pdp-rel-price">
            <span class="pdp-rel-sale">$${sale.toFixed(2)}</span>
            ${hasDiscount ? `<span class="pdp-rel-reg">$${reg.toFixed(2)}</span>` : ''}
          </div>
          <button type="button" class="btn btn-secondary pdp-rel-view-btn">View Item</button>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.pdp-related-card').forEach(card => {
      card.addEventListener('click', () => {
        const sku = card.dataset.sku;
        const targetProd = this.products.find(p => p.sku === sku);
        if (targetProd) {
          this.openProductDetailPage(targetProd);
        }
      });
    });
  }

  updateCheckoutCalculations() {
    if (!this.activeModalProduct) return;
    const qtyInput = document.getElementById('order-qty');
    const qty = Math.max(1, parseInt(qtyInput.value) || 1);

    const unitPrice = this.activeModalProduct.sale_price || this.activeModalProduct.regular_price;
    const shipping = 0.00; // Free US Prime 2-Day Shipping
    const grandTotal = (unitPrice * qty) + shipping;

    document.getElementById('calc-unit-price').textContent = `$${unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    document.getElementById('calc-grand-total').textContent = `$${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  async handleOrderSubmit(e) {
    e.preventDefault();
    const sku = document.getElementById('order-sku').value;
    const name = (document.getElementById('cust-name').value.trim()) || 'Johnathan Smith';
    const phone = (document.getElementById('cust-phone').value.trim()) || '+1 (555) 019-2834';
    const email = (document.getElementById('cust-email').value.trim()) || 'john.smith@swiftorbits.us';
    const address = (document.getElementById('cust-address').value.trim()) || '742 Evergreen Terrace, Suite 100';
    const city = (document.getElementById('cust-city').value.trim()) || 'Los Angeles';
    const state = document.getElementById('cust-state').value || 'CA';
    const quantity = Math.max(1, parseInt(document.getElementById('order-qty').value) || 1);

    const submitBtn = document.getElementById('submit-order-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing Instant Order...';
    }

    try {
      let orderSuccess = false;
      let newOrder = null;

      try {
        const res = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: name,
            customer_phone: phone,
            customer_email: email,
            shipping_address: address,
            city,
            state,
            sku,
            quantity
          })
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.ok && data.order) {
            newOrder = data.order;
            orderSuccess = true;
          }
        }
      } catch (netErr) {
        // Backend API offline or non-existent (e.g. Vercel static)
      }

      // If backend was unreachable or returned non-JSON, process order locally
      if (!orderSuccess) {
        const product = this.products.find(p => p.sku === sku) || this.activeModalProduct;
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const orderNumber = `SO-US-${randomNum}A`;
        const trackingNum = `9400${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;
        const unitPrice = product ? (product.sale_price || product.regular_price) : 29.99;
        const subtotal = parseFloat((unitPrice * quantity).toFixed(2));
        const shippingFee = subtotal >= 35 ? 0 : 5.99;
        const grandTotal = parseFloat((subtotal + shippingFee).toFixed(2));

        newOrder = {
          id: Date.now(),
          order_number: orderNumber,
          customer_name: name,
          customer_phone: phone,
          customer_email: email,
          shipping_address: address,
          city: city,
          state: state,
          tracking_number: trackingNum,
          order_status: 'processing',
          status: 'processing',
          subtotal: subtotal,
          shipping_fee: shippingFee,
          grand_total: grandTotal,
          product_title: product ? product.title : 'SwiftOrbits Catalog Item',
          sku: sku,
          quantity: quantity,
          created_at: new Date().toISOString(),
          items: [
            {
              id: Date.now() + 1,
              title: product ? product.title : 'SwiftOrbits Catalog Item',
              sku: sku,
              unit_price: unitPrice,
              quantity: quantity,
              line_total: subtotal,
              image: product ? product.image : ''
            }
          ]
        };

        if (product && typeof product.stock_qty === 'number') {
          product.stock_qty = Math.max(0, product.stock_qty - quantity);
          this.renderCatalogGrid();
        }

        orderSuccess = true;
      }

      if (newOrder) {
        // Ensure root level product_title, quantity, and sku exist
        if (!newOrder.product_title && newOrder.items && newOrder.items[0]) {
          newOrder.product_title = newOrder.items[0].title || newOrder.items[0].product_title;
          newOrder.sku = newOrder.items[0].sku;
          newOrder.quantity = newOrder.items[0].quantity;
        }

        // 1. Remove from visitor's cart if this product was in cart, and add to their personal placed orders
        this.myOrders = this.myOrders.filter(item => item.sku !== newOrder.sku || !item.is_cart_item);
        this.myOrders.unshift({
          ...newOrder,
          is_cart_item: false,
          order_status: newOrder.order_status || 'processing'
        });
        this.saveCustomerLocalOrders();

        // 2. Add to Admin authoritative store orders
        const existingIdx = this.adminOrders.findIndex(o => o.id === newOrder.id || o.order_number === newOrder.order_number);
        if (existingIdx === -1) {
          this.adminOrders.unshift(newOrder);
        } else {
          this.adminOrders[existingIdx] = newOrder;
        }

        // Broadcast to other tabs & windows in real-time
        if (typeof BroadcastChannel !== 'undefined') {
          try {
            const bc = new BroadcastChannel('swiftorbits_realtime');
            bc.postMessage({ type: 'order:created', order: newOrder });
          } catch (e) {}
        }

        // Real-time admin UI re-render, floating popup & sound chime (ADMIN BACKEND ONLY)
        if (this.currentView === 'admin') {
          this.renderAdmin();
          this.handleNewOrderNotification(newOrder);
        }

        if (this.currentView === 'product') {
          this.closeProductDetailPage();
        } else if (this.checkoutModal) {
          this.toggleModal(this.checkoutModal, false);
        }
        const orderForm = document.getElementById('order-form');
        if (orderForm) orderForm.reset();

        this.updateHeaderCart();
        this.showOrderSuccessConfirmation(newOrder);
        this.showToast(`✅ Order Placed Successfully! Ref: ${newOrder.order_number}`, 'success');
      }
    } catch (err) {
      this.showToast('Order placement notice: ' + err.message, 'warning');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'PLACE INSTANT ORDER (USD $)';
      }
    }
  }

  async handleAddProductSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('new-prod-title').value.trim();
    const sku = document.getElementById('new-prod-sku').value.trim().toUpperCase();
    const category = document.getElementById('new-prod-category').value;
    const stock_qty = parseInt(document.getElementById('new-prod-qty').value) || 0;
    const regular_price = parseFloat(document.getElementById('new-prod-reg-price').value) || 0;
    const saleVal = document.getElementById('new-prod-sale-price').value.trim();
    const sale_price = saleVal ? parseFloat(saleVal) : null;
    const rawAttrs = document.getElementById('new-prod-attrs').value.trim();
    const fileInput = document.getElementById('new-prod-file');
    const urlInput = document.getElementById('new-prod-img-url');

    let attributes = {};
    if (rawAttrs) {
      try { attributes = JSON.parse(rawAttrs); } catch (err) { alert('Invalid specs JSON.'); return; }
    }

    let imageUrl = (urlInput && urlInput.value.trim()) || '/elec_phone.png';

    const publishBtn = document.getElementById('submit-publish-prod-btn');
    if (publishBtn) {
      publishBtn.disabled = true;
      publishBtn.textContent = 'Publishing to Database...';
    }

    try {
      // 1. If image file selected, upload via /api/upload
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        const uploadRes = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: this.adminToken ? { Authorization: `Bearer ${this.adminToken}` } : {},
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.ok) {
          imageUrl = uploadData.url;
        } else {
          alert('Image upload failed: ' + uploadData.error);
          if (publishBtn) { publishBtn.disabled = false; publishBtn.textContent = 'Publish US Product'; }
          return;
        }
      }

      // 2. Publish Product to PostgreSQL
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.adminToken ? { Authorization: `Bearer ${this.adminToken}` } : {})
        },
        body: JSON.stringify({
          title,
          sku,
          category,
          regular_price,
          sale_price,
          stock_qty,
          attributes,
          image: imageUrl
        })
      });

      const data = await res.json();
      if (data.ok) {
        this.toggleModal(this.addProductModal, false);
        document.getElementById('add-product-form').reset();
        const previewWrap = document.getElementById('new-prod-preview-wrap');
        if (previewWrap) previewWrap.style.display = 'none';

        this.showToast('SwiftOrbits US catalog updated in PostgreSQL!', 'success');
        // Product will be added via realtime socket event or fetch
      } else {
        alert(data.error || 'Failed to publish product.');
      }
    } catch (err) {
      alert('Server connection error: ' + err.message);
    } finally {
      if (publishBtn) {
        publishBtn.disabled = false;
        publishBtn.textContent = 'Publish US Product';
      }
    }
  }

  renderAdmin() {
    const techStock = this.products.filter(p => p.category === 'electronics' || p.category === 'appliances').reduce((sum, p) => sum + p.stock_qty, 0);
    const fashionStock = this.products.filter(p => p.category === 'fashion').reduce((sum, p) => sum + p.stock_qty, 0);
    const beautyStock = this.products.filter(p => p.category === 'beauty').reduce((sum, p) => sum + p.stock_qty, 0);
    const activeOrders = this.adminOrders.filter(o => o.order_status === 'processing' || o.order_status === 'pending').length;

    const grossRev = this.adminOrders.filter(o => o.order_status !== 'cancelled').reduce((sum, o) => sum + (parseFloat(o.grand_total) || 0), 0);

    this.statElec.textContent = `${techStock} Units`;
    this.statFashion.textContent = `${fashionStock} Units`;
    this.statBeauty.textContent = `${beautyStock} Units`;
    this.statOrders.textContent = `${activeOrders} Orders`;
    this.statRevenue.textContent = `Gross: $${grossRev.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    if (this.statRotatorSpeed) {
      this.statRotatorSpeed.textContent = `${this.quadRotationIntervalSeconds || 10}s`;
    }
    if (this.statRotatorStatus) {
      this.statRotatorStatus.textContent = this.quadRotationEnabled !== false ?
        `🟢 ${this.quadRotationIntervalSeconds || 10}s Cycle (Click to Edit)` :
        `⏸️ Paused (Click to Edit)`;
    }

    this.renderAdminProductsTable();
    this.renderAdminOrdersTable();
    this.renderAdminSubviews();
    this.updateAlertBadgesUI();
  }

  renderAdminProductsTable() {
    this.adminProductsTbody.innerHTML = this.products.map(p => {
      const priceStr = p.sale_price ?
        `$${p.regular_price.toLocaleString('en-US', { minimumFractionDigits: 2 })} / <strong style="color:var(--swift-blue);">$${p.sale_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>` :
        `$${p.regular_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

      const attrFlat = Object.entries(p.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(' | ');

      return `
        <tr>
          <td style="font-family:var(--font-mono); font-weight:700;">${p.sku}</td>
          <td>
            <div style="display:flex; align-items:center; gap:12px;">
              <img src="${p.image}" style="width:38px; height:38px; object-fit:cover; border-radius:6px;" onerror="this.onerror=null; this.src='/elec_phone.png';" />
              <strong>${p.title}</strong>
            </div>
          </td>
          <td><span class="badge" style="background:#eff6ff; color:#2563eb; padding:3px 8px; border-radius:4px; font-weight:800; text-transform:uppercase; font-size:0.7rem;">${p.category}</span></td>
          <td>${priceStr}</td>
          <td><strong style="color:${p.stock_qty < 10 ? 'red' : 'inherit'}">${p.stock_qty}</strong></td>
          <td style="font-size:0.76rem; color:#64748b;">⭐ ${p.rating || 4.8} | ${attrFlat || '--'}</td>
          <td>
            <button class="btn btn-secondary btn-sm stock-adj-btn" data-sku="${p.sku}">+ Stock (+10)</button>
          </td>
        </tr>
      `;
    }).join('');

    this.adminProductsTbody.querySelectorAll('.stock-adj-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sku = btn.dataset.sku;
        const product = this.products.find(p => p.sku === sku);
        if (!product) return;

        btn.disabled = true;
        btn.textContent = '+ Adding...';

        try {
          const res = await fetch(`${API_BASE}/products/${product.id}/stock`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(this.adminToken ? { Authorization: `Bearer ${this.adminToken}` } : {})
            },
            body: JSON.stringify({ delta: 10 })
          });
          const data = await res.json();
          if (data.ok) {
            this.showToast(`Stock updated (+10) for ${sku} in database!`, 'success');
          } else {
            alert(data.error || 'Failed to update stock');
          }
        } catch (err) {
          alert('Network error: ' + err.message);
        } finally {
          btn.disabled = false;
          btn.textContent = '+ Stock (+10)';
        }
      });
    });
  }

  renderAdminOrdersTable() {
    this.adminOrdersTbody.innerHTML = this.adminOrders.map(o => {
      const firstItem = (Array.isArray(o.items) && o.items.length > 0) ? o.items[0] : {};
      const prodTitle = o.product_title || firstItem.title || firstItem.product_title || 'SwiftOrbits Catalog Item';
      const prodSku = o.sku || firstItem.sku || 'SO-US-01';
      const qty = o.quantity || firstItem.quantity || 1;
      const waMsg = encodeURIComponent(`Hello ${o.customer_name}, your SwiftOrbits US order ${o.order_number} for "${prodTitle}" has been updated. Grand Total: $${Number(o.grand_total).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
      const waUrl = `https://wa.me/${(o.customer_phone || '').replace(/[^0-9]/g, '')}?text=${waMsg}`;

      return `
        <tr>
          <td>
            <strong class="order-ref-click" data-order-id="${o.id}" style="font-family:var(--font-mono); color:var(--swift-blue); cursor:pointer; text-decoration:underline;" title="Click to view full order details">${o.order_number}</strong><br>
            <small style="color:#64748b;">${new Date(o.created_at || Date.now()).toLocaleDateString()}</small>
          </td>
          <td>
            <strong>${o.customer_name || 'US Customer'}</strong><br>
            <small style="color:#64748b;">${o.customer_phone || '-'}</small>
          </td>
          <td>
            <div><strong>${o.city || 'Orlando'}, ${o.state || 'US'}</strong></div>
            <small style="color:#64748b; font-size:0.74rem;">${o.shipping_address || 'US Address'}</small>
          </td>
          <td>
            <strong>${prodTitle}</strong> (x${qty})<br>
            <small style="font-family:var(--font-mono); color:#64748b;">${prodSku}</small>
          </td>
          <td><strong style="color:#10b981;">$${Number(o.grand_total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
          <td>
            <select class="status-select" data-order-id="${o.id}">
              <option value="pending" ${o.order_status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="processing" ${o.order_status === 'processing' ? 'selected' : ''}>Processing</option>
              <option value="dispatched" ${o.order_status === 'dispatched' ? 'selected' : ''}>Dispatched (USPS)</option>
              <option value="delivered" ${o.order_status === 'delivered' ? 'selected' : ''}>Delivered</option>
              <option value="cancelled" ${o.order_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-primary btn-sm view-order-detail-btn" data-order-id="${o.id}">👁️ Detail</button>
              <button class="btn btn-secondary btn-sm print-order-btn" data-order-id="${o.id}">🖨️ USPS Label</button>
              <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-sm" style="text-decoration:none;">📱 WA</a>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    this.adminOrdersTbody.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const orderId = sel.dataset.orderId;
        const newStatus = e.target.value;
        try {
          const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(this.adminToken ? { Authorization: `Bearer ${this.adminToken}` } : {})
            },
            body: JSON.stringify({ status: newStatus })
          });
          const data = await res.json();
          if (data.ok) {
            this.showToast(`Order status updated to '${newStatus}' in database!`, 'success');
          } else {
            alert(data.error || 'Failed to update order status');
          }
        } catch (err) {
          alert('Network error: ' + err.message);
        }
      });
    });

    this.adminOrdersTbody.querySelectorAll('.view-order-detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = btn.dataset.orderId;
        const order = this.adminOrders.find(o => String(o.id) === String(orderId) || o.order_number === orderId);
        if (order) this.openOrderDetailModal(order);
      });
    });

    this.adminOrdersTbody.querySelectorAll('.order-ref-click').forEach(el => {
      el.addEventListener('click', () => {
        const orderId = el.dataset.orderId;
        const order = this.adminOrders.find(o => String(o.id) === String(orderId) || o.order_number === orderId);
        if (order) this.openOrderDetailModal(order);
      });
    });

    this.adminOrdersTbody.querySelectorAll('.print-order-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = parseInt(btn.dataset.orderId);
        const order = this.adminOrders.find(o => o.id === orderId);
        if (order) this.openThermalReceipt(order);
      });
    });
  }

  renderLedger() {
    const validOrders = this.adminOrders.filter(o => o.order_status !== 'cancelled');
    const grossRev = validOrders.reduce((sum, o) => sum + (parseFloat(o.grand_total) || 0), 0);
    const processingCount = this.adminOrders.filter(o => o.order_status === 'processing' || o.order_status === 'pending').length;
    const deliveredCount = this.adminOrders.filter(o => o.order_status === 'delivered').length;
    const aov = validOrders.length > 0 ? (grossRev / validOrders.length) : 0;

    this.ledgerGross.textContent = `$${grossRev.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    this.ledgerProcessingCount.textContent = processingCount;
    this.ledgerDeliveredCount.textContent = deliveredCount;
    this.ledgerAov.textContent = `$${aov.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  openReceipt(order, defaultFormat = 'thermal') {
    this.currentReceiptOrder = order;
    this.renderReceiptContent(order);
    this.switchReceiptFormat(defaultFormat);
    this.toggleModal(this.receiptModal, true);
  }

  openThermalReceipt(order) {
    this.openReceipt(order, 'thermal');
  }

  switchReceiptFormat(format) {
    const tabThermal = document.getElementById('tab-receipt-thermal');
    const tabA4 = document.getElementById('tab-receipt-a4');
    const panelThermal = document.getElementById('receipt-thermal-view');
    const panelA4 = document.getElementById('receipt-a4-view');
    const printBtn = document.getElementById('print-a4-btn');

    if (format === 'a4') {
      if (tabA4) tabA4.classList.add('active');
      if (tabThermal) tabThermal.classList.remove('active');
      if (panelA4) panelA4.classList.remove('hidden');
      if (panelThermal) panelThermal.classList.add('hidden');
      if (printBtn) printBtn.innerHTML = '<span>📄 Print A4 Invoice</span>';
    } else {
      if (tabThermal) tabThermal.classList.add('active');
      if (tabA4) tabA4.classList.remove('active');
      if (panelThermal) panelThermal.classList.remove('hidden');
      if (panelA4) panelA4.classList.add('hidden');
      if (printBtn) printBtn.innerHTML = '<span>🖨️ Print Label</span>';
    }
  }

  getBarcodeSvgHtml() {
    return `
      <svg class="receipt-barcode-svg" viewBox="0 0 240 46" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="240" height="46" fill="#ffffff"/>
        <rect x="8" y="3" width="3" height="40" fill="#000"/>
        <rect x="14" y="3" width="2" height="40" fill="#000"/>
        <rect x="19" y="3" width="4" height="40" fill="#000"/>
        <rect x="26" y="3" width="2" height="40" fill="#000"/>
        <rect x="31" y="3" width="3" height="40" fill="#000"/>
        <rect x="37" y="3" width="5" height="40" fill="#000"/>
        <rect x="45" y="3" width="2" height="40" fill="#000"/>
        <rect x="50" y="3" width="4" height="40" fill="#000"/>
        <rect x="57" y="3" width="2" height="40" fill="#000"/>
        <rect x="62" y="3" width="6" height="40" fill="#000"/>
        <rect x="71" y="3" width="3" height="40" fill="#000"/>
        <rect x="77" y="3" width="2" height="40" fill="#000"/>
        <rect x="82" y="3" width="4" height="40" fill="#000"/>
        <rect x="89" y="3" width="3" height="40" fill="#000"/>
        <rect x="95" y="3" width="5" height="40" fill="#000"/>
        <rect x="103" y="3" width="2" height="40" fill="#000"/>
        <rect x="108" y="3" width="4" height="40" fill="#000"/>
        <rect x="115" y="3" width="2" height="40" fill="#000"/>
        <rect x="120" y="3" width="6" height="40" fill="#000"/>
        <rect x="129" y="3" width="3" height="40" fill="#000"/>
        <rect x="135" y="3" width="2" height="40" fill="#000"/>
        <rect x="140" y="3" width="4" height="40" fill="#000"/>
        <rect x="147" y="3" width="5" height="40" fill="#000"/>
        <rect x="155" y="3" width="2" height="40" fill="#000"/>
        <rect x="160" y="3" width="4" height="40" fill="#000"/>
        <rect x="167" y="3" width="2" height="40" fill="#000"/>
        <rect x="172" y="3" width="5" height="40" fill="#000"/>
        <rect x="180" y="3" width="3" height="40" fill="#000"/>
        <rect x="186" y="3" width="5" height="40" fill="#000"/>
        <rect x="194" y="3" width="2" height="40" fill="#000"/>
        <rect x="199" y="3" width="4" height="40" fill="#000"/>
        <rect x="206" y="3" width="2" height="40" fill="#000"/>
        <rect x="211" y="3" width="6" height="40" fill="#000"/>
        <rect x="220" y="3" width="3" height="40" fill="#000"/>
        <rect x="226" y="3" width="2" height="40" fill="#000"/>
        <rect x="231" y="3" width="4" height="40" fill="#000"/>
      </svg>
    `;
  }

  renderReceiptContent(order) {
    const thermalContainer = document.getElementById('thermal-receipt-content');
    const a4Container = document.getElementById('a4-receipt-content');
    const dateStr = new Date(order.created_at || Date.now()).toLocaleString();
    const trackingNum = order.tracking_number || `420902109205550192`;
    const firstItem = (Array.isArray(order.items) && order.items.length > 0) ? order.items[0] : {};
    const prodTitle = order.product_title || firstItem.title || firstItem.product_title || 'SwiftOrbits Catalog Item';
    const prodSku = order.sku || firstItem.sku || 'SO-US-ITEM';
    const qty = Number(order.quantity || firstItem.quantity || 1);
    const unitPrice = Number(order.unit_price || firstItem.unit_price || (order.grand_total ? (order.grand_total / qty) : 29.99));
    const subtotal = Number(order.subtotal) || (unitPrice * qty);
    const grandTotal = Number(order.grand_total) || subtotal;

    if (thermalContainer) {
      thermalContainer.innerHTML = `
        <div class="receipt-header">
          <div class="receipt-title">USPS PRIORITY EXPRESS</div>
          <div class="receipt-hub-subtitle">SWIFTORBITS USA MERCHANT HUB</div>
          <div style="font-size:0.75rem; color:#222; margin-top:3px;">2445 South Hiawassee Road, Orlando, FL 32835, USA</div>
          <div class="receipt-tagline">OFFICIAL VERIFIED DOMESTIC DISPATCH LABEL</div>
        </div>

        <div class="receipt-row"><span>TRACKING #:</span><strong>${trackingNum}</strong></div>
        <div class="receipt-row"><span>REF #:</span><strong>${order.order_number}</strong></div>
        <div class="receipt-row"><span>DATE:</span><span>${dateStr}</span></div>
        <div class="receipt-row"><span>SERVICE:</span><strong>SWIFTORBITS PRIME 2-DAY</strong></div>
        <div class="receipt-row"><span>STATUS:</span><strong style="text-transform:uppercase;">${order.order_status || 'PROCESSING'}</strong></div>

        <div class="receipt-divider"></div>

        <div class="receipt-row bold"><span>SHIP TO (US RECIPIENT):</span></div>
        <div class="receipt-row"><span>NAME:</span><span>${order.customer_name || 'US Customer'}</span></div>
        <div class="receipt-row"><span>PHONE:</span><span>${order.customer_phone || '+971 55 576 2122'}</span></div>
        <div class="receipt-row"><span>DESTINATION:</span><span>${order.city || 'Orlando'}, ${order.state || 'FL'} (USA)</span></div>
        <div style="font-size:0.76rem; margin:4px 0; color:#111; word-break:break-word;">ADDRESS: ${order.shipping_address || 'US Domestic Address'}</div>

        <div class="receipt-divider"></div>

        <div class="receipt-row bold"><span>ORDER CONTENTS</span></div>
        <div class="receipt-row">
          <span style="max-width:70%; word-break:break-word;">${prodTitle} [${prodSku}] x${qty}</span>
          <span>$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <div class="receipt-divider"></div>

        <div class="receipt-row"><span>Subtotal:</span><span>$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
        <div class="receipt-row"><span>Prime 2-Day Shipping:</span><span>FREE ($0.00)</span></div>
        <div class="receipt-row bold" style="font-size:0.98rem; margin-top:4px;">
          <span>GRAND TOTAL (USD $):</span>
          <span>$${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <div class="receipt-barcode-box">
          ${this.getBarcodeSvgHtml()}
          <div class="receipt-barcode-num">*${order.order_number}*</div>
        </div>

        <div class="receipt-footer-signature">
          SwiftOrbits US Infrastructure • Phone: +971 55 576 2122 • Email: info@swiftorbits.com
        </div>
      `;
    }

    if (a4Container) {
      a4Container.innerHTML = `
        <div class="a4-header">
          <div class="a4-logo-group">
            <div class="a4-brand">
              <span style="color:#2563eb;">⚡</span> SWIFTORBITS USA LLC
            </div>
            <div class="a4-sub-brand">Official Customer Tax Invoice & Packing Slip</div>
            <div style="margin-top:6px;">
              <span class="a4-verified-badge">✓ Verified Merchant Dispatch</span>
            </div>
          </div>
          <div class="a4-inv-title-box">
            <h2 class="a4-inv-heading">INVOICE</h2>
            <div class="a4-inv-meta">
              <div>Invoice #: <strong>INV-${order.order_number}</strong></div>
              <div>Date: <strong>${dateStr}</strong></div>
              <div>Status: <strong style="text-transform:uppercase; color:#2563eb;">${order.order_status || 'PROCESSING'}</strong></div>
            </div>
          </div>
        </div>

        <div class="a4-parties-grid">
          <div class="a4-party-col">
            <h4>From (Merchant Hub):</h4>
            <div class="party-name">SwiftOrbits USA LLC</div>
            <div class="party-info">
              2445 South Hiawassee Road<br>
              Orlando, FL 32835, USA<br>
              Phone: +971 55 576 2122<br>
              Email: info@swiftorbits.com
            </div>
          </div>
          <div class="a4-party-col">
            <h4>Bill & Ship To (Recipient):</h4>
            <div class="party-name">${order.customer_name || 'US Customer'}</div>
            <div class="party-info">
              ${order.shipping_address || 'US Domestic Address'}<br>
              ${order.city || 'Orlando'}, ${order.state || 'FL'} (USA)<br>
              Phone: ${order.customer_phone || '+971 55 576 2122'}<br>
              Shipping: SwiftOrbits Prime 2-Day Air
            </div>
          </div>
        </div>

        <table class="a4-items-table">
          <thead>
            <tr>
              <th style="width:36px;">#</th>
              <th>Item Description</th>
              <th style="width:110px;">SKU</th>
              <th style="width:50px; text-align:center;">Qty</th>
              <th style="width:90px; text-align:right;">Price</th>
              <th style="width:90px; text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td><strong>${prodTitle}</strong></td>
              <td><code>${prodSku}</code></td>
              <td style="text-align:center;">${qty}</td>
              <td style="text-align:right;">$${unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td style="text-align:right;">$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        <div class="a4-summary-container">
          <div class="a4-summary-box">
            <div class="a4-summary-row">
              <span>Subtotal:</span>
              <span>$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div class="a4-summary-row">
              <span>Prime 2-Day Shipping:</span>
              <span style="color:#16a34a; font-weight:700;">FREE ($0.00)</span>
            </div>
            <div class="a4-summary-row">
              <span>Estimated Sales Tax:</span>
              <span>$0.00</span>
            </div>
            <div class="a4-summary-row total">
              <span>Grand Total:</span>
              <span>$${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:16px;">
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:#475569; margin-bottom:4px;">USPS Domestic Tracking Barcode:</div>
            ${this.getBarcodeSvgHtml()}
            <div style="font-size:0.72rem; font-family:monospace; color:#334155; margin-top:2px; letter-spacing:1.5px;">${trackingNum}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.72rem; color:#64748b; margin-bottom:2px;">Dispatched by: SwiftOrbits Orlando Logistics</div>
            <div style="font-family:'Courier New', monospace; font-weight:700; font-size:0.8rem; color:#0f172a; border-bottom:1px solid #000; display:inline-block; padding-bottom:2px;">DX Farani / Logistics Officer</div>
          </div>
        </div>

        <div class="a4-footer">
          <div>Thank you for choosing SwiftOrbits! For queries, contact info@swiftorbits.com or +971 55 576 2122.</div>
          <div>Page 1 of 1</div>
        </div>
      `;
    }
  }

  printReceiptDocument(format, order) {
    if (!order && this.currentReceiptOrder) {
      order = this.currentReceiptOrder;
    }
    if (!order) {
      this.showToast('No active receipt found to print.', 'warning');
      return;
    }

    let printIframe = document.getElementById('swift-print-frame');
    if (!printIframe) {
      printIframe = document.createElement('iframe');
      printIframe.id = 'swift-print-frame';
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      printIframe.style.visibility = 'hidden';
      document.body.appendChild(printIframe);
    }

    const doc = printIframe.contentDocument || printIframe.contentWindow.document;
    doc.open();
    if (format === 'thermal') {
      doc.write(this.getThermalPrintHtml(order));
    } else {
      doc.write(this.getA4PrintHtml(order));
    }
    doc.close();

    setTimeout(() => {
      try {
        printIframe.contentWindow.focus();
        printIframe.contentWindow.print();
      } catch (err) {
        console.warn('Iframe printing fallback to window.print():', err);
        window.print();
      }
    }, 280);
  }

  getThermalPrintHtml(order) {
    const dateStr = new Date(order.created_at || Date.now()).toLocaleString();
    const trackingNum = `420902109205550192`;
    const unitPrice = Number(order.unit_price) || 0;
    const qty = Number(order.quantity) || 1;
    const subtotal = (unitPrice * qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const grandTotal = (Number(order.grand_total) || (unitPrice * qty)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SwiftOrbits_Thermal_Label_${order.order_number}</title>
  <style>
    @page {
      size: 4in 6in;
      margin: 3mm;
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #000000;
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .thermal-box {
      border: 2px dashed #000000;
      padding: 12px 10px;
      width: 100%;
      max-width: 3.85in;
      margin: 0 auto;
    }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
    .title { font-size: 15px; font-weight: 900; letter-spacing: 0.5px; }
    .subtitle { font-size: 11px; font-weight: 700; margin-top: 2px; }
    .addr { font-size: 9px; margin-top: 2px; }
    .tag { font-size: 8px; margin-top: 3px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
    .row.bold { font-weight: 900; }
    .divider { border-bottom: 1px dashed #000; margin: 8px 0; }
    .barcode-area { text-align: center; margin: 10px 0 4px 0; }
    .barcode-svg { width: 220px; height: 42px; display: block; margin: 0 auto; }
    .barcode-txt { font-size: 10px; font-weight: 700; font-family: monospace; letter-spacing: 2px; margin-top: 3px; }
    .footer { text-align: center; font-size: 9px; margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px; color: #222; }
  </style>
</head>
<body>
  <div class="thermal-box">
    <div class="header">
      <div class="title">USPS PRIORITY EXPRESS</div>
      <div class="subtitle">SWIFTORBITS USA MERCHANT HUB</div>
      <div class="addr">2445 South Hiawassee Road, Orlando, FL 32835, USA</div>
      <div class="tag">VERIFIED DOMESTIC DISPATCH LABEL</div>
    </div>

    <div class="row"><span>TRACKING #:</span><strong>${trackingNum}</strong></div>
    <div class="row"><span>REF #:</span><strong>${order.order_number}</strong></div>
    <div class="row"><span>DATE:</span><span>${dateStr}</span></div>
    <div class="row"><span>SERVICE:</span><strong>SWIFTORBITS PRIME 2-DAY</strong></div>
    <div class="row"><span>STATUS:</span><strong style="text-transform:uppercase;">${order.order_status || 'PROCESSING'}</strong></div>

    <div class="divider"></div>

    <div class="row bold"><span>SHIP TO (US RECIPIENT):</span></div>
    <div class="row"><span>NAME:</span><span>${order.customer_name || 'US Customer'}</span></div>
    <div class="row"><span>PHONE:</span><span>${order.customer_phone || '+971 55 576 2122'}</span></div>
    <div class="row"><span>DESTINATION:</span><span>${order.city || 'Orlando'}, ${order.state || 'FL'} (USA)</span></div>
    <div style="font-size:10px; margin:3px 0; word-break:break-word;">ADDRESS: ${order.shipping_address || 'US Domestic Address'}</div>

    <div class="divider"></div>

    <div class="row bold"><span>ORDER CONTENTS</span></div>
    <div class="row">
      <span style="max-width:70%; word-break:break-word;">${order.product_title} [${order.sku}] x${qty}</span>
      <span>$${subtotal}</span>
    </div>

    <div class="divider"></div>

    <div class="row"><span>Subtotal:</span><span>$${subtotal}</span></div>
    <div class="row"><span>Prime 2-Day Shipping:</span><span>FREE ($0.00)</span></div>
    <div class="row bold" style="font-size:13px; margin-top:4px;">
      <span>GRAND TOTAL (USD $):</span>
      <span>$${grandTotal}</span>
    </div>

    <div class="barcode-area">
      ${this.getBarcodeSvgHtml()}
      <div class="barcode-txt">*${order.order_number}*</div>
    </div>

    <div class="footer">
      SwiftOrbits US Infrastructure • Phone: +971 55 576 2122 • Email: info@swiftorbits.com
    </div>
  </div>
</body>
</html>`;
  }

  getA4PrintHtml(order) {
    const dateStr = new Date(order.created_at || Date.now()).toLocaleString();
    const trackingNum = `420902109205550192`;
    const unitPrice = Number(order.unit_price) || 0;
    const qty = Number(order.quantity) || 1;
    const subtotal = (unitPrice * qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const grandTotal = (Number(order.grand_total) || (unitPrice * qty)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SwiftOrbits_Invoice_${order.order_number}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #1e293b;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .a4-wrapper { width: 100%; max-width: 760px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 22px; }
    .brand { font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
    .brand span { color: #2563eb; }
    .tagline { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px; }
    .badge { display: inline-block; font-size: 10px; font-weight: 800; padding: 2px 8px; background: #e0f2fe; color: #0284c7; border-radius: 12px; margin-top: 4px; text-transform: uppercase; }
    .inv-title { font-size: 26px; font-weight: 900; color: #0f172a; margin: 0; text-align: right; }
    .meta { font-size: 12px; color: #475569; margin-top: 4px; text-align: right; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
    .col-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 6px; }
    .party-title { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    .party-details { font-size: 12px; color: #475569; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #f8fafc; color: #334155; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px; border-top: 1px solid #e2e8f0; border-bottom: 2px solid #cbd5e1; text-align: left; }
    td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 12px; color: #1e293b; }
    .sum-wrap { display: flex; justify-content: flex-end; margin-bottom: 24px; }
    .sum-table { width: 280px; }
    .sum-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; color: #475569; }
    .sum-row.total { border-top: 2px solid #0f172a; margin-top: 6px; padding-top: 8px; font-size: 16px; font-weight: 900; color: #0f172a; }
    .dispatch-info { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
    .footer { border-top: 1px dashed #cbd5e1; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b; }
    .stamp { border: 2px dashed #0284c7; color: #0284c7; padding: 5px 12px; border-radius: 6px; font-weight: 800; font-size: 10px; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="a4-wrapper">
    <div class="header">
      <div>
        <div class="brand"><span>⚡</span> SWIFTORBITS USA LLC</div>
        <div class="tagline">Official Customer Tax Invoice & Packing Slip</div>
        <div class="badge">✓ Verified Domestic Dispatch</div>
      </div>
      <div>
        <h1 class="inv-title">INVOICE</h1>
        <div class="meta">
          <div>Invoice #: <strong>INV-${order.order_number}</strong></div>
          <div>Date: <strong>${dateStr}</strong></div>
          <div>Status: <strong style="text-transform:uppercase; color:#2563eb;">${order.order_status || 'PROCESSING'}</strong></div>
        </div>
      </div>
    </div>

    <div class="grid">
      <div>
        <div class="col-title">From (Merchant Hub):</div>
        <div class="party-title">SwiftOrbits USA LLC</div>
        <div class="party-details">
          2445 South Hiawassee Road<br>
          Orlando, FL 32835, USA<br>
          Phone: +971 55 576 2122<br>
          Email: info@swiftorbits.com
        </div>
      </div>
      <div>
        <div class="col-title">Bill & Ship To (Recipient):</div>
        <div class="party-title">${order.customer_name || 'US Customer'}</div>
        <div class="party-details">
          ${order.shipping_address || 'US Domestic Address'}<br>
          ${order.city || 'Orlando'}, ${order.state || 'FL'} (USA)<br>
          Phone: ${order.customer_phone || '+971 55 576 2122'}<br>
          Shipping: SwiftOrbits Prime 2-Day Air
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:36px;">#</th>
          <th>Item Description</th>
          <th style="width:110px;">SKU</th>
          <th style="width:50px; text-align:center;">Qty</th>
          <th style="width:90px; text-align:right;">Price</th>
          <th style="width:90px; text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td><strong>${order.product_title}</strong></td>
          <td><code>${order.sku}</code></td>
          <td style="text-align:center;">${qty}</td>
          <td style="text-align:right;">$${unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="text-align:right;">$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>

    <div class="sum-wrap">
      <div class="sum-table">
        <div class="sum-row"><span>Subtotal:</span><span>$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
        <div class="sum-row"><span>Prime 2-Day Shipping:</span><span style="color:#16a34a; font-weight:700;">FREE ($0.00)</span></div>
        <div class="sum-row"><span>Estimated Sales Tax:</span><span>$0.00</span></div>
        <div class="sum-row total"><span>Grand Total:</span><span>$${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
      </div>
    </div>

    <div class="dispatch-info">
      <div>
        <div style="font-size:11px; font-weight:700; color:#475569; margin-bottom:4px;">USPS Domestic Tracking Barcode:</div>
        ${this.getBarcodeSvgHtml()}
        <div style="font-size:11px; font-family:monospace; color:#334155; margin-top:2px; letter-spacing:1.5px;">${trackingNum}</div>
      </div>
      <div style="text-align:right;">
        <div class="stamp">✓ Verified & Dispatched by Orlando Hub</div>
        <div style="margin-top:8px; font-size:11px; color:#64748b;">Logistics Dispatch Officer: <strong>DX Farani</strong></div>
      </div>
    </div>

    <div class="footer">
      <div>Thank you for choosing SwiftOrbits! For queries, contact info@swiftorbits.com or +971 55 576 2122.</div>
      <div>Page 1 of 1</div>
    </div>
  </div>
</body>
</html>`;
  }

  showToast(message, type = 'info') {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  updateUserProfileUI() {
    const userTextEl = document.querySelector('#header-user-profile .action-text');
    if (!userTextEl) return;
    if (this.authUser) {
      const firstName = this.authUser.name ? this.authUser.name.split(' ')[0] : 'Member';
      userTextEl.innerHTML = `
        <span class="small-text">Hello, ${firstName}</span>
        <span class="bold-text">Account & Prime</span>
      `;
    } else {
      userTextEl.innerHTML = `
        <span class="small-text">Hello, Sign In</span>
        <span class="bold-text">Account & Prime</span>
      `;
    }
  }

  openUserProfileModal() {
    if (!this.userProfileModal) return;
    const nameInput = document.getElementById('profile-name');
    const phoneInput = document.getElementById('profile-phone');
    const emailInput = document.getElementById('profile-email');
    const addrInput = document.getElementById('profile-address');
    const cityInput = document.getElementById('profile-city');
    const stateInput = document.getElementById('profile-state');

    const currentUser = this.authUser || this.userProfile;
    if (currentUser) {
      if (nameInput) nameInput.value = currentUser.name || '';
      if (phoneInput) phoneInput.value = currentUser.phone || '';
      if (emailInput) emailInput.value = currentUser.email || '';
      if (addrInput) addrInput.value = currentUser.address || '';
      if (cityInput) cityInput.value = currentUser.city || '';
      if (stateInput) stateInput.value = currentUser.state || 'CA';
    }
    this.toggleModal(this.userProfileModal, true);
  }

  handleUserProfileSubmit(e) {
    e.preventDefault();
    const updated = {
      name: document.getElementById('profile-name').value.trim() || 'Johnathan Smith',
      phone: document.getElementById('profile-phone').value.trim() || '+1 (555) 019-2834',
      email: document.getElementById('profile-email').value.trim() || 'john.smith@swiftorbits.us',
      address: document.getElementById('profile-address').value.trim() || '742 Evergreen Terrace',
      city: document.getElementById('profile-city').value.trim() || 'Los Angeles',
      state: document.getElementById('profile-state').value || 'CA',
      prime: true
    };
    this.userProfile = updated;
    localStorage.setItem('swift_user_profile', JSON.stringify(this.userProfile));
    if (this.authUser) {
      this.authUser.name = updated.name;
      this.authUser.email = updated.email;
      localStorage.setItem('swiftorbits_user', JSON.stringify(this.authUser));
    }
    this.updateUserProfileUI();
    this.toggleModal(this.userProfileModal, false);
    this.showToast('Profile & Prime Preferences saved successfully!', 'success');
  }

  // ==========================================
  // SWIFTORBITS CUSTOMER AUTHENTICATION ENGINE
  // ==========================================
  openAuthModal(view = 'signin', email = '') {
    if (!this.authModal) return;
    this.toggleModal(this.authModal, true);
    this.switchAuthView(view, { email });
  }

  closeAuthModal() {
    if (!this.authModal) return;
    this.toggleModal(this.authModal, false);
    this.clearAuthTimers();
    this.hideAuthAlert();
  }

  switchAuthView(viewName, { email = '', alert = null } = {}) {
    const views = ['signin', 'signup', 'otp', 'forgot', 'reset'];
    views.forEach(v => {
      const el = document.getElementById(`auth-view-${v}`);
      if (el) el.classList.add('hidden');
    });

    const targetEl = document.getElementById(`auth-view-${viewName}`);
    if (targetEl) targetEl.classList.remove('hidden');

    const titleEl = document.getElementById('auth-modal-title');
    const subEl = document.getElementById('auth-modal-sub');

    if (email) {
      this.pendingAuthEmail = email;
    }

    if (viewName === 'signin') {
      if (titleEl) titleEl.textContent = 'Sign In';
      if (subEl) subEl.textContent = 'Access your orders, fast nationwide dispatch & exclusive Prime deals';
    } else if (viewName === 'signup') {
      if (titleEl) titleEl.textContent = 'Create Account';
      if (subEl) subEl.textContent = 'Sign up for nationwide US shopping & fast delivery';
    } else if (viewName === 'otp') {
      if (titleEl) titleEl.textContent = 'Verify Your Email';
      if (subEl) subEl.textContent = 'Enter the 6-digit verification code sent to your email';
      const disp = document.getElementById('auth-otp-display-email');
      if (disp) disp.textContent = this.pendingAuthEmail || 'your email';
      const otpInput = document.getElementById('auth-otp-input');
      if (otpInput) {
        otpInput.value = '';
        setTimeout(() => otpInput.focus(), 150);
      }
    } else if (viewName === 'forgot') {
      if (titleEl) titleEl.textContent = 'Forgot Password';
      if (subEl) subEl.textContent = 'Enter your registered email to receive a 6-digit reset code';
      const forgotEmailInput = document.getElementById('auth-forgot-email');
      if (forgotEmailInput && this.pendingAuthEmail) {
        forgotEmailInput.value = this.pendingAuthEmail;
      }
    } else if (viewName === 'reset') {
      if (titleEl) titleEl.textContent = 'Set New Password';
      if (subEl) subEl.textContent = 'Enter the 6-digit reset code and your new password';
      const disp = document.getElementById('auth-reset-display-email');
      if (disp) disp.textContent = this.pendingAuthEmail || 'your email';
      const resetOtpInput = document.getElementById('auth-reset-otp-input');
      if (resetOtpInput) {
        resetOtpInput.value = '';
        setTimeout(() => resetOtpInput.focus(), 150);
      }
    }

    if (alert) {
      this.showAuthAlert(alert.message, alert.type || 'info');
    } else {
      this.hideAuthAlert();
    }
  }

  showAuthAlert(message, type = 'error') {
    if (!this.authAlertBox) return;
    this.authAlertBox.className = `auth-alert ${type}`;
    this.authAlertBox.innerHTML = message;
    this.authAlertBox.classList.remove('hidden');
  }

  hideAuthAlert() {
    if (!this.authAlertBox) return;
    this.authAlertBox.classList.add('hidden');
    this.authAlertBox.innerHTML = '';
  }

  startOtpExpiryTimer(durationSeconds = 60) {
    if (this.otpTimerInterval) clearInterval(this.otpTimerInterval);
    const timerEl = document.getElementById('auth-otp-timer');
    const verifyBtn = document.getElementById('auth-verify-btn');
    if (verifyBtn) verifyBtn.disabled = false;

    let remaining = durationSeconds;
    const updateDisplay = () => {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      if (timerEl) {
        timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      if (remaining <= 0) {
        clearInterval(this.otpTimerInterval);
        if (timerEl) timerEl.textContent = '00:00 (Expired)';
        if (verifyBtn) verifyBtn.disabled = true;
        this.showAuthAlert('This verification code has expired (60s limit). Please click "Resend Code".', 'error');
      }
      remaining--;
    };
    updateDisplay();
    this.otpTimerInterval = setInterval(updateDisplay, 1000);
  }

  startResendCooldownTimer(cooldownSeconds = 30) {
    if (this.resendCooldownInterval) clearInterval(this.resendCooldownInterval);
    const resendBtn = document.getElementById('auth-resend-otp-btn');
    if (!resendBtn) return;

    resendBtn.disabled = true;
    let remaining = cooldownSeconds;
    const updateBtn = () => {
      if (remaining <= 0) {
        clearInterval(this.resendCooldownInterval);
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend Code';
      } else {
        resendBtn.disabled = true;
        resendBtn.innerHTML = `Resend Code (<span>${remaining}</span>s)`;
        remaining--;
      }
    };
    updateBtn();
    this.resendCooldownInterval = setInterval(updateBtn, 1000);
  }

  clearAuthTimers() {
    if (this.otpTimerInterval) {
      clearInterval(this.otpTimerInterval);
      this.otpTimerInterval = null;
    }
    if (this.resendCooldownInterval) {
      clearInterval(this.resendCooldownInterval);
      this.resendCooldownInterval = null;
    }
  }

  bindAuthEvents() {
    if (this.closeAuthModalBtn) {
      this.closeAuthModalBtn.addEventListener('click', () => this.closeAuthModal());
    }

    // Password Visibility Toggles
    document.querySelectorAll('.auth-pwd-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input) {
          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          btn.textContent = isPassword ? '🙈' : '👁';
        }
      });
    });

    // Navigation Switchers
    const gotoSignupBtn = document.getElementById('auth-goto-signup-btn');
    if (gotoSignupBtn) gotoSignupBtn.addEventListener('click', () => this.switchAuthView('signup'));

    const gotoSigninBtn = document.getElementById('auth-goto-signin-btn');
    if (gotoSigninBtn) gotoSigninBtn.addEventListener('click', () => this.switchAuthView('signin'));

    const gotoForgotBtn = document.getElementById('auth-goto-forgot-btn');
    if (gotoForgotBtn) gotoForgotBtn.addEventListener('click', () => this.switchAuthView('forgot'));

    const forgotBackBtn = document.getElementById('auth-forgot-back-btn');
    if (forgotBackBtn) forgotBackBtn.addEventListener('click', () => this.switchAuthView('signin'));

    const otpBackBtn = document.getElementById('auth-otp-back-btn');
    if (otpBackBtn) otpBackBtn.addEventListener('click', () => this.switchAuthView('signin'));

    const resetCancelBtn = document.getElementById('auth-reset-cancel-btn');
    if (resetCancelBtn) resetCancelBtn.addEventListener('click', () => this.switchAuthView('signin'));

    // 1. Sign In Submission
    const signinForm = document.getElementById('auth-signin-form');
    if (signinForm) {
      signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-signin-email').value.trim();
        const password = document.getElementById('auth-signin-password').value;
        const submitBtn = document.getElementById('auth-signin-btn');

        this.hideAuthAlert();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();

          if (res.status === 403 && data.requiresVerification) {
            this.pendingAuthEmail = data.email || email;
            this.pendingAuthPurpose = 'email_verification';
            this.switchAuthView('otp', {
              email: this.pendingAuthEmail,
              alert: {
                message: 'Your email address has not been verified yet. We have sent a verification code to your email inbox.',
                type: 'info'
              }
            });
            this.startOtpExpiryTimer(60);
            this.startResendCooldownTimer(30);
            return;
          }

          if (!res.ok) {
            this.showAuthAlert(data.error || 'Invalid email or password.', 'error');
            return;
          }

          // Successful Login
          this.authUser = data.user;
          this.authToken = data.token;
          localStorage.setItem('swiftorbits_user', JSON.stringify(data.user));
          localStorage.setItem('swiftorbits_token', data.token);

          // Update userProfile name and email
          if (this.userProfile) {
            this.userProfile.name = data.user.name;
            this.userProfile.email = data.user.email;
            localStorage.setItem('swift_user_profile', JSON.stringify(this.userProfile));
          }

          this.updateUserProfileUI();
          this.closeAuthModal();
          this.showToast(`Welcome back, ${data.user.name}!`, 'success');
        } catch (err) {
          console.error('Sign-in error:', err);
          this.showAuthAlert('Unable to connect to the SwiftOrbits authentication service.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
        }
      });
    }

    // 2. Sign Up Submission
    const signupForm = document.getElementById('auth-signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('auth-signup-name').value.trim();
        const email = document.getElementById('auth-signup-email').value.trim();
        const password = document.getElementById('auth-signup-password').value;
        const confirmPassword = document.getElementById('auth-signup-confirm').value;
        const submitBtn = document.getElementById('auth-signup-btn');

        this.hideAuthAlert();

        if (password !== confirmPassword) {
          this.showAuthAlert('Passwords do not match. Please re-enter your password.', 'error');
          return;
        }

        if (password.length < 6) {
          this.showAuthAlert('Password must be at least 6 characters long.', 'error');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        try {
          const res = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, confirmPassword })
          });
          const data = await res.json();

          if (!res.ok) {
            this.showAuthAlert(data.error || 'Failed to create account.', 'error');
            return;
          }

          // 100% Real-Time Auto Login upon account creation
          this.authUser = data.user;
          this.authToken = data.token;
          localStorage.setItem('swiftorbits_user', JSON.stringify(data.user));
          localStorage.setItem('swiftorbits_token', data.token);

          if (this.userProfile) {
            this.userProfile.name = data.user.name;
            this.userProfile.email = data.user.email;
            localStorage.setItem('swift_user_profile', JSON.stringify(this.userProfile));
          }

          this.updateUserProfileUI();
          this.closeAuthModal();
          this.showToast(`Account created successfully! Welcome to SwiftOrbits, ${data.user.name}.`, 'success');
        } catch (err) {
          console.error('Sign-up error:', err);
          this.showAuthAlert('Network error during registration. Please try again.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Account & Sign In';
        }
      });
    }

    // 3. OTP Verification Submission
    const otpForm = document.getElementById('auth-otp-form');
    if (otpForm) {
      otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const otpInput = document.getElementById('auth-otp-input');
        const otp = otpInput ? otpInput.value.trim() : '';
        const submitBtn = document.getElementById('auth-verify-btn');

        this.hideAuthAlert();

        if (!/^\d{6}$/.test(otp)) {
          this.showAuthAlert('Please enter a valid 6-digit verification code.', 'error');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying...';

        try {
          const res = await fetch(`${API_BASE}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: this.pendingAuthEmail,
              otp,
              purpose: this.pendingAuthPurpose
            })
          });
          const data = await res.json();

          if (!res.ok) {
            this.showAuthAlert(data.error || 'Invalid verification code.', 'error');
            return;
          }

          if (this.pendingAuthPurpose === 'email_verification') {
            this.authUser = data.user;
            this.authToken = data.token;
            localStorage.setItem('swiftorbits_user', JSON.stringify(data.user));
            localStorage.setItem('swiftorbits_token', data.token);

            if (this.userProfile) {
              this.userProfile.name = data.user.name;
              this.userProfile.email = data.user.email;
              localStorage.setItem('swift_user_profile', JSON.stringify(this.userProfile));
            }

            this.updateUserProfileUI();
            this.closeAuthModal();
            this.showToast(`Email verified successfully! Welcome to SwiftOrbits, ${data.user.name}.`, 'success');
          } else if (this.pendingAuthPurpose === 'password_reset') {
            this.pendingResetToken = data.resetToken;
            this.switchAuthView('reset', {
              email: this.pendingAuthEmail,
              alert: {
                message: 'Verification code confirmed. Please set your new password.',
                type: 'success'
              }
            });
          }
        } catch (err) {
          console.error('OTP verification error:', err);
          this.showAuthAlert('Network error verifying code. Please try again.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Verify OTP & Continue';
        }
      });
    }

    // 4. Resend OTP Button
    const resendBtn = document.getElementById('auth-resend-otp-btn');
    if (resendBtn) {
      resendBtn.addEventListener('click', async () => {
        if (!this.pendingAuthEmail) return;
        resendBtn.disabled = true;
        this.hideAuthAlert();

        try {
          const res = await fetch(`${API_BASE}/auth/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: this.pendingAuthEmail,
              purpose: this.pendingAuthPurpose
            })
          });
          const data = await res.json();

          if (!res.ok) {
            this.showAuthAlert(data.error || 'Failed to resend code.', 'error');
            if (data.remainingSeconds) {
              this.startResendCooldownTimer(data.remainingSeconds);
            }
            return;
          }

          const otpInput = document.getElementById('auth-otp-input');
          if (otpInput) otpInput.value = '';
          const verifyBtn = document.getElementById('auth-verify-btn');
          if (verifyBtn) verifyBtn.disabled = false;

          this.startOtpExpiryTimer(60);
          this.startResendCooldownTimer(30);
          this.showAuthAlert('A new verification code has been dispatched to your email. Please check your inbox.', 'success');
        } catch (err) {
          console.error('Resend error:', err);
          this.showAuthAlert('Failed to dispatch code. Please check your internet connection.', 'error');
        }
      });
    }

    // 5. Forgot Password Submission
    const forgotForm = document.getElementById('auth-forgot-form');
    if (forgotForm) {
      forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-forgot-email').value.trim();
        const submitBtn = document.getElementById('auth-forgot-btn');

        this.hideAuthAlert();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending reset code...';

        try {
          const res = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const data = await res.json();

          this.pendingAuthEmail = email;
          this.pendingAuthPurpose = 'password_reset';

          this.switchAuthView('reset', {
            email,
            alert: {
              message: 'If an account exists with that email, a 60-second verification code has been sent to your email inbox.',
              type: 'info'
            }
          });
          this.startOtpExpiryTimer(60);
          this.startResendCooldownTimer(30);
        } catch (err) {
          console.error('Forgot password error:', err);
          this.showAuthAlert('Network error sending reset code. Please try again.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Password Reset Code';
        }
      });
    }

    // 6. Reset Password Submission
    const resetForm = document.getElementById('auth-reset-form');
    if (resetForm) {
      resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const otp = document.getElementById('auth-reset-otp-input').value.trim();
        const newPassword = document.getElementById('auth-reset-new-password').value;
        const confirmPassword = document.getElementById('auth-reset-confirm-password').value;
        const submitBtn = document.getElementById('auth-reset-submit-btn');

        this.hideAuthAlert();

        if (newPassword !== confirmPassword) {
          this.showAuthAlert('Passwords do not match.', 'error');
          return;
        }

        if (newPassword.length < 6) {
          this.showAuthAlert('Password must be at least 6 characters long.', 'error');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Resetting password...';

        try {
          const res = await fetch(`${API_BASE}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: this.pendingAuthEmail,
              otp,
              resetToken: this.pendingResetToken,
              newPassword,
              confirmPassword
            })
          });
          const data = await res.json();

          if (!res.ok) {
            this.showAuthAlert(data.error || 'Failed to reset password.', 'error');
            return;
          }

          this.switchAuthView('signin', {
            alert: {
              message: 'Password reset successfully! You can now log in with your new password.',
              type: 'success'
            }
          });
        } catch (err) {
          console.error('Reset password error:', err);
          this.showAuthAlert('Network error resetting password. Please try again.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Reset Password & Sign In';
        }
      });
    }
  }

  handleAuthSignOut() {
    this.authUser = null;
    this.authToken = null;
    localStorage.removeItem('swiftorbits_user');
    localStorage.removeItem('swiftorbits_token');
    this.updateUserProfileUI();
    if (this.userProfileModal) {
      this.toggleModal(this.userProfileModal, false);
    }
    this.showToast('You have been signed out successfully.', 'info');
  }

  openOrdersQueueModal() {
    this.renderCustomerOrdersQueue();
    this.toggleModal(this.ordersQueueModal, true);
  }

  renderCustomerOrdersQueue() {
    if (!this.ordersQueueModal) return;
    const totalCountEl = document.getElementById('queue-total-count');
    const totalSpentEl = document.getElementById('queue-total-spent');
    const listEl = document.getElementById('customer-orders-list');

    const validOrders = (this.myOrders || []).filter(o => o.order_status !== 'cancelled');
    const totalCount = validOrders.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
    const grossSpent = validOrders.reduce((sum, o) => sum + (parseFloat(o.grand_total) || 0), 0);

    if (totalCountEl) totalCountEl.textContent = totalCount;
    if (totalSpentEl) totalSpentEl.textContent = `$${grossSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    if (listEl) {
      if (!this.myOrders || this.myOrders.length === 0) {
        listEl.innerHTML = `
          <div style="text-align:center; padding: 40px 20px; color:#64748b;">
            <div style="font-size:2.5rem; margin-bottom:10px;">🛒</div>
            <h4 style="font-size:1.1rem; color:var(--swift-navy); margin-bottom:6px;">Your Cart is Empty</h4>
            <p style="font-size:0.85rem; margin-top:4px;">Browse items in the store and click <strong>"Add to Cart"</strong> to add items to your personal device cart.</p>
          </div>
        `;
      } else {
        listEl.innerHTML = this.myOrders.map(o => {
          const isCartItem = o.is_cart_item || o.order_status === 'in_cart';
          const isCancelled = o.order_status === 'cancelled';
          const isDelivered = o.order_status === 'delivered';
          const canModify = isCartItem || (!isCancelled && !isDelivered);

          let badgeHtml = '';
          if (isCartItem) {
            badgeHtml = `<span class="order-status-badge" style="background:#fef3c7; color:#92400e; font-weight:700;">🛒 In Cart</span>`;
          } else {
            badgeHtml = `<span class="order-status-badge status-${o.order_status}">${o.order_status}</span>`;
          }

          return `
            <div class="order-queue-card ${isCancelled ? 'is-cancelled' : ''}" data-order-id="${o.id}">
              <div style="display:flex; gap:12px; align-items:center; width:100%;">
                ${o.image ? `<img src="${o.image}" style="width:52px; height:52px; object-fit:cover; border-radius:6px; border:1px solid #e2e8f0; flex-shrink:0;" onerror="this.src='/elec_phone.png'" />` : ''}
                <div class="order-queue-left" style="flex:1;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="order-queue-num" style="font-family:var(--font-mono); font-size:0.82rem;">${o.order_number}</span>
                    ${badgeHtml}
                  </div>
                  <div class="order-queue-title" style="font-weight:600; margin:4px 0; font-size:0.92rem;">${o.product_title || 'SwiftOrbits Item'}</div>
                  <div class="order-queue-meta" style="display:flex; align-items:center; gap:8px; font-size:0.82rem; color:#64748b;">
                    ${canModify ? `
                      <div class="queue-qty-control" style="display:inline-flex; align-items:center; gap:6px;">
                        <span class="queue-qty-label">Qty:</span>
                        <button type="button" class="queue-qty-btn btn-qty-minus" data-order-id="${o.id}" title="Decrease quantity" ${o.quantity <= 1 ? 'disabled' : ''}>−</button>
                        <span class="queue-qty-val" style="font-weight:700;">${o.quantity}</span>
                        <button type="button" class="queue-qty-btn btn-qty-plus" data-order-id="${o.id}" title="Increase quantity">+</button>
                      </div>
                    ` : `
                      <span>Qty: <strong>${o.quantity}</strong></span>
                    `}
                    <span>•</span>
                    <span>Total: <strong style="${isCancelled ? 'text-decoration:line-through; color:#94a3b8;' : 'color:#10b981; font-weight:700;'}">$${Number(o.grand_total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
                    ${o.created_at ? `<span>•</span><span>${new Date(o.created_at).toLocaleDateString()}</span>` : ''}
                  </div>
                </div>
              </div>
              <div class="order-queue-actions" style="margin-top:10px; display:flex; gap:8px; justify-content:flex-end;">
                ${isCartItem ? `
                  <button type="button" class="btn btn-sm btn-primary queue-checkout-item-btn" data-order-id="${o.id}" data-sku="${o.sku}" style="background:#ffd814; color:#0f1111; border:1px solid #fcd200; font-weight:700; border-radius:6px; padding:6px 14px; cursor:pointer;">
                    ⚡ Buy Now
                  </button>
                  <button type="button" class="btn btn-sm btn-secondary queue-remove-btn" data-order-id="${o.id}" style="border-radius:6px; padding:6px 12px; cursor:pointer;">
                    🗑️ Remove
                  </button>
                ` : (canModify ? `
                  <button type="button" class="queue-btn queue-btn-edit queue-edit-btn" data-order-id="${o.id}">
                    <svg class="queue-btn-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button type="button" class="queue-btn queue-btn-cancel queue-cancel-btn" data-order-id="${o.id}">
                    <svg class="queue-btn-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <span>Cancel</span>
                  </button>
                ` : (isCancelled ? `
                  <button type="button" class="queue-btn queue-btn-remove queue-remove-btn" data-order-id="${o.id}" title="Remove from list">
                    <svg class="queue-btn-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>Remove</span>
                  </button>
                ` : ''))}
              </div>
            </div>
          `;
        }).join('');

        // Stepper: Minus
        listEl.querySelectorAll('.btn-qty-minus').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderId = btn.dataset.orderId;
            this.changeOrderQuantity(orderId, -1);
          });
        });

        // Stepper: Plus
        listEl.querySelectorAll('.btn-qty-plus').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderId = btn.dataset.orderId;
            this.changeOrderQuantity(orderId, 1);
          });
        });

        // Checkout Item from Cart
        listEl.querySelectorAll('.queue-checkout-item-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sku = btn.dataset.sku;
            const product = this.products.find(p => p.sku === sku);
            if (product) {
              this.toggleModal(this.ordersQueueModal, false);
              this.openProductDetailPage(product);
            }
          });
        });

        // Edit Button
        listEl.querySelectorAll('.queue-edit-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderId = btn.dataset.orderId;
            this.openEditOrderModal(orderId);
          });
        });

        // Cancel Button
        listEl.querySelectorAll('.queue-cancel-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderId = btn.dataset.orderId;
            this.cancelCustomerOrder(orderId);
          });
        });

        // Remove Button
        listEl.querySelectorAll('.queue-remove-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderId = btn.dataset.orderId;
            this.removeCustomerOrder(orderId);
          });
        });
      }
    }
  }

  changeOrderQuantity(orderId, delta) {
    const order = this.myOrders.find(o => String(o.id) === String(orderId));
    if (!order || order.order_status === 'cancelled') return;

    const currentQty = Number(order.quantity) || 1;
    const newQty = currentQty + delta;

    if (newQty < 1) {
      if (order.is_cart_item) {
        this.removeCustomerOrder(orderId);
      } else {
        if (confirm(`Quantity is 1. Do you want to cancel order #${order.order_number}?`)) {
          this.cancelCustomerOrder(orderId);
        }
      }
      return;
    }

    const unitPrice = Number(order.unit_price) || (Number(order.grand_total) / currentQty);
    const newTotal = Math.round(newQty * unitPrice * 100) / 100;

    order.quantity = newQty;
    order.subtotal = newTotal;
    order.grand_total = newTotal;

    this.saveCustomerLocalOrders();
    this.updateHeaderCart();
    this.renderCustomerOrdersQueue();

    // Sync to backend API if it was an already placed order
    if (!order.is_cart_item) {
      fetch(`/api/orders/${order.id}/customer-update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      }).catch(err => console.warn('Backend sync error:', err));
    }

    this.showToast(`Updated quantity: ${newQty} ($${newTotal.toFixed(2)})`, 'info');
  }

  openEditOrderModal(orderId) {
    const order = this.myOrders.find(o => String(o.id) === String(orderId));
    if (!order || !this.editOrderModal) return;

    this.editingOrderId = orderId;
    const idInput = document.getElementById('edit-order-id');
    const titleEl = document.getElementById('edit-order-product-title');
    const metaEl = document.getElementById('edit-order-meta-info');
    const qtyInput = document.getElementById('edit-order-qty');
    const nameInput = document.getElementById('edit-customer-name');
    const phoneInput = document.getElementById('edit-customer-phone');
    const addressInput = document.getElementById('edit-shipping-address');
    const cityInput = document.getElementById('edit-city');
    const stateInput = document.getElementById('edit-state');
    const subTitle = document.getElementById('edit-order-subtitle');

    const unitPrice = Number(order.unit_price) || (Number(order.grand_total) / (Number(order.quantity) || 1));

    if (idInput) idInput.value = order.id;
    if (subTitle) subTitle.textContent = `Order Ref: #${order.order_number}`;
    if (titleEl) titleEl.textContent = order.product_title;
    if (metaEl) metaEl.textContent = `SKU: ${order.sku || 'N/A'} • Unit Price: $${unitPrice.toFixed(2)}`;
    if (qtyInput) qtyInput.value = order.quantity || 1;
    if (nameInput) nameInput.value = order.customer_name || '';
    if (phoneInput) phoneInput.value = order.customer_phone || '';
    if (addressInput) addressInput.value = order.shipping_address || '';
    if (cityInput) cityInput.value = order.city || 'Orlando';
    if (stateInput) stateInput.value = order.state || 'FL';

    this.recalculateEditOrderTotal();
    this.toggleModal(this.editOrderModal, true);
  }

  recalculateEditOrderTotal() {
    const idInput = document.getElementById('edit-order-id');
    const qtyInput = document.getElementById('edit-order-qty');
    const totalEl = document.getElementById('edit-order-recalculated-total');
    if (!idInput || !qtyInput || !totalEl) return;

    const orderId = idInput.value;
    const order = this.myOrders.find(o => String(o.id) === String(orderId));
    if (!order) return;

    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    const unitPrice = Number(order.unit_price) || (Number(order.grand_total) / (Number(order.quantity) || 1));
    const total = Math.round(qty * unitPrice * 100) / 100;
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  handleEditOrderSubmit(e) {
    e.preventDefault();
    const idInput = document.getElementById('edit-order-id');
    const qtyInput = document.getElementById('edit-order-qty');
    const nameInput = document.getElementById('edit-customer-name');
    const phoneInput = document.getElementById('edit-customer-phone');
    const addressInput = document.getElementById('edit-shipping-address');
    const cityInput = document.getElementById('edit-city');
    const stateInput = document.getElementById('edit-state');

    const orderId = idInput.value;
    const order = this.myOrders.find(o => String(o.id) === String(orderId));
    if (!order) return;

    const newQty = Math.max(1, parseInt(qtyInput.value) || 1);
    const unitPrice = Number(order.unit_price) || (Number(order.grand_total) / (Number(order.quantity) || 1));
    const newTotal = Math.round(newQty * unitPrice * 100) / 100;

    order.quantity = newQty;
    order.subtotal = newTotal;
    order.grand_total = newTotal;
    order.customer_name = nameInput.value.trim();
    order.customer_phone = phoneInput.value.trim();
    order.shipping_address = addressInput.value.trim();
    order.city = cityInput.value.trim();
    order.state = stateInput.value.trim().toUpperCase();

    this.saveCustomerLocalOrders();
    this.updateHeaderCart();
    this.toggleModal(this.editOrderModal, false);
    this.renderCustomerOrdersQueue();

    if (!order.is_cart_item) {
      // Sync to backend API
      fetch(`/api/orders/${order.id}/customer-update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: newQty,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          shipping_address: order.shipping_address,
          city: order.city,
          state: order.state
        })
      }).catch(err => console.warn('Backend update error:', err));
    }

    this.showToast(`Order #${order.order_number} details updated successfully!`, 'success');
  }

  cancelCustomerOrder(orderId) {
    const order = this.myOrders.find(o => String(o.id) === String(orderId));
    if (!order || order.order_status === 'cancelled') return;

    if (!confirm(`Are you sure you want to cancel order #${order.order_number}?\nThis will restock the inventory.`)) {
      return;
    }

    order.order_status = 'cancelled';
    this.saveCustomerLocalOrders();
    this.updateHeaderCart();
    this.renderCustomerOrdersQueue();

    if (!order.is_cart_item) {
      // Sync cancellation to backend
      fetch(`/api/orders/${order.id}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled by customer from Cart Queue' })
      }).catch(err => console.warn('Backend cancel error:', err));
    }

    this.showToast(`Order #${order.order_number} has been cancelled.`, 'warning');
  }

  removeCustomerOrder(orderId) {
    const idx = this.myOrders.findIndex(o => String(o.id) === String(orderId));
    if (idx !== -1) {
      const itemTitle = this.myOrders[idx].product_title || 'Item';
      this.myOrders.splice(idx, 1);
      this.saveCustomerLocalOrders();
      this.updateHeaderCart();
      this.renderCustomerOrdersQueue();
      this.showToast(`${itemTitle} removed from your cart.`, 'info');
    }
  }

  openTrackingModal(orderNumberOrRef) {
    if (!this.trackingModal) return;

    let targetOrder = null;
    const allKnown = [...(this.myOrders || []), ...(this.adminOrders || [])];
    if (orderNumberOrRef) {
      targetOrder = allKnown.find(o => o.order_number && o.order_number.toUpperCase() === orderNumberOrRef.toUpperCase());
    }
    if (!targetOrder && allKnown.length > 0) {
      targetOrder = allKnown[0];
    }

    if (this.trackInput && targetOrder) {
      this.trackInput.value = targetOrder.order_number;
    }

    this.renderTrackingDetails(targetOrder);
    this.toggleModal(this.trackingModal, true);
  }

  async handleTrackSearch() {
    if (!this.trackInput) return;
    const query = this.trackInput.value.trim().toUpperCase();
    if (!query) {
      this.showToast('Please enter an Order Reference # or Tracking #', 'warning');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.ok && data.order) {
        this.renderTrackingDetails(data.order);
        this.showToast(`Found tracking for ${data.order.order_number}`, 'success');
        return;
      }
    } catch (e) {}

    const allKnown = [...(this.myOrders || []), ...(this.adminOrders || [])];
    const order = allKnown.find(o =>
      (o.order_number && o.order_number.toUpperCase() === query) ||
      (o.tracking_number && o.tracking_number.toUpperCase() === query)
    );

    if (order) {
      this.renderTrackingDetails(order);
      this.showToast(`Found tracking for ${order.order_number}`, 'success');
    } else {
      this.showToast(`No order records found in database for '${query}'.`, 'warning');
    }
  }

  renderTrackingDetails(order) {
    if (!this.trackingDetailsBox) return;

    if (!order) {
      this.trackingDetailsBox.innerHTML = `
        <div style="text-align:center; padding: 30px; color:#64748b;">
          <div>📦</div>
          <p>No active order found. Enter your order reference above.</p>
        </div>
      `;
      if (this.trackViewLabelBtn) this.trackViewLabelBtn.style.display = 'none';
      return;
    }

    this.activeTrackedOrder = order;
    if (this.trackViewLabelBtn) this.trackViewLabelBtn.style.display = 'inline-block';

    const status = order.order_status || 'processing';
    const isStep1Done = true;
    const isStep2Done = status === 'processing' || status === 'dispatched' || status === 'delivered';
    const isStep3Done = status === 'dispatched' || status === 'delivered';
    const isStep4Done = status === 'delivered';

    const dateStr = new Date(order.created_at).toLocaleString();
    const city = order.city || 'Los Angeles';
    const state = order.state || 'CA';

    this.trackingDetailsBox.innerHTML = `
      <div class="tracking-header-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">Carrier Tracking Number</div>
            <div style="font-family:var(--font-mono); font-weight:800; font-size:1.05rem; color:var(--swift-cyan); letter-spacing:1px;">9405 5112 0255 5019 2834 11</div>
          </div>
          <span class="order-status-badge status-${status}">${status}</span>
        </div>
        <div style="margin-top:12px; font-size:0.8rem; color:#cbd5e1; display:flex; justify-content:space-between;">
          <span>Ref: <strong>${order.order_number}</strong></span>
          <span>Destination: <strong>${city}, ${state} (USA)</strong></span>
        </div>
      </div>

      <div class="tracking-timeline">
        <div class="track-step ${isStep1Done ? 'completed' : 'active'}">
          <div class="track-dot">✓</div>
          <div class="track-step-title">Order Confirmed & Payment Verified</div>
          <div class="track-step-desc">SwiftOrbits automated order processing system received transaction.</div>
          <div class="track-step-time">${dateStr}</div>
        </div>

        <div class="track-step ${isStep2Done ? (status === 'processing' ? 'active' : 'completed') : ''}">
          <div class="track-dot">${isStep2Done && status !== 'processing' ? '✓' : '2'}</div>
          <div class="track-step-title">Warehouse Fulfillment & Security Scan</div>
          <div class="track-step-desc">Ontario Hub, CA - Verified serial tags, packaged in protective bubble insulation.</div>
          <div class="track-step-time">Ontario Regional Fulfillment Center, CA</div>
        </div>

        <div class="track-step ${isStep3Done ? (status === 'dispatched' ? 'active' : 'completed') : ''}">
          <div class="track-dot">${isStep3Done && status !== 'dispatched' ? '✓' : '3'}</div>
          <div class="track-step-title">In Transit with USPS Priority Express</div>
          <div class="track-step-desc">Departed SwiftOrbits logistics terminal. En route to sorting facility.</div>
          <div class="track-step-time">USPS Priority Express Network • Flight SO-902</div>
        </div>

        <div class="track-step ${isStep4Done ? 'completed' : ''}">
          <div class="track-dot">${isStep4Done ? '✓' : '4'}</div>
          <div class="track-step-title">Delivered & Signed</div>
          <div class="track-step-desc">Delivered to recipient address: ${city}, ${state}. Verified front door dropoff.</div>
          <div class="track-step-time">${status === 'delivered' ? 'Completed' : 'Estimated: In 2 Business Days'}</div>
        </div>
      </div>
    `;
  }

  openInfoModal(infoKey) {
    if (!this.infoModal) return;

    const INFO_DATA = {
      'prime-shipping': {
        pill: '⚡ FAST SHIPPING',
        title: 'Fast Nationwide Delivery',
        sub: 'Reliable doorstep shipping across the United States',
        content: `
          <div style="background:#f0f9ff; padding:14px; border-radius:8px; border-left:4px solid var(--swift-blue); margin-bottom:14px;">
            <strong style="color:var(--swift-blue);">Fast & Trackable Fulfillment</strong>
            <p style="margin-top:4px; font-size:0.86rem; color:#334155;">All domestic orders are processed within 24 hours and delivered promptly via trusted carrier partners.</p>
          </div>
          <ul style="padding-left: 20px; line-height: 1.8; font-size:0.88rem; color:#475569;">
            <li><strong>2-3 Business Days Delivery:</strong> Quick nationwide delivery across the country.</li>
            <li><strong>Real-Time Tracking:</strong> Automated tracking updates provided with every order.</li>
            <li><strong>Protective Packaging:</strong> Secure boxing to ensure items arrive in pristine condition.</li>
          </ul>
        `
      },
      'authorized-warranty': {
        pill: '🛡️ 100% AUTHENTIC',
        title: 'Genuine Products & Brand Warranty',
        sub: 'Original merchandise backed by manufacturer protection',
        content: `
          <div style="background:#f0fdf4; padding:14px; border-radius:8px; border-left:4px solid #10b981; margin-bottom:14px;">
            <strong style="color:#047857;">Authenticity Guaranteed</strong>
            <p style="margin-top:4px; font-size:0.86rem; color:#334155;">Every item sold on SwiftOrbits is 100% genuine, brand new, and sourced through official distribution channels.</p>
          </div>
          <ul style="padding-left: 20px; line-height: 1.8; font-size:0.88rem; color:#475569;">
            <li><strong>Manufacturer Warranty:</strong> Eligible for standard brand warranty services.</li>
            <li><strong>Brand Verification:</strong> Only verified, top-tier consumer brands.</li>
            <li><strong>Commercial Invoice:</strong> Official proof of purchase included with every shipment.</li>
          </ul>
        `
      },
      'warranty': {
        pill: '🛡️ 100% AUTHENTIC',
        title: 'Official Brand Warranty',
        sub: 'Direct manufacturer protection on all items',
        content: `
          <p style="line-height:1.7; color:#334155; margin-bottom:12px;">All products sold by SwiftOrbits carry original manufacturer warranties. For warranty inquiries or claim support, our customer care team is ready to assist you.</p>
          <div style="padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; font-size:0.85rem;">
            <strong>Phone Number:</strong> <span style="color:var(--swift-blue); font-weight:700;">+971 55 576 2122</span>
          </div>
        `
      },
      'flexible-payments': {
        pill: '🔒 SECURE CHECKOUT',
        title: 'Safe & Encrypted Payment Solutions',
        sub: '256-Bit SSL protection for complete buyer peace of mind',
        content: `
          <div style="background:#fefce8; padding:14px; border-radius:8px; border-left:4px solid #eab308; margin-bottom:14px;">
            <strong style="color:#a16207;">Encrypted Transactions</strong>
            <p style="margin-top:4px; font-size:0.86rem; color:#334155;">Your financial information is never stored and is protected by industry-standard 256-bit SSL encryption.</p>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="border:1px solid #e2e8f0; padding:10px; border-radius:6px;"><strong>💳 Credit / Debit Cards</strong><div style="font-size:0.78rem; color:#64748b;">Visa, Mastercard, Amex</div></div>
            <div style="border:1px solid #e2e8f0; padding:10px; border-radius:6px;"><strong>📱 Apple Pay & Digital</strong><div style="font-size:0.78rem; color:#64748b;">One-touch fast checkout</div></div>
            <div style="border:1px solid #e2e8f0; padding:10px; border-radius:6px;"><strong>💵 Cash on Delivery</strong><div style="font-size:0.78rem; color:#64748b;">Pay upon delivery</div></div>
            <div style="border:1px solid #e2e8f0; padding:10px; border-radius:6px;"><strong>🛡️ Zero Fraud Liability</strong><div style="font-size:0.78rem; color:#64748b;">Full purchase protection</div></div>
          </div>
        `
      },
      'guarantee': {
        pill: '🛡️ BUYER GUARANTEE',
        title: 'SwiftOrbits Buyer Protection',
        sub: 'Shop with complete confidence',
        content: `
          <div style="background:#f0fdf4; padding:14px; border-radius:8px; border-left:4px solid #10b981; margin-bottom:14px;">
            <strong style="color:#047857;">100% Protected Orders</strong>
            <p style="margin-top:4px; font-size:0.86rem; color:#334155;">Every order placed with SwiftOrbits is backed by our full buyer guarantee covering safe delivery and authentic goods.</p>
          </div>
          <ul style="padding-left: 20px; line-height: 1.8; font-size:0.88rem; color:#475569;">
            <li>Full refund if item not received</li>
            <li>Easy returns within 30 days</li>
            <li>Dedicated customer service assistance</li>
          </ul>
        `
      },
      'free-returns': {
        pill: '🔄 EASY RETURNS',
        title: '30-Day Easy Returns Policy',
        sub: 'Hassle-free return and exchange process',
        content: `
          <div style="background:#f5f3ff; padding:14px; border-radius:8px; border-left:4px solid var(--swift-purple); margin-bottom:14px;">
            <strong style="color:var(--swift-purple);">Customer-First Returns</strong>
            <p style="margin-top:4px; font-size:0.86rem; color:#334155;">Not satisfied with your order? Return eligible items within 30 days of delivery for a full refund or replacement.</p>
          </div>
          <ul style="padding-left: 20px; line-height: 1.8; font-size:0.88rem; color:#475569;">
            <li><strong>30-Day Window:</strong> Items in original condition can be returned within 30 days.</li>
            <li><strong>Prompt Refunds:</strong> Funds returned to your original payment method upon return inspection.</li>
            <li><strong>Assistance:</strong> Our team will guide you through packaging and return shipping.</li>
          </ul>
        `
      },
      'returns': {
        pill: '🔄 EASY RETURNS',
        title: 'Returns & Refunds',
        sub: 'Customer-friendly returns support',
        content: `
          <p style="line-height:1.7; color:#334155; margin-bottom:12px;">We want you to love what you buy. If you need to return an item, please contact our support desk with your order number.</p>
          <div style="padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; font-size:0.85rem;">
            <strong>Phone Number:</strong> <span style="color:var(--swift-blue); font-weight:700;">+971 55 576 2122</span>
          </div>
        `
      },
      'contact': {
        pill: '📞 CONTACT US',
        title: 'Contact SwiftOrbits',
        sub: 'Customer Support & Corporate Office',
        content: `
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="padding:12px; border:1px solid #e2e8f0; border-radius:8px; background:#f8fafc;">
              <strong>Address:</strong>
              <div style="margin-top:4px; color:#334155;">
                2445 South Hiawassee Road, Orlando, FL 32835, USA
              </div>
            </div>
            <div style="padding:12px; border:1px solid #e2e8f0; border-radius:8px;">
              <strong>Phone Number:</strong> <span style="font-family:var(--font-mono); color:#007185; font-weight:700; margin-left:6px;">+971 55 576 2122</span>
            </div>
            <div style="padding:12px; border:1px solid #e2e8f0; border-radius:8px;">
              <strong>Email:</strong> <span style="font-family:var(--font-mono); color:#007185; font-weight:700; margin-left:6px;">info@swiftorbits.com</span>
            </div>
          </div>
        `
      },
      'support': {
        pill: '📞 CONTACT US',
        title: 'Contact SwiftOrbits',
        sub: 'Customer Support & Corporate Office',
        content: `
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="padding:12px; border:1px solid #e2e8f0; border-radius:8px; background:#f8fafc;">
              <strong>Address:</strong>
              <div style="margin-top:4px; color:#334155;">
                2445 South Hiawassee Road, Orlando, FL 32835, USA
              </div>
            </div>
            <div style="padding:12px; border:1px solid #e2e8f0; border-radius:8px;">
              <strong>Phone Number:</strong> <span style="font-family:var(--font-mono); color:#007185; font-weight:700; margin-left:6px;">+971 55 576 2122</span>
            </div>
            <div style="padding:12px; border:1px solid #e2e8f0; border-radius:8px;">
              <strong>Email:</strong> <span style="font-family:var(--font-mono); color:#007185; font-weight:700; margin-left:6px;">info@swiftorbits.com</span>
            </div>
          </div>
        `
      },
      'carrier': {
        pill: '🚚 SHIPPING & CARRIERS',
        title: 'Domestic Shipping Policy',
        sub: 'Reliable parcel transit & delivery',
        content: `
          <p style="line-height:1.7; color:#334155; margin-bottom:12px;">We partner with major couriers including USPS Priority and FedEx Express to ensure prompt and secure delivery of every order.</p>
          <ul style="padding-left: 20px; line-height: 1.8; font-size:0.88rem; color:#475569;">
            <li>Standard delivery time: 2-3 business days</li>
            <li>Tracking number generated upon dispatch</li>
            <li>Direct residential and commercial delivery</li>
          </ul>
        `
      },
      'faq': {
        pill: '❓ HELP & FAQ',
        title: 'Frequently Asked Questions',
        sub: 'Quick answers to common questions',
        content: `
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div>
              <strong style="color:#0f172a;">How long does delivery take?</strong>
              <p style="font-size:0.85rem; color:#64748b; margin-top:2px;">Orders are dispatched within 24 hours and typically arrive within 2-3 business days.</p>
            </div>
            <div>
              <strong style="color:#0f172a;">How can I track my package?</strong>
              <p style="font-size:0.85rem; color:#64748b; margin-top:2px;">You will receive an automated tracking link as soon as your package ships.</p>
            </div>
            <div>
              <strong style="color:#0f172a;">What is your return policy?</strong>
              <p style="font-size:0.85rem; color:#64748b; margin-top:2px;">We accept returns in original condition within 30 days of delivery for a full refund.</p>
            </div>
          </div>
        `
      },
      'about': {
        pill: '🪐 ABOUT US',
        title: 'About SwiftOrbits',
        sub: 'Trusted Quality & Value',
        content: `
          <p style="line-height:1.7; color:#334155; margin-bottom:14px;">SwiftOrbits is an established e-commerce marketplace dedicated to providing customers with top-brand products in electronics, home essentials, beauty, and daily living at competitive prices.</p>
          <p style="line-height:1.7; color:#334155;">We take pride in exceptional customer service, 100% verified authentic goods, and reliable nationwide fulfillment.</p>
        `
      },
      'terms': {
        pill: '⚖️ TERMS OF SERVICE',
        title: 'Terms of Service',
        sub: 'Customer agreement & trade standards',
        content: `
          <p style="line-height:1.7; font-size:0.86rem; color:#475569;">By using SwiftOrbits, you agree to our standard customer purchasing guidelines, fair return policies, and secure transaction terms. All pricing is displayed and settled in USD ($).</p>
        `
      },
      'privacy': {
        pill: '🔒 PRIVACY POLICY',
        title: 'Privacy Policy',
        sub: 'Protecting your personal data',
        content: `
          <p style="line-height:1.7; font-size:0.86rem; color:#475569;">SwiftOrbits respects your privacy. We collect customer shipping and contact details exclusively for processing and fulfilling orders. We never sell, rent, or share personal data with external third parties.</p>
        `
      }
    };

    if (infoKey && infoKey.startsWith('pay-')) {
      const data = INFO_DATA['flexible-payments'];
      this.infoModalPill.textContent = data.pill;
      this.infoModalTitle.textContent = data.title;
      this.infoModalSub.textContent = data.sub;
      this.infoModalContent.innerHTML = data.content;
      this.toggleModal(this.infoModal, true);
      return;
    }

    const data = INFO_DATA[infoKey] || INFO_DATA['prime-shipping'];
    this.infoModalPill.textContent = data.pill;
    this.infoModalTitle.textContent = data.title;
    this.infoModalSub.textContent = data.sub;
    this.infoModalContent.innerHTML = data.content;

    this.toggleModal(this.infoModal, true);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.swiftApp = new SwiftOrbitsEngineApp();
});
