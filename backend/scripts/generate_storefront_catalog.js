import fs from 'fs';
import path from 'path';

// Define the 150 products strictly priced between $10 and $30 with 5-10 products per brand
export const products = [
  // ================= 1. ELECTRONICS (25 Products, All $10 - $30) =================
  // Anker (8 products)
  {
    id: 1, sku: 'SO-ELEC-01', title: 'Anker 313 Fast Charger 45W USB-C Wall Adapter',
    category: 'electronics', regular_price: 24.99, sale_price: 19.99, stock_qty: 60,
    is_flash_sale: true, sold_percent: 75, rating: 4.8, reviews_count: 850,
    attributes: { Brand: 'Anker', Output: '45W USB-C', Tech: 'GaN II' }, image: '/usb_cable.png'
  },
  {
    id: 2, sku: 'SO-ELEC-02', title: 'Anker Powerline III Flow Silicone USB-C Cable 6ft',
    category: 'electronics', regular_price: 18.99, sale_price: 14.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 1200,
    attributes: { Brand: 'Anker', Length: '6 Feet', Material: 'Silicone' }, image: '/usb_cable.png'
  },
  {
    id: 3, sku: 'SO-ELEC-03', title: 'Anker 332 USB-C Hub 5-in-1 with 4K HDMI & 100W PD',
    category: 'electronics', regular_price: 29.99, sale_price: 24.99, stock_qty: 45,
    is_flash_sale: true, sold_percent: 80, rating: 4.7, reviews_count: 640,
    attributes: { Brand: 'Anker', Ports: '5-in-1', Video: '4K HDMI' }, image: '/usb_cable.png'
  },
  {
    id: 4, sku: 'SO-ELEC-04', title: 'Anker Soundcore 2 Portable Bluetooth Speaker 12W',
    category: 'electronics', regular_price: 29.99, sale_price: 27.99, stock_qty: 50,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 2100,
    attributes: { Brand: 'Anker', Audio: '12W Stereo', Playtime: '24 Hours' }, image: '/elec_earbuds.png'
  },
  {
    id: 5, sku: 'SO-ELEC-05', title: 'Anker Magnetic Wireless Charging Pad with 5ft Cable',
    category: 'electronics', regular_price: 21.99, sale_price: 16.99, stock_qty: 70,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 530,
    attributes: { Brand: 'Anker', Charging: 'Magnetic Qi', Cable: '5ft USB-C' }, image: '/usb_cable.png'
  },
  {
    id: 6, sku: 'SO-ELEC-06', title: 'Anker 2-in-1 USB 3.0 SD & MicroSD Card Reader',
    category: 'electronics', regular_price: 15.99, sale_price: 11.99, stock_qty: 85,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 780,
    attributes: { Brand: 'Anker', Speed: 'USB 3.0 5Gbps', Slots: 'SD & TF' }, image: '/usb_cable.png'
  },
  {
    id: 7, sku: 'SO-ELEC-07', title: 'Anker 323 Car Charger 52.5W Dual Port Fast Charger',
    category: 'electronics', regular_price: 22.99, sale_price: 17.99, stock_qty: 65,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 490,
    attributes: { Brand: 'Anker', Power: '52.5W Output', Ports: 'USB-C & USB-A' }, image: '/usb_cable.png'
  },
  {
    id: 8, sku: 'SO-ELEC-08', title: 'Anker Soundcore Life P2 Mini True Wireless Earbuds',
    category: 'electronics', regular_price: 29.99, sale_price: 23.99, stock_qty: 75,
    is_flash_sale: true, sold_percent: 68, rating: 4.6, reviews_count: 1450,
    attributes: { Brand: 'Anker', Battery: '32H Total', Sound: 'Custom EQ' }, image: '/elec_earbuds.png'
  },
  // Logitech (7 products)
  {
    id: 9, sku: 'SO-ELEC-09', title: 'Logitech M185 Compact Wireless Mouse 2.4GHz USB',
    category: 'electronics', regular_price: 19.99, sale_price: 14.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 3200,
    attributes: { Brand: 'Logitech', Connection: '2.4GHz Wireless', Battery: '12 Months' }, image: '/elec_phone.png'
  },
  {
    id: 10, sku: 'SO-ELEC-10', title: 'Logitech K120 Ergonomic USB Wired Desktop Keyboard',
    category: 'electronics', regular_price: 18.99, sale_price: 14.49, stock_qty: 95,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1890,
    attributes: { Brand: 'Logitech', Layout: 'Full Size', Spill: 'Spill Resistant' }, image: '/elec_phone.png'
  },
  {
    id: 11, sku: 'SO-ELEC-11', title: 'Logitech C270 HD 720p Webcam with Noise Mic',
    category: 'electronics', regular_price: 29.99, sale_price: 24.99, stock_qty: 40,
    is_flash_sale: true, sold_percent: 85, rating: 4.6, reviews_count: 1120,
    attributes: { Brand: 'Logitech', Resolution: '720p HD', Mic: 'Noise-Reducing' }, image: '/elec_phone.png'
  },
  {
    id: 12, sku: 'SO-ELEC-12', title: 'Logitech M325c Wireless Mouse Micro-Precise Scroll',
    category: 'electronics', regular_price: 24.99, sale_price: 19.99, stock_qty: 60,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 940,
    attributes: { Brand: 'Logitech', Scroll: 'Micro-Precise', Battery: '18 Months' }, image: '/elec_phone.png'
  },
  {
    id: 13, sku: 'SO-ELEC-13', title: 'Logitech H390 USB Headset Noise-Canceling Mic',
    category: 'electronics', regular_price: 29.99, sale_price: 26.99, stock_qty: 48,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1350,
    attributes: { Brand: 'Logitech', Connect: 'USB Plug & Play', Controls: 'In-line Audio' }, image: '/elec_earbuds.png'
  },
  {
    id: 14, sku: 'SO-ELEC-14', title: 'Logitech Studio Series Desk Mat Large Extended',
    category: 'electronics', regular_price: 24.99, sale_price: 19.99, stock_qty: 70,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 670,
    attributes: { Brand: 'Logitech', Size: '300x700mm', Fabric: 'Spill-Resistant' }, image: '/elec_phone.png'
  },
  {
    id: 15, sku: 'SO-ELEC-15', title: 'Logitech B100 Optical USB Mouse Ambidextrous',
    category: 'electronics', regular_price: 13.99, sale_price: 10.99, stock_qty: 120,
    is_flash_sale: false, sold_percent: 0, rating: 4.5, reviews_count: 2400,
    attributes: { Brand: 'Logitech', DPI: '800 DPI Optical', Cable: '5.9ft USB' }, image: '/elec_phone.png'
  },
  // JBL (5 products)
  {
    id: 16, sku: 'SO-ELEC-16', title: 'JBL GO 3 Ultra-Portable Waterproof Bluetooth Speaker',
    category: 'electronics', regular_price: 29.95, sale_price: 28.95, stock_qty: 55,
    is_flash_sale: true, sold_percent: 70, rating: 4.8, reviews_count: 3100,
    attributes: { Brand: 'JBL', Waterproof: 'IP67 Rated', Playtime: '5 Hours' }, image: '/elec_earbuds.png'
  },
  {
    id: 17, sku: 'SO-ELEC-17', title: 'JBL Quantum 50 In-Ear Gaming Earphones with Mic',
    category: 'electronics', regular_price: 29.95, sale_price: 24.95, stock_qty: 50,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 820,
    attributes: { Brand: 'JBL', Driver: '8.6mm Drivers', Mic: 'Inline Volume Slider' }, image: '/elec_earbuds.png'
  },
  {
    id: 18, sku: 'SO-ELEC-18', title: 'JBL Tune 110 Pure Bass Wired Earphones 3.5mm',
    category: 'electronics', regular_price: 14.95, sale_price: 11.95, stock_qty: 130,
    is_flash_sale: false, sold_percent: 0, rating: 4.5, reviews_count: 4500,
    attributes: { Brand: 'JBL', Audio: 'JBL Pure Bass', Cable: 'Tangle-Free Flat' }, image: '/elec_earbuds.png'
  },
  {
    id: 19, sku: 'SO-ELEC-19', title: 'JBL Tune 205 Earbuds with 1-Button Remote',
    category: 'electronics', regular_price: 19.95, sale_price: 16.95, stock_qty: 80,
    is_flash_sale: false, sold_percent: 0, rating: 4.5, reviews_count: 1250,
    attributes: { Brand: 'JBL', Housing: 'Premium Metal Finish', Mic: 'Hands-Free' }, image: '/elec_earbuds.png'
  },
  {
    id: 20, sku: 'SO-ELEC-20', title: 'JBL Endurance Run Sweatproof Sport In-Ear Headphones',
    category: 'electronics', regular_price: 24.95, sale_price: 19.95, stock_qty: 65,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 990,
    attributes: { Brand: 'JBL', Fit: 'FlipHook 2-Way', Waterproof: 'IPX5 Sweatproof' }, image: '/elec_earbuds.png'
  },
  // Sony (5 products)
  {
    id: 21, sku: 'SO-ELEC-21', title: 'Sony MDR-ZX110 Lightweight On-Ear Stereo Headphones',
    category: 'electronics', regular_price: 24.99, sale_price: 19.99, stock_qty: 85,
    is_flash_sale: true, sold_percent: 82, rating: 4.6, reviews_count: 5100,
    attributes: { Brand: 'Sony', Driver: '30mm Dynamic', Design: 'Swivel Folding' }, image: '/elec_earbuds.png'
  },
  {
    id: 22, sku: 'SO-ELEC-22', title: 'Sony MDR-EX14AP In-Ear Earbuds with Inline Mic',
    category: 'electronics', regular_price: 17.99, sale_price: 14.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.5, reviews_count: 2200,
    attributes: { Brand: 'Sony', Sound: 'Neodymium Drivers', Earbuds: 'Silicone Tips' }, image: '/elec_earbuds.png'
  },
  {
    id: 23, sku: 'SO-ELEC-23', title: 'Sony 64GB High-Speed USB 3.2 Flash Drive Type-A',
    category: 'electronics', regular_price: 18.99, sale_price: 13.99, stock_qty: 100,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 1400,
    attributes: { Brand: 'Sony', Capacity: '64GB', Interface: 'USB 3.2 Gen 1' }, image: '/usb_cable.png'
  },
  {
    id: 24, sku: 'SO-ELEC-24', title: 'Sony MDR-ZX110AP Folding Headphones with Mic',
    category: 'electronics', regular_price: 29.99, sale_price: 24.99, stock_qty: 60,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 3100,
    attributes: { Brand: 'Sony', Remote: '1-Button Inline Mic', Cup: 'Cushioned Earpads' }, image: '/elec_earbuds.png'
  },
  {
    id: 25, sku: 'SO-ELEC-25', title: 'Sony 32GB Class 10 UHS-I SDHC Memory Card',
    category: 'electronics', regular_price: 14.99, sale_price: 11.99, stock_qty: 115,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 980,
    attributes: { Brand: 'Sony', Speed: 'Up to 100MB/s', Protection: 'Water & Temp Proof' }, image: '/usb_cable.png'
  },

  // ================= 2. BEAUTY & PERSONAL CARE (25 Products, All $10 - $30) =================
  // CeraVe (9 products)
  {
    id: 26, sku: 'SO-BEAU-01', title: 'CeraVe Hydrating Facial Cleanser 16oz Hyaluronic Acid',
    category: 'beauty', regular_price: 19.99, sale_price: 15.99, stock_qty: 120,
    is_flash_sale: true, sold_percent: 88, rating: 4.8, reviews_count: 4200,
    attributes: { Brand: 'CeraVe', Skin: 'Normal to Dry', Size: '16 fl oz (473ml)' }, image: '/niacinamide_serum.png'
  },
  {
    id: 27, sku: 'SO-BEAU-02', title: 'CeraVe Moisturizing Cream 19oz Tub with Daily Pump',
    category: 'beauty', regular_price: 23.99, sale_price: 18.99, stock_qty: 95,
    is_flash_sale: true, sold_percent: 79, rating: 4.9, reviews_count: 5800,
    attributes: { Brand: 'CeraVe', Ceramides: '3 Essential Ceramides', Size: '19 oz (539g)' }, image: '/niacinamide_serum.png'
  },
  {
    id: 28, sku: 'SO-BEAU-03', title: 'CeraVe Daily Moisturizing Lotion 12oz Lightweight',
    category: 'beauty', regular_price: 17.99, sale_price: 13.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3600,
    attributes: { Brand: 'CeraVe', Feature: 'MVE Technology 24H Hydration', Size: '12 fl oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 29, sku: 'SO-BEAU-04', title: 'CeraVe Eye Repair Cream 0.5oz for Dark Circles',
    category: 'beauty', regular_price: 18.99, sale_price: 14.99, stock_qty: 80,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2100,
    attributes: { Brand: 'CeraVe', Target: 'Puffiness & Dark Circles', Tested: 'Ophthalmologist' }, image: '/niacinamide_serum.png'
  },
  {
    id: 30, sku: 'SO-BEAU-05', title: 'CeraVe Foaming Facial Cleanser 16oz for Normal-Oily Skin',
    category: 'beauty', regular_price: 19.99, sale_price: 15.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3100,
    attributes: { Brand: 'CeraVe', Benefit: 'Niacinamide Calming Formula', Size: '16 fl oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 31, sku: 'SO-BEAU-06', title: 'CeraVe Healing Ointment 5oz Tube for Dry Cracked Skin',
    category: 'beauty', regular_price: 16.99, sale_price: 12.49, stock_qty: 85,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 1850,
    attributes: { Brand: 'CeraVe', Texture: 'Non-Greasy Petrolatum', Size: '5 oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 32, sku: 'SO-BEAU-07', title: 'CeraVe AM Facial Moisturizing Lotion with SPF 30',
    category: 'beauty', regular_price: 21.99, sale_price: 16.99, stock_qty: 75,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2700,
    attributes: { Brand: 'CeraVe', Sunscreen: 'Broad Spectrum SPF 30', Size: '3 oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 33, sku: 'SO-BEAU-08', title: 'CeraVe PM Facial Moisturizing Lotion 3oz Night Cream',
    category: 'beauty', regular_price: 19.99, sale_price: 15.49, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3400,
    attributes: { Brand: 'CeraVe', Night: 'Ultra-Lightweight Night', Size: '3 oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 34, sku: 'SO-BEAU-09', title: 'CeraVe Resurfacing Retinol Serum 1oz Post-Acne Marks',
    category: 'beauty', regular_price: 24.99, sale_price: 19.99, stock_qty: 65,
    is_flash_sale: true, sold_percent: 72, rating: 4.7, reviews_count: 1920,
    attributes: { Brand: 'CeraVe', Formula: 'Encapsulated Retinol', Size: '1 fl oz' }, image: '/niacinamide_serum.png'
  },
  // Neutrogena (8 products)
  {
    id: 35, sku: 'SO-BEAU-10', title: 'Neutrogena Hydro Boost Water Gel Face Moisturizer 1.7oz',
    category: 'beauty', regular_price: 26.99, sale_price: 19.97, stock_qty: 105,
    is_flash_sale: true, sold_percent: 85, rating: 4.8, reviews_count: 6200,
    attributes: { Brand: 'Neutrogena', Hydration: 'Pure Hyaluronic Acid', Texture: 'Oil-Free Gel' }, image: '/niacinamide_serum.png'
  },
  {
    id: 36, sku: 'SO-BEAU-11', title: 'Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 70',
    category: 'beauty', regular_price: 15.49, sale_price: 11.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 4100,
    attributes: { Brand: 'Neutrogena', Protection: 'Helioplex Broad Spectrum', Water: '80 Min Resistant' }, image: '/niacinamide_serum.png'
  },
  {
    id: 37, sku: 'SO-BEAU-12', title: 'Neutrogena Fragrance-Free Makeup Remover Wipes 2-Pack',
    category: 'beauty', regular_price: 16.99, sale_price: 12.99, stock_qty: 130,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 5300,
    attributes: { Brand: 'Neutrogena', Cleanse: 'Dissolves 99.3% Makeup', Count: '50 Total Towelettes' }, image: '/niacinamide_serum.png'
  },
  {
    id: 38, sku: 'SO-BEAU-13', title: 'Neutrogena Oil-Free Acne Wash Salicylic Acid Cleanser',
    category: 'beauty', regular_price: 13.99, sale_price: 10.99, stock_qty: 95,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 2800,
    attributes: { Brand: 'Neutrogena', Active: '2% Salicylic Acid', Size: '9.1 fl oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 39, sku: 'SO-BEAU-14', title: 'Neutrogena Hydro Boost Hydrating Gel Cleanser 7.7oz',
    category: 'beauty', regular_price: 15.99, sale_price: 12.49, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2150,
    attributes: { Brand: 'Neutrogena', Benefit: 'Boosts Skin Hydration', Size: '7.7 oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 40, sku: 'SO-BEAU-15', title: 'Neutrogena Rapid Wrinkle Repair Retinol Face Cream',
    category: 'beauty', regular_price: 29.99, sale_price: 24.99, stock_qty: 55,
    is_flash_sale: true, sold_percent: 65, rating: 4.7, reviews_count: 2900,
    attributes: { Brand: 'Neutrogena', Action: 'Accelerated Retinol SA', Size: '1.7 oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 41, sku: 'SO-BEAU-16', title: 'Neutrogena Body Clear Pink Grapefruit Body Wash 8.5oz',
    category: 'beauty', regular_price: 14.99, sale_price: 11.49, stock_qty: 85,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1750,
    attributes: { Brand: 'Neutrogena', Scent: 'Naturally Derived Grapefruit', Target: 'Body Breakouts' }, image: '/niacinamide_serum.png'
  },
  {
    id: 42, sku: 'SO-BEAU-17', title: 'Neutrogena Norwegian Formula Concentrated Hand Cream 2-Pack',
    category: 'beauty', regular_price: 13.99, sale_price: 10.99, stock_qty: 115,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 2600,
    attributes: { Brand: 'Neutrogena', Glycerin: 'Rich Glycerin Formula', Size: '2x 2 oz' }, image: '/niacinamide_serum.png'
  },
  // La Roche-Posay (8 products)
  {
    id: 43, sku: 'SO-BEAU-18', title: 'La Roche-Posay Toleriane Purifying Foaming Cleanser 13.5oz',
    category: 'beauty', regular_price: 22.99, sale_price: 17.99, stock_qty: 85,
    is_flash_sale: true, sold_percent: 74, rating: 4.8, reviews_count: 3800,
    attributes: { Brand: 'La Roche-Posay', Skin: 'Normal to Oily Sensitive', Size: '13.5 fl oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 44, sku: 'SO-BEAU-19', title: 'La Roche-Posay Cicaplast Baume B5 Soothing Multi-Purpose Balm',
    category: 'beauty', regular_price: 21.00, sale_price: 16.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.9, reviews_count: 4900,
    attributes: { Brand: 'La Roche-Posay', Ingredients: 'Panthenol B5 & Madecassoside', Size: '1.35 oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 45, sku: 'SO-BEAU-20', title: 'La Roche-Posay Effaclar Medicated Gel Cleanser Salicylic Acid',
    category: 'beauty', regular_price: 20.99, sale_price: 16.99, stock_qty: 70,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2100,
    attributes: { Brand: 'La Roche-Posay', Active: '2% Salicylic Acid + LHA', Size: '6.76 fl oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 46, sku: 'SO-BEAU-21', title: 'La Roche-Posay Thermal Spring Water Mineral Face Mist 10.1oz',
    category: 'beauty', regular_price: 23.00, sale_price: 18.99, stock_qty: 75,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 1400,
    attributes: { Brand: 'La Roche-Posay', Minerals: 'Antioxidant Selenium', Size: '10.1 oz (300g)' }, image: '/niacinamide_serum.png'
  },
  {
    id: 47, sku: 'SO-BEAU-22', title: 'La Roche-Posay Lipikar AP+ Gentle Foaming Body Cleansing Oil',
    category: 'beauty', regular_price: 24.99, sale_price: 19.99, stock_qty: 60,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 1250,
    attributes: { Brand: 'La Roche-Posay', Formula: 'Lipid-Replenishing Shea Butter', Size: '13.5 fl oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 48, sku: 'SO-BEAU-23', title: 'La Roche-Posay Toleriane Double Repair Face Moisturizer 2.5oz',
    category: 'beauty', regular_price: 29.99, sale_price: 23.99, stock_qty: 80,
    is_flash_sale: true, sold_percent: 81, rating: 4.8, reviews_count: 4100,
    attributes: { Brand: 'La Roche-Posay', Barrier: 'Prebiotic Thermal Water', Size: '2.5 fl oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 49, sku: 'SO-BEAU-24', title: 'La Roche-Posay Anthelios Ultra-Light Fluid Sunscreen SPF 60',
    category: 'beauty', regular_price: 29.99, sale_price: 28.99, stock_qty: 55,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3200,
    attributes: { Brand: 'La Roche-Posay', Texture: 'Fast-Absorbing Matte', Size: '1.7 fl oz' }, image: '/niacinamide_serum.png'
  },
  {
    id: 50, sku: 'SO-BEAU-25', title: 'La Roche-Posay Lipikar Triple Repair Moisturizing Cream 13.5oz',
    category: 'beauty', regular_price: 26.99, sale_price: 21.99, stock_qty: 65,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 1950,
    attributes: { Brand: 'La Roche-Posay', Moisture: '48 Hour Body Hydration', Size: '13.52 oz' }, image: '/niacinamide_serum.png'
  },

  // ================= 3. KITCHEN & APPLIANCES (25 Products, All $10 - $30) =================
  // Dash (9 products)
  {
    id: 51, sku: 'SO-APPL-01', title: 'Dash Mini Waffle Maker Machine 4-Inch Non-Stick Plate',
    category: 'appliances', regular_price: 17.99, sale_price: 12.99, stock_qty: 140,
    is_flash_sale: true, sold_percent: 92, rating: 4.8, reviews_count: 7800,
    attributes: { Brand: 'Dash', Size: '4-inch Surface', Power: '350 Watts' }, image: '/air_fryer.png'
  },
  {
    id: 52, sku: 'SO-APPL-02', title: 'Dash Rapid Egg Cooker 6-Egg Capacity Hard Boiled & Poached',
    category: 'appliances', regular_price: 24.99, sale_price: 19.99, stock_qty: 100,
    is_flash_sale: true, sold_percent: 86, rating: 4.7, reviews_count: 6200,
    attributes: { Brand: 'Dash', Capacity: '6 Eggs', AutoOff: 'Auto-Shut Off Buzzer' }, image: '/air_fryer.png'
  },
  {
    id: 53, sku: 'SO-APPL-03', title: 'Dash Mini Griddle Electric Maker for Pancakes & Cookies',
    category: 'appliances', regular_price: 16.99, sale_price: 12.99, stock_qty: 95,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2400,
    attributes: { Brand: 'Dash', Plate: '4-inch Nonstick', Heating: 'Quick Preheat' }, image: '/air_fryer.png'
  },
  {
    id: 54, sku: 'SO-APPL-04', title: 'Dash Mini Rice Cooker Steamer 2-Cup Removable Pot',
    category: 'appliances', regular_price: 27.99, sale_price: 21.99, stock_qty: 70,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1850,
    attributes: { Brand: 'Dash', Capacity: '2 Cups Cooked', Features: 'Keep Warm Function' }, image: '/air_fryer.png'
  },
  {
    id: 55, sku: 'SO-APPL-05', title: 'Dash Compact Electric Citrus Juicer 32oz Pitcher',
    category: 'appliances', regular_price: 24.99, sale_price: 19.99, stock_qty: 80,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1420,
    attributes: { Brand: 'Dash', Volume: '32 oz Pitcher', Cones: 'Dual Reversing Cones' }, image: '/air_fryer.png'
  },
  {
    id: 56, sku: 'SO-APPL-06', title: 'Dash Fresh Pop Popcorn Maker Hot Air Popper Machine',
    category: 'appliances', regular_price: 29.99, sale_price: 24.99, stock_qty: 65,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1780,
    attributes: { Brand: 'Dash', Yield: 'Up to 16 Cups', Tech: 'Hot Air No Oil Needed' }, image: '/air_fryer.png'
  },
  {
    id: 57, sku: 'SO-APPL-07', title: 'Dash Handheld Electric Milk Frother Wand with Metal Stand',
    category: 'appliances', regular_price: 15.99, sale_price: 11.99, stock_qty: 120,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2900,
    attributes: { Brand: 'Dash', Whisk: 'Stainless Steel', Stand: 'Included Stand' }, image: '/air_fryer.png'
  },
  {
    id: 58, sku: 'SO-APPL-08', title: 'Dash Mini Toaster Oven Baking Pan and Broil Crisper Set',
    category: 'appliances', regular_price: 19.99, sale_price: 14.99, stock_qty: 75,
    is_flash_sale: false, sold_percent: 0, rating: 4.5, reviews_count: 980,
    attributes: { Brand: 'Dash', Material: 'Carbon Steel Nonstick', Fits: 'Compact Toaster Ovens' }, image: '/air_fryer.png'
  },
  {
    id: 59, sku: 'SO-APPL-09', title: 'Dash Everyday Ice Cream Maker Pint Sized Soft Serve',
    category: 'appliances', regular_price: 29.99, sale_price: 22.99, stock_qty: 55,
    is_flash_sale: true, sold_percent: 70, rating: 4.6, reviews_count: 1340,
    attributes: { Brand: 'Dash', Capacity: '1 Pint Bowl', Time: '20 Min Fresh Cream' }, image: '/air_fryer.png'
  },
  // Hamilton Beach (8 products)
  {
    id: 60, sku: 'SO-APPL-10', title: 'Hamilton Beach 6-Speed Hand Mixer with Snap-On Case',
    category: 'appliances', regular_price: 29.99, sale_price: 22.99, stock_qty: 85,
    is_flash_sale: true, sold_percent: 81, rating: 4.7, reviews_count: 3600,
    attributes: { Brand: 'Hamilton Beach', Speeds: '6 Speed + QuickBurst', Storage: 'Snap-On Case' }, image: '/air_fryer.png'
  },
  {
    id: 61, sku: 'SO-APPL-11', title: 'Hamilton Beach Personal Blender 14oz Portable Travel Cup',
    category: 'appliances', regular_price: 29.99, sale_price: 24.99, stock_qty: 80,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 4200,
    attributes: { Brand: 'Hamilton Beach', Jar: '14oz BPA-Free Jar', Power: '175 Watt Motor' }, image: '/air_fryer.png'
  },
  {
    id: 62, sku: 'SO-APPL-12', title: 'Hamilton Beach 3-Cup Electric Vegetable Food Chopper',
    category: 'appliances', regular_price: 27.99, sale_price: 21.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 2800,
    attributes: { Brand: 'Hamilton Beach', Bowl: '3-Cup Capacity', Blades: 'Stainless Steel' }, image: '/air_fryer.png'
  },
  {
    id: 63, sku: 'SO-APPL-13', title: 'Hamilton Beach Fresh Grind Electric Coffee Bean Grinder',
    category: 'appliances', regular_price: 24.99, sale_price: 19.99, stock_qty: 95,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 3100,
    attributes: { Brand: 'Hamilton Beach', Chamber: 'Removable Stainless', Yield: 'Up to 12 Cups' }, image: '/air_fryer.png'
  },
  {
    id: 64, sku: 'SO-APPL-14', title: 'Hamilton Beach 1-Liter Compact Electric Stainless Kettle',
    category: 'appliances', regular_price: 29.99, sale_price: 26.99, stock_qty: 70,
    is_flash_sale: true, sold_percent: 78, rating: 4.7, reviews_count: 2400,
    attributes: { Brand: 'Hamilton Beach', Capacity: '1.0 Liter', AutoShutoff: 'Boil-Dry Protection' }, image: '/air_fryer.png'
  },
  {
    id: 65, sku: 'SO-APPL-15', title: 'Hamilton Beach 2-Slice Extra-Wide Slot Toaster Defrost',
    category: 'appliances', regular_price: 29.99, sale_price: 23.99, stock_qty: 75,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1900,
    attributes: { Brand: 'Hamilton Beach', Slots: 'Extra Wide Slots', Shade: 'Toast Boost High-Lift' }, image: '/air_fryer.png'
  },
  {
    id: 66, sku: 'SO-APPL-16', title: 'Hamilton Beach Breakfast Sandwich Maker Quick Cooker',
    category: 'appliances', regular_price: 29.99, sale_price: 29.99, stock_qty: 60,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 5100,
    attributes: { Brand: 'Hamilton Beach', CookTime: '5 Minutes Ready', Cleaning: 'Dishwasher Safe' }, image: '/air_fryer.png'
  },
  {
    id: 67, sku: 'SO-APPL-17', title: 'Hamilton Beach Egg Bite Maker Microwave & Electric Cooker',
    category: 'appliances', regular_price: 24.99, sale_price: 18.99, stock_qty: 85,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1450,
    attributes: { Brand: 'Hamilton Beach', Cups: '2 Silicone Cups', Power: 'Nonstick Water Base' }, image: '/air_fryer.png'
  },
  // Black+Decker (8 products)
  {
    id: 68, sku: 'SO-APPL-18', title: 'Black+Decker 1.5-Cup One-Touch Electric Food Chopper',
    category: 'appliances', regular_price: 22.99, sale_price: 17.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 4800,
    attributes: { Brand: 'Black+Decker', Capacity: '1.5-Cup Bowl', Control: 'One-Touch Pulse' }, image: '/air_fryer.png'
  },
  {
    id: 69, sku: 'SO-APPL-19', title: 'Black+Decker Lightweight Steam Iron Nonstick Soleplate',
    category: 'appliances', regular_price: 25.99, sale_price: 19.99, stock_qty: 85,
    is_flash_sale: false, sold_percent: 0, rating: 4.5, reviews_count: 3200,
    attributes: { Brand: 'Black+Decker', Steam: 'SmartSteam Tech', Soleplate: 'TrueGlide Nonstick' }, image: '/air_fryer.png'
  },
  {
    id: 70, sku: 'SO-APPL-20', title: 'Black+Decker ComfortGrip Electric Carving Knife 9-Inch',
    category: 'appliances', regular_price: 27.99, sale_price: 21.99, stock_qty: 70,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1980,
    attributes: { Brand: 'Black+Decker', Blades: '9-inch Serrated Stainless', Safety: 'Lock Button' }, image: '/air_fryer.png'
  },
  {
    id: 71, sku: 'SO-APPL-21', title: 'Black+Decker 5-Speed Corded Hand Mixer with Beaters',
    category: 'appliances', regular_price: 24.99, sale_price: 19.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.5, reviews_count: 2150,
    attributes: { Brand: 'Black+Decker', Speeds: '5 Speed Settings', Attachments: '2 Wire Beaters' }, image: '/air_fryer.png'
  },
  {
    id: 72, sku: 'SO-APPL-22', title: 'Black+Decker 34oz Electric Citrus Juicer Dual Cones',
    category: 'appliances', regular_price: 23.99, sale_price: 18.99, stock_qty: 75,
    is_flash_sale: false, sold_percent: 0, rating: 4.5, reviews_count: 1640,
    attributes: { Brand: 'Black+Decker', Pitcher: '34 oz Capacity', Cones: 'Self-Reversing Cones' }, image: '/air_fryer.png'
  },
  {
    id: 73, sku: 'SO-APPL-23', title: 'Black+Decker 5-Cup Coffeemaker Duralife Glass Carafe',
    category: 'appliances', regular_price: 29.99, sale_price: 27.99, stock_qty: 65,
    is_flash_sale: true, sold_percent: 74, rating: 4.6, reviews_count: 3100,
    attributes: { Brand: 'Black+Decker', Cups: '5-Cup Capacity', Filter: 'Removable Filter Basket' }, image: '/air_fryer.png'
  },
  {
    id: 74, sku: 'SO-APPL-24', title: 'Black+Decker 2-Slice Compact Toaster Bagel Settings',
    category: 'appliances', regular_price: 28.99, sale_price: 21.99, stock_qty: 80,
    is_flash_sale: false, sold_percent: 0, rating: 4.5, reviews_count: 1800,
    attributes: { Brand: 'Black+Decker', Functions: 'Bagel & Defrost', Tray: 'Drop-Down Crumb Tray' }, image: '/air_fryer.png'
  },
  {
    id: 75, sku: 'SO-APPL-25', title: 'Black+Decker Handheld Immersion Blender 2-Speed Stick',
    category: 'appliances', regular_price: 26.99, sale_price: 22.99, stock_qty: 75,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1400,
    attributes: { Brand: 'Black+Decker', Shaft: 'Stainless Steel Blending', Speeds: '2 Speeds' }, image: '/air_fryer.png'
  },

  // ================= 4. HEALTH & HOUSEHOLD (25 Products, All $10 - $30) =================
  // Nutricost (8 products)
  {
    id: 76, sku: 'SO-HLTH-01', title: 'Nutricost Creatine Monohydrate Micronized Powder 500g',
    category: 'health_household', regular_price: 28.99, sale_price: 22.99, stock_qty: 120,
    is_flash_sale: true, sold_percent: 85, rating: 4.9, reviews_count: 5200,
    attributes: { Brand: 'Nutricost', Servings: '100 Servings (5g)', Purity: 'Micronized Unflavored' }, image: '/nutricost_creatine.jpg'
  },
  {
    id: 77, sku: 'SO-HLTH-02', title: 'Nutricost Vitamin D3 5000 IU Softgels 240 Count',
    category: 'health_household', regular_price: 18.99, sale_price: 13.99, stock_qty: 140,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 4100,
    attributes: { Brand: 'Nutricost', Strength: '5000 IU (125mcg)', Count: '240 Softgels' }, image: '/nutricost_creatine.jpg'
  },
  {
    id: 78, sku: 'SO-HLTH-03', title: 'Nutricost Whey Protein Powder Chocolate Flavor 2 Lbs',
    category: 'health_household', regular_price: 29.99, sale_price: 28.99, stock_qty: 65,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2400,
    attributes: { Brand: 'Nutricost', Protein: '25g per scoop', Size: '2 Lbs (907g)' }, image: '/nutricost_creatine.jpg'
  },
  {
    id: 79, sku: 'SO-HLTH-04', title: 'Nutricost Magnesium Glycinate 420mg Capsules 180 Count',
    category: 'health_household', regular_price: 22.99, sale_price: 17.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3600,
    attributes: { Brand: 'Nutricost', Form: 'Chelated Glycinate', Count: '180 Veggie Capsules' }, image: '/nutricost_creatine.jpg'
  },
  {
    id: 80, sku: 'SO-HLTH-05', title: 'Nutricost Organic Ashwagandha Extract 600mg 120 Capsules',
    category: 'health_household', regular_price: 19.99, sale_price: 15.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 1950,
    attributes: { Brand: 'Nutricost', Organic: 'USDA Certified Organic', Count: '120 Capsules' }, image: '/nutricost_creatine.jpg'
  },
  {
    id: 81, sku: 'SO-HLTH-06', title: 'Nutricost Zinc Picolinate 50mg Tablets 240 Count',
    category: 'health_household', regular_price: 15.99, sale_price: 11.99, stock_qty: 130,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 2700,
    attributes: { Brand: 'Nutricost', Strength: '50mg Zinc', Count: '240 Tablets' }, image: '/nutricost_creatine.jpg'
  },
  {
    id: 82, sku: 'SO-HLTH-07', title: 'Nutricost Pre-Workout High Energy Powder Blue Raspberry',
    category: 'health_household', regular_price: 26.99, sale_price: 21.99, stock_qty: 75,
    is_flash_sale: true, sold_percent: 78, rating: 4.6, reviews_count: 1400,
    attributes: { Brand: 'Nutricost', Caffeine: '300mg Complex', Servings: '30 Servings' }, image: '/nutricost_creatine.jpg'
  },
  {
    id: 83, sku: 'SO-HLTH-08', title: 'Nutricost Melatonin 5mg Fast Dissolve Tablets 240 Count',
    category: 'health_household', regular_price: 16.99, sale_price: 12.99, stock_qty: 105,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 3200,
    attributes: { Brand: 'Nutricost', Dose: '5mg Melatonin', Count: '240 Dissolvable' }, image: '/nutricost_creatine.jpg'
  },
  // OXO (8 products)
  {
    id: 84, sku: 'SO-HLTH-09', title: 'OXO Good Grips Smooth Edge Handheld Safety Can Opener',
    category: 'health_household', regular_price: 29.99, sale_price: 22.99, stock_qty: 85,
    is_flash_sale: true, sold_percent: 80, rating: 4.8, reviews_count: 4900,
    attributes: { Brand: 'OXO', Edge: 'No Sharp Edges', Grip: 'Cushioned Handle' }, image: '/sink_splash.png'
  },
  {
    id: 85, sku: 'SO-HLTH-10', title: 'OXO Good Grips Swivel Stainless Steel Vegetable Peeler',
    category: 'health_household', regular_price: 14.99, sale_price: 11.99, stock_qty: 150,
    is_flash_sale: false, sold_percent: 0, rating: 4.9, reviews_count: 7200,
    attributes: { Brand: 'OXO', Blade: 'Japanese Stainless Steel', Handle: 'Non-Slip Grip' }, image: '/sink_splash.png'
  },
  {
    id: 86, sku: 'SO-HLTH-11', title: 'OXO Good Grips POP Airtight Food Storage Container 1.7 Qt',
    category: 'health_household', regular_price: 23.95, sale_price: 18.95, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3600,
    attributes: { Brand: 'OXO', Seal: 'Push-Button Airtight', Volume: '1.7 Quarts' }, image: '/sink_splash.png'
  },
  {
    id: 87, sku: 'SO-HLTH-12', title: 'OXO Good Grips Stainless Steel 9-Inch Locking Tongs',
    category: 'health_household', regular_price: 18.99, sale_price: 14.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 2800,
    attributes: { Brand: 'OXO', Length: '9-inch Tongs', Lock: 'Pull-Tab Lock' }, image: '/sink_splash.png'
  },
  {
    id: 88, sku: 'SO-HLTH-13', title: 'OXO Good Grips 3-Piece Silicone Everyday Spatula Set',
    category: 'health_household', regular_price: 21.99, sale_price: 16.99, stock_qty: 80,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 1950,
    attributes: { Brand: 'OXO', Heat: '600°F Heat Resistant', Set: '3 Spatulas' }, image: '/sink_splash.png'
  },
  {
    id: 89, sku: 'SO-HLTH-14', title: 'OXO Good Grips Measuring Cups and Spoons Stainless Set',
    category: 'health_household', regular_price: 29.99, sale_price: 24.99, stock_qty: 65,
    is_flash_sale: true, sold_percent: 71, rating: 4.7, reviews_count: 1600,
    attributes: { Brand: 'OXO', Snap: 'Magnetic Storage Snaps', Metal: 'Stainless Steel' }, image: '/sink_splash.png'
  },
  {
    id: 90, sku: 'SO-HLTH-15', title: 'OXO Good Grips Bottle Cleaning Brush Soft Ergonomic Grip',
    category: 'health_household', regular_price: 13.99, sale_price: 10.99, stock_qty: 130,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3400,
    attributes: { Brand: 'OXO', Bristles: 'Dual-Type Bristles', Neck: 'Flexible Reach' }, image: '/sink_splash.png'
  },
  {
    id: 91, sku: 'SO-HLTH-16', title: 'OXO Good Grips Stainless Steel Wheel Pizza Slicer Cutter',
    category: 'health_household', regular_price: 19.99, sale_price: 15.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2200,
    attributes: { Brand: 'OXO', Wheel: '4-inch Stainless Steel', Guard: 'Die-Cast Zinc Thumb Guard' }, image: '/sink_splash.png'
  },
  // Stanley (5 products)
  {
    id: 92, sku: 'SO-HLTH-17', title: 'Stanley Quencher FlowState Replacement Straws 4-Pack',
    category: 'health_household', regular_price: 16.99, sale_price: 12.99, stock_qty: 150,
    is_flash_sale: false, sold_percent: 0, rating: 4.9, reviews_count: 4800,
    attributes: { Brand: 'Stanley', Material: 'BPA-Free Reusable', Fits: '30oz & 40oz Tumblers' }, image: '/stanley_tumbler.jpg'
  },
  {
    id: 93, sku: 'SO-HLTH-18', title: 'Stanley Classic Vacuum Camp Mug 12oz Stainless Steel',
    category: 'health_household', regular_price: 28.00, sale_price: 23.00, stock_qty: 85,
    is_flash_sale: true, sold_percent: 83, rating: 4.8, reviews_count: 3600,
    attributes: { Brand: 'Stanley', Capacity: '12 oz (350ml)', Insulation: 'Double Wall Vacuum' }, image: '/stanley_tumbler.jpg'
  },
  {
    id: 94, sku: 'SO-HLTH-19', title: 'Stanley Adventure Nesting Shot Glass Set Stainless Steel',
    category: 'health_household', regular_price: 26.00, sale_price: 20.00, stock_qty: 70,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 1400,
    attributes: { Brand: 'Stanley', Set: '4 Shot Glasses + Case', Travel: 'Steel Carrying Case' }, image: '/stanley_tumbler.jpg'
  },
  {
    id: 95, sku: 'SO-HLTH-20', title: 'Stanley IceFlow Flip Straw Replacement Lid Assembly',
    category: 'health_household', regular_price: 18.00, sale_price: 14.50, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 1850,
    attributes: { Brand: 'Stanley', Lid: 'Leakproof Flip Straw', Fits: 'IceFlow Jugs & Tumblers' }, image: '/stanley_tumbler.jpg'
  },
  {
    id: 96, sku: 'SO-HLTH-21', title: 'Stanley Classic Stay-Chill Beer Pint Glass 16oz',
    category: 'health_household', regular_price: 25.00, sale_price: 20.00, stock_qty: 80,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 2200,
    attributes: { Brand: 'Stanley', Size: '16 oz (473ml)', Cold: 'Stays Cold 4 Hours' }, image: '/stanley_tumbler.jpg'
  },
  // Levoit (4 products)
  {
    id: 97, sku: 'SO-HLTH-22', title: 'Levoit Core 300 Replacement Filter True HEPA 3-in-1',
    category: 'health_household', regular_price: 29.99, sale_price: 25.99, stock_qty: 95,
    is_flash_sale: true, sold_percent: 86, rating: 4.8, reviews_count: 6100,
    attributes: { Brand: 'Levoit', Filter: 'H13 True HEPA', Fits: 'Levoit Core 300 Series' }, image: '/levoit_purifier.jpg'
  },
  {
    id: 98, sku: 'SO-HLTH-23', title: 'Levoit Core Mini Air Purifier Replacement Filters 2-Pack',
    category: 'health_household', regular_price: 24.99, sale_price: 19.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3400,
    attributes: { Brand: 'Levoit', Pack: '2 Genuine Filters', Target: 'Dust & Pet Dander' }, image: '/levoit_purifier.jpg'
  },
  {
    id: 99, sku: 'SO-HLTH-24', title: 'Levoit Aroma Replacement Pads for Humidifiers 12-Pack',
    category: 'health_household', regular_price: 15.99, sale_price: 11.99, stock_qty: 140,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 1750,
    attributes: { Brand: 'Levoit', Pads: '12 Essential Oil Pads', Fits: 'Levoit Humidifiers' }, image: '/levoit_purifier.jpg'
  },
  {
    id: 100, sku: 'SO-HLTH-25', title: 'Levoit Humidifier Demineralization Mineral Cartridges 10-Pack',
    category: 'health_household', regular_price: 19.99, sale_price: 15.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 1200,
    attributes: { Brand: 'Levoit', Benefit: 'Prevents White Dust Build', Pack: '10 Cartridges' }, image: '/levoit_purifier.jpg'
  },

  // ================= 5. PET SUPPLIES (25 Products, All $10 - $30) =================
  // Purina (9 products)
  {
    id: 101, sku: 'SO-PET-01', title: 'Purina Pro Plan High Protein Adult Dog Shredded Blend 6 Lb',
    category: 'pet_supplies', regular_price: 26.99, sale_price: 22.99, stock_qty: 100,
    is_flash_sale: true, sold_percent: 88, rating: 4.8, reviews_count: 4500,
    attributes: { Brand: 'Purina', Flavor: 'Chicken & Rice', Weight: '6 Lbs (2.7kg)' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 102, sku: 'SO-PET-02', title: 'Purina ONE SmartBlend Natural Dry Cat Food Salmon 7 Lb',
    category: 'pet_supplies', regular_price: 24.99, sale_price: 19.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3600,
    attributes: { Brand: 'Purina', Protein: 'Real Salmon #1', Weight: '7 Lbs' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 103, sku: 'SO-PET-03', title: 'Purina Dentalife Daily Oral Care Dog Chews Large 40 Count',
    category: 'pet_supplies', regular_price: 19.99, sale_price: 14.99, stock_qty: 125,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2900,
    attributes: { Brand: 'Purina', Dental: 'Reduces Tartar Build', Count: '40 Large Chews' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 104, sku: 'SO-PET-04', title: 'Purina Beggin Strips Real Bacon Dog Treats 25oz Bag',
    category: 'pet_supplies', regular_price: 16.99, sale_price: 12.99, stock_qty: 140,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 5200,
    attributes: { Brand: 'Purina', Meat: 'Real Bacon Flavor', Weight: '25 oz Pouch' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 105, sku: 'SO-PET-05', title: 'Purina Friskies Wet Cat Food Variety Pack 24 Cans',
    category: 'pet_supplies', regular_price: 24.99, sale_price: 19.99, stock_qty: 90,
    is_flash_sale: true, sold_percent: 79, rating: 4.7, reviews_count: 4100,
    attributes: { Brand: 'Purina', Meals: '24x 5.5oz Cans', Gravy: 'Meaty Bits in Gravy' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 106, sku: 'SO-PET-06', title: 'Purina Busy Bone Long-Lasting Chew Dog Treats 10 Count',
    category: 'pet_supplies', regular_price: 15.99, sale_price: 11.99, stock_qty: 115,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2300,
    attributes: { Brand: 'Purina', Center: 'Real Meat Center', Count: '10 Medium/Large Bones' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 107, sku: 'SO-PET-07', title: 'Purina Tidy Cats Clumping Litter 20 Lb Jug Low Dust',
    category: 'pet_supplies', regular_price: 21.99, sale_price: 16.99, stock_qty: 85,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 3800,
    attributes: { Brand: 'Purina', Odor: '24/7 Performance Odor', Weight: '20 Lbs' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 108, sku: 'SO-PET-08', title: 'Purina Fancy Feast Gourmet Wet Cat Food 12 Cans Salmon',
    category: 'pet_supplies', regular_price: 18.99, sale_price: 14.49, stock_qty: 95,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 2700,
    attributes: { Brand: 'Purina', Gourmet: 'Grilled Salmon Feast', Count: '12x 3oz Cans' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 109, sku: 'SO-PET-09', title: 'Purina Pro Plan Veterinary Diets FortiFlora Probiotics 30 Pack',
    category: 'pet_supplies', regular_price: 29.99, sale_price: 28.99, stock_qty: 70,
    is_flash_sale: false, sold_percent: 0, rating: 4.9, reviews_count: 3400,
    attributes: { Brand: 'Purina', Gut: 'Digestive Health Powder', Count: '30 Sachets' }, image: '/crocs_clogs.jpg'
  },
  // KONG (8 products)
  {
    id: 110, sku: 'SO-PET-10', title: 'KONG Classic Durable Natural Rubber Dog Chew Toy Large',
    category: 'pet_supplies', regular_price: 18.99, sale_price: 14.99, stock_qty: 130,
    is_flash_sale: true, sold_percent: 84, rating: 4.8, reviews_count: 6800,
    attributes: { Brand: 'KONG', Rubber: 'All-Natural Red Rubber', Size: 'Large (30-65 lbs)' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 111, sku: 'SO-PET-11', title: 'KONG Extreme Tough Black Rubber Dog Toy for Power Chewers',
    category: 'pet_supplies', regular_price: 22.99, sale_price: 17.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 4200,
    attributes: { Brand: 'KONG', Strength: 'Ultra-Durable Black Formula', Size: 'Large' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 112, sku: 'SO-PET-12', title: 'KONG Easy Treat Real Peanut Butter Recipe Paste 8oz Can',
    category: 'pet_supplies', regular_price: 13.99, sale_price: 10.99, stock_qty: 140,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 3100,
    attributes: { Brand: 'KONG', Flavor: 'Peanut Butter Paste', Dispenser: 'No-Mess Nozzle' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 113, sku: 'SO-PET-13', title: 'KONG Cozie Marvin the Moose Plush Squeaky Dog Toy',
    category: 'pet_supplies', regular_price: 14.99, sale_price: 11.49, stock_qty: 115,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 5100,
    attributes: { Brand: 'KONG', Layer: 'Extra Layer of Material', Sound: 'Internal Squeaker' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 114, sku: 'SO-PET-14', title: 'KONG Wobbler Interactive Treat Dispensing Dog Toy Large',
    category: 'pet_supplies', regular_price: 27.99, sale_price: 21.99, stock_qty: 75,
    is_flash_sale: true, sold_percent: 76, rating: 4.7, reviews_count: 3800,
    attributes: { Brand: 'KONG', Feeder: 'Action Slow Feeder', Dishwasher: 'Top Rack Safe' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 115, sku: 'SO-PET-15', title: 'KONG Wild Knots Internal Knotted Ropes Bear Dog Toy',
    category: 'pet_supplies', regular_price: 16.99, sale_price: 12.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2400,
    attributes: { Brand: 'KONG', Core: 'Knotted Skeleton Rope', Stuffing: 'Minimal Stuffing' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 116, sku: 'SO-PET-16', title: 'KONG Squeezz Durable Squeaking Action Ball Large 2-Pack',
    category: 'pet_supplies', regular_price: 15.99, sale_price: 12.49, stock_qty: 100,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1900,
    attributes: { Brand: 'KONG', Bounce: 'Recessed Squeaker', Pack: '2 Large Balls' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 117, sku: 'SO-PET-17', title: 'KONG Puppy Soft Natural Teething Rubber Toy Medium',
    category: 'pet_supplies', regular_price: 14.99, sale_price: 11.99, stock_qty: 105,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3600,
    attributes: { Brand: 'KONG', Teething: 'Customized Puppy Rubber', Gums: 'Soothes Sore Gums' }, image: '/crocs_clogs.jpg'
  },
  // Blue Buffalo (8 products)
  {
    id: 118, sku: 'SO-PET-18', title: 'Blue Buffalo Life Protection Natural Adult Dog Food Chicken 5 Lb',
    category: 'pet_supplies', regular_price: 25.99, sale_price: 21.99, stock_qty: 85,
    is_flash_sale: true, sold_percent: 81, rating: 4.8, reviews_count: 4200,
    attributes: { Brand: 'Blue Buffalo', Protein: 'Real Deboned Chicken', Weight: '5 Lbs (2.2kg)' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 119, sku: 'SO-PET-19', title: 'Blue Buffalo Wilderness High Protein Grain Free Cat Food 5 Lb',
    category: 'pet_supplies', regular_price: 28.99, sale_price: 24.99, stock_qty: 70,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 2900,
    attributes: { Brand: 'Blue Buffalo', Grain: '100% Grain Free', Recipe: 'Chicken Recipe' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 120, sku: 'SO-PET-20', title: 'Blue Buffalo Health Bars Crunchy Dog Biscuits Bacon & Cheese 16oz',
    category: 'pet_supplies', regular_price: 13.99, sale_price: 10.99, stock_qty: 120,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 3100,
    attributes: { Brand: 'Blue Buffalo', Oats: 'Wholesome Whole Grains', Weight: '16 oz (453g)' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 121, sku: 'SO-PET-21', title: 'Blue Buffalo Blue Bits Soft-Moist Training Dog Treats Beef 11oz',
    category: 'pet_supplies', regular_price: 15.99, sale_price: 11.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2600,
    attributes: { Brand: 'Blue Buffalo', Treats: 'DHA Support Training Bits', RealMeat: 'Real Beef #1' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 122, sku: 'SO-PET-22', title: 'Blue Buffalo Tastefuls Natural Wet Cat Food Variety 12 Cans',
    category: 'pet_supplies', regular_price: 22.99, sale_price: 17.99, stock_qty: 90,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 1800,
    attributes: { Brand: 'Blue Buffalo', Pâté: 'Smooth Chicken & Turkey', Count: '12x 3oz Cans' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 123, sku: 'SO-PET-23', title: 'Blue Buffalo Sizzlers Real Pork Bacon-Style Dog Treats 15oz',
    category: 'pet_supplies', regular_price: 16.99, sale_price: 12.99, stock_qty: 100,
    is_flash_sale: false, sold_percent: 0, rating: 4.6, reviews_count: 1400,
    attributes: { Brand: 'Blue Buffalo', Pork: 'USA Farm-Raised Pork', Texture: 'Chewy Bacon Strips' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 124, sku: 'SO-PET-24', title: 'Blue Buffalo Homestyle Recipe Natural Wet Dog Food 6 Cans',
    category: 'pet_supplies', regular_price: 24.99, sale_price: 19.99, stock_qty: 80,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 2100,
    attributes: { Brand: 'Blue Buffalo', Entree: 'Chicken Dinner with Veggies', Count: '6x 12.5oz Cans' }, image: '/crocs_clogs.jpg'
  },
  {
    id: 125, sku: 'SO-PET-25', title: 'Blue Buffalo Dental Bones All-Natural Dental Chews Regular 12 Count',
    category: 'pet_supplies', regular_price: 19.99, sale_price: 15.49, stock_qty: 95,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 1650,
    attributes: { Brand: 'Blue Buffalo', Teeth: 'Cleans Teeth Freshens Breath', Count: '12 Regular Bones' }, image: '/crocs_clogs.jpg'
  },

  // ================= 6. TOYS, GAMES & BABY (25 Products, All $10 - $30) =================
  // LEGO (9 products)
  {
    id: 126, sku: 'SO-TOY-01', title: 'LEGO Creator 3-in-1 Exotic Parrot Building Toy Set 31136',
    category: 'toys_games_baby', regular_price: 24.99, sale_price: 19.99, stock_qty: 110,
    is_flash_sale: true, sold_percent: 85, rating: 4.9, reviews_count: 4200,
    attributes: { Brand: 'LEGO', Pieces: '253 Pieces', Models: 'Parrot, Fish & Frog' }, image: '/lego_bonsai.jpg'
  },
  {
    id: 127, sku: 'SO-TOY-02', title: 'LEGO Speed Champions Pagani Utopia Hypercar Race Car 76915',
    category: 'toys_games_baby', regular_price: 26.99, sale_price: 21.99, stock_qty: 90,
    is_flash_sale: true, sold_percent: 78, rating: 4.9, reviews_count: 3600,
    attributes: { Brand: 'LEGO', Series: 'Speed Champions', Pieces: '249 Pieces + Minifigure' }, image: '/lego_bonsai.jpg'
  },
  {
    id: 128, sku: 'SO-TOY-03', title: 'LEGO City Fire Rescue Helicopter Building Toy Set 60281',
    category: 'toys_games_baby', regular_price: 22.99, sale_price: 17.99, stock_qty: 100,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 2100,
    attributes: { Brand: 'LEGO', Theme: 'LEGO City Emergency', Pieces: '212 Pieces' }, image: '/lego_bonsai.jpg'
  },
  {
    id: 129, sku: 'SO-TOY-04', title: 'LEGO Classic Medium Creative Brick Box Construction Set 10696',
    category: 'toys_games_baby', regular_price: 29.99, sale_price: 27.99, stock_qty: 75,
    is_flash_sale: false, sold_percent: 0, rating: 4.9, reviews_count: 8500,
    attributes: { Brand: 'LEGO', Bricks: '484 Colorful Pieces', Storage: 'Plastic Storage Box' }, image: '/lego_bonsai.jpg'
  },
  {
    id: 130, sku: 'SO-TOY-05', title: 'LEGO Star Wars 501st Clone Troopers Battle Pack 75345',
    category: 'toys_games_baby', regular_price: 24.99, sale_price: 19.99, stock_qty: 95,
    is_flash_sale: false, sold_percent: 0, rating: 4.9, reviews_count: 4800,
    attributes: { Brand: 'LEGO', Figures: '4 Star Wars Minifigures', Cannon: 'AV-7 Anti-Vehicle Cannon' }, image: '/lego_bonsai.jpg'
  },
  {
    id: 131, sku: 'SO-TOY-06', title: 'LEGO Marvel Spider-Man Car and Doc Ock Showdown 10789',
    category: 'toys_games_baby', regular_price: 14.99, sale_price: 11.99, stock_qty: 120,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 1950,
    attributes: { Brand: 'LEGO', Age: 'Ages 4+', Pieces: '48 Large Starter Pieces' }, image: '/lego_bonsai.jpg'
  },
  {
    id: 132, sku: 'SO-TOY-07', title: 'LEGO Minecraft The Swamp Adventure Zombie Action Set 21240',
    category: 'toys_games_baby', regular_price: 15.99, sale_price: 12.99, stock_qty: 115,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3100,
    attributes: { Brand: 'LEGO', Game: 'Minecraft Authentic Biome', Figures: 'Alex & Zombie' }, image: '/lego_bonsai.jpg'
  },
  {
    id: 133, sku: 'SO-TOY-08', title: 'LEGO Disney Princess Twirling Rapunzel Music Box 43214',
    category: 'toys_games_baby', regular_price: 14.99, sale_price: 11.99, stock_qty: 105,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 1600,
    attributes: { Brand: 'LEGO', Character: 'Rapunzel & Pascal', Dress: 'Diamond Dress Stand' }, image: '/lego_bonsai.jpg'
  },
  {
    id: 134, sku: 'SO-TOY-09', title: 'LEGO Technic Monster Jam Megalodon Pull-Back Truck 42134',
    category: 'toys_games_baby', regular_price: 24.99, sale_price: 19.99, stock_qty: 85,
    is_flash_sale: true, sold_percent: 70, rating: 4.8, reviews_count: 2400,
    attributes: { Brand: 'LEGO', Mechanism: 'Pull-Back Action Motor', Build: '2-in-1 Lusca Racer' }, image: '/lego_bonsai.jpg'
  },
  // Hasbro (8 products)
  {
    id: 135, sku: 'SO-TOY-10', title: 'Hasbro Gaming Classic Monopoly Family Board Game',
    category: 'toys_games_baby', regular_price: 24.99, sale_price: 19.99, stock_qty: 90,
    is_flash_sale: true, sold_percent: 82, rating: 4.8, reviews_count: 6500,
    attributes: { Brand: 'Hasbro', Players: '2 to 6 Players', Edition: 'Classic 8 Tokens' }, image: '/arc_lighter.png'
  },
  {
    id: 136, sku: 'SO-TOY-11', title: 'Hasbro Gaming Connect 4 Classic Grid Strategy Disc Game',
    category: 'toys_games_baby', regular_price: 15.99, sale_price: 11.99, stock_qty: 130,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 7200,
    attributes: { Brand: 'Hasbro', Age: 'Ages 6 and up', Discs: '42 Red & Gold Discs' }, image: '/arc_lighter.png'
  },
  {
    id: 137, sku: 'SO-TOY-12', title: 'Hasbro Gaming Jenga Classic Wooden Block Stacking Game',
    category: 'toys_games_baby', regular_price: 19.99, sale_price: 15.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.9, reviews_count: 8100,
    attributes: { Brand: 'Hasbro', Wood: '54 Precision Hardwood Blocks', Stacking: 'Tower Sleeve Included' }, image: '/arc_lighter.png'
  },
  {
    id: 138, sku: 'SO-TOY-13', title: 'Hasbro Gaming Clue Classic Mystery Suspense Board Game',
    category: 'toys_games_baby', regular_price: 24.99, sale_price: 19.99, stock_qty: 85,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 3900,
    attributes: { Brand: 'Hasbro', Mystery: 'Mansion Crime Investigation', Players: '2 to 6 Players' }, image: '/arc_lighter.png'
  },
  {
    id: 139, sku: 'SO-TOY-14', title: 'Hasbro Play-Doh Modeling Compound Starter Colors 10-Pack',
    category: 'toys_games_baby', regular_price: 14.99, sale_price: 10.99, stock_qty: 150,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 5900,
    attributes: { Brand: 'Hasbro', Cans: '10x 2oz Cans', Safe: 'Non-Toxic Dough' }, image: '/arc_lighter.png'
  },
  {
    id: 140, sku: 'SO-TOY-15', title: 'Hasbro Nerf Elite 2.0 Commander RD-6 Dart Blaster 12 Darts',
    category: 'toys_games_baby', regular_price: 18.99, sale_price: 14.99, stock_qty: 95,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 4200,
    attributes: { Brand: 'Hasbro', Drum: '6-Dart Rotating Drum', Distance: 'Fires up to 90 Feet' }, image: '/arc_lighter.png'
  },
  {
    id: 141, sku: 'SO-TOY-16', title: 'Hasbro Gaming Yahtzee Classic Dice Rolling Family Game',
    category: 'toys_games_baby', regular_price: 14.99, sale_price: 10.99, stock_qty: 125,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 4800,
    attributes: { Brand: 'Hasbro', Dice: '5 Dice + Rolling Cup', Scoresheet: 'Score Pads Included' }, image: '/arc_lighter.png'
  },
  {
    id: 142, sku: 'SO-TOY-17', title: 'Hasbro Gaming Operation Electronic Classic Board Game',
    category: 'toys_games_baby', regular_price: 24.99, sale_price: 19.99, stock_qty: 80,
    is_flash_sale: true, sold_percent: 75, rating: 4.6, reviews_count: 3100,
    attributes: { Brand: 'Hasbro', Buzzer: 'Light-Up Red Nose Buzzer', Pieces: '12 Cavity Ailments' }, image: '/arc_lighter.png'
  },
  // Mattel (8 products)
  {
    id: 143, sku: 'SO-TOY-18', title: 'Mattel Games UNO Classic Card Game with Wild Custom Cards',
    category: 'toys_games_baby', regular_price: 13.99, sale_price: 10.49, stock_qty: 180,
    is_flash_sale: false, sold_percent: 0, rating: 4.9, reviews_count: 9800,
    attributes: { Brand: 'Mattel', Cards: '112 Cards in Deck', Players: '2 to 10 Players' }, image: '/arc_lighter.png'
  },
  {
    id: 144, sku: 'SO-TOY-19', title: 'Mattel Hot Wheels 1:64 Scale Die-Cast Toy Cars 10-Pack Box',
    category: 'toys_games_baby', regular_price: 19.99, sale_price: 15.99, stock_qty: 140,
    is_flash_sale: true, sold_percent: 88, rating: 4.9, reviews_count: 7400,
    attributes: { Brand: 'Mattel', Vehicles: '10 Authentic Die-Cast Cars', Scale: '1:64 Scale' }, image: '/arc_lighter.png'
  },
  {
    id: 145, sku: 'SO-TOY-20', title: 'Mattel Games Phase 10 Rummy-Style Challenging Card Game',
    category: 'toys_games_baby', regular_price: 14.99, sale_price: 10.99, stock_qty: 135,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 5200,
    attributes: { Brand: 'Mattel', Rounds: '10 Varied Phases', Players: '2 to 6 Players' }, image: '/arc_lighter.png'
  },
  {
    id: 146, sku: 'SO-TOY-21', title: 'Mattel Barbie Fashionistas Doll with Trendy Floral Dress',
    category: 'toys_games_baby', regular_price: 15.99, sale_price: 11.99, stock_qty: 110,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 3600,
    attributes: { Brand: 'Mattel', Doll: 'Authentic Barbie Doll', Outfit: 'Dress, Shoes & Sunglasses' }, image: '/arc_lighter.png'
  },
  {
    id: 147, sku: 'SO-TOY-22', title: 'Mattel Games Skip-Bo Sequencing Card Family Game',
    category: 'toys_games_baby', regular_price: 14.99, sale_price: 10.99, stock_qty: 120,
    is_flash_sale: false, sold_percent: 0, rating: 4.8, reviews_count: 4400,
    attributes: { Brand: 'Mattel', Decks: '162 Cards Total', Age: 'Ages 7 and older' }, image: '/arc_lighter.png'
  },
  {
    id: 148, sku: 'SO-TOY-23', title: 'Mattel Hot Wheels Track Builder Unlimited Straight Track Pack',
    category: 'toys_games_baby', regular_price: 16.99, sale_price: 12.99, stock_qty: 95,
    is_flash_sale: false, sold_percent: 0, rating: 4.7, reviews_count: 2800,
    attributes: { Brand: 'Mattel', Track: '12 Feet of Orange Track', Connectors: 'Included Track Connectors' }, image: '/arc_lighter.png'
  },
  {
    id: 149, sku: 'SO-TOY-24', title: 'Mattel Fisher-Price Rock-a-Stack Classic Stacking Toy Rings',
    category: 'toys_games_baby', regular_price: 13.99, sale_price: 10.99, stock_qty: 130,
    is_flash_sale: false, sold_percent: 0, rating: 4.9, reviews_count: 6700,
    attributes: { Brand: 'Mattel', Rings: '5 Colorful Grasp Rings', Base: 'Bat-at Rocker Base' }, image: '/arc_lighter.png'
  },
  {
    id: 150, sku: 'SO-TOY-25', title: 'Mattel Games Blokus Fast-Paced Strategy Geometry Board Game',
    category: 'toys_games_baby', regular_price: 24.99, sale_price: 19.99, stock_qty: 85,
    is_flash_sale: true, sold_percent: 74, rating: 4.8, reviews_count: 3900,
    attributes: { Brand: 'Mattel', Strategy: 'Tile Placement Game', Pieces: '84 Colored Game Pieces' }, image: '/arc_lighter.png'
  }
];

// Validation checks
console.log('--- VALIDATING 150 PRODUCTS ---');
const categories = ['beauty', 'electronics', 'appliances', 'health_household', 'pet_supplies', 'toys_games_baby'];
const catCounts = {};
const brandCounts = {};
let priceError = 0;

products.forEach(p => {
  catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  const brand = p.attributes.Brand;
  const catBrandKey = `${p.category} -> ${brand}`;
  brandCounts[catBrandKey] = (brandCounts[catBrandKey] || 0) + 1;

  if (p.sale_price < 10.00 || p.sale_price > 30.00) {
    console.error(`PRICE ERROR: ${p.sku} has sale price $${p.sale_price}`);
    priceError++;
  }
  if (p.regular_price < 10.00 || p.regular_price > 30.00) {
    console.error(`PRICE ERROR: ${p.sku} has regular price $${p.regular_price}`);
    priceError++;
  }
});

console.log('Category Counts:', catCounts);
console.log('Brand Counts:', brandCounts);

if (priceError > 0) {
  console.error(`Failed with ${priceError} price errors!`);
  process.exit(1);
}

// 1. UPDATE src/main.js
const mainJsPath = path.resolve('src/main.js');
let mainJsContent = fs.readFileSync(mainJsPath, 'utf8');

// Replace PREMIER_TOP_BRANDS
const newPremierBrands = `const PREMIER_TOP_BRANDS = [
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
];`;

mainJsContent = mainJsContent.replace(/const PREMIER_TOP_BRANDS = \[[\s\S]*?\n\];/, newPremierBrands);

// Replace SWIFT_SEED_PRODUCTS
const formattedProducts = JSON.stringify(products, null, 2);
mainJsContent = mainJsContent.replace(/const SWIFT_SEED_PRODUCTS = \[[\s\S]*?\n\];/, `const SWIFT_SEED_PRODUCTS = ${formattedProducts};`);

fs.writeFileSync(mainJsPath, mainJsContent, 'utf8');
console.log('✓ Successfully updated src/main.js with 150 products!');
