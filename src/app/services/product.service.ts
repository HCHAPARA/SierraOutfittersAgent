import { Injectable } from '@angular/core';

export interface Product {
  ProductName: string;
  SKU: string;
  Inventory: number;
  Description: string;
  Tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      "ProductName": "Bhavish's Backcountry Blaze Backpack",
      "SKU": "SOBP001",
      "Inventory": 120,
      "Description": "Conquer the wilderness with the Backcountry Blaze Backpack, designed for rugged adventures and ultimate durability. Featuring ample storage and weatherproof materials, this backpack is your perfect companion for any outdoor expedition.",
      "Tags": ["Backpack", "Hiking", "Adventure", "Outdoor Gear"]
    },
    {
      "ProductName": "Crain's Summit Pro X Skis",
      "SKU": "SOTN002",
      "Inventory": 75,
      "Description": "Crain's Summit Pro X Skis offer ultimate precision and performance for all skill levels. The advanced vibration-dampening system ensures a smooth ride, making every descent a thrilling adventure.",
      "Tags": ["Skis", "Snow", "Winter", "Adventure"]
    },
    {
      "ProductName": "Nat's Infinity Pro Hairbrush",
      "SKU": "SOBT003",
      "Inventory": 200,
      "Description": "Unleash the power of perfect hair with the Infinity Pro Hairbrush. Engineered with cutting-edge bristle technology, this hairbrush effortlessly detangles, smooths, and adds unparalleled shine to your locks.",
      "Tags": ["High-Tech", "Adventure", "Trail", "Comfort"]
    },
    {
      "ProductName": "Beth's Caffinated Energy Drink",
      "SKU": "SOWB004",
      "Inventory": 300,
      "Description": "Unleash your coding prowess with Beth's Caffnated Energy Drink, the ultimate fuel for lightning-fast programming with uncertain results.",
      "Tags": ["Adventure-Ready", "Food & Beverage", "Weatherproof", "Versatile"]
    },
    {
      "ProductName": "Pol's Peregrine Pathfinder Plane",
      "SKU": "SOJT005",
      "Inventory": 150,
      "Description": "Soar to new heights with the Peregrine Pathfinder Plane, the epitome of aviation excellence. Designed for unparalleled speed and agility, this aircraft offers a smooth and powerful flight experience.",
      "Tags": ["Adventure-Ready", "Explorer", "Rugged Design", "Trailblazing"]
    },
    {
      "ProductName": "Ishmeet's Jetpack",
      "SKU": "SOSB006",
      "Inventory": 180,
      "Description": "Lightweight and durable, it's perfect for both short bursts of speed and longer, scenic flights. Elevate your adventures and defy gravity with Ishmeet's Jetpack.",
      "Tags": ["Personal Flight", "High-Tech", "Adventure", "Safety-Enhanced"]
    },
    {
      "ProductName": "Nishita's Invisibility Cloak",
      "SKU": "SOSV007",
      "Inventory": 90,
      "Description": "Crafted with state-of-the-art cloaking technology, this cloak renders you completely invisible, allowing for unmatched stealth and discretion.",
      "Tags": ["Stealth", "High-Tech", "Discretion", "Advanced Cloaking"]
    },
    {
      "ProductName": "Zack's Bulk Up Protein Bars",
      "SKU": "SOSV008",
      "Inventory": 14,
      "Description": "Fuel your gains with Zack's Bulk Up Protein Bars, the perfect companion for your intense workout regime. Provides energy and nutrition you need to power through.",
      "Tags": ["Adventure-Ready", "Food & Beverage", "Versatile"]
    },
    {
      "ProductName": "Dorothy's Wizarding Red Shoes",
      "SKU": "SOSV009",
      "Inventory": 50,
      "Description": "Click your heels to teleport exactly where you need to go! These fiery red shoes are stylish AND functional.",
      "Tags": ["Fashion", "Lifestyle", "Teleportation", "Transport"]
    },
    {
      "ProductName": "Nayely's Soarin' Surfboard",
      "SKU": "SOSV010",
      "Inventory": 7,
      "Description": "Ride the waves like never before with the Soarin' Surfboard! Glide above the water, blending the rush of surfing with the freedom of flight.",
      "Tags": ["Water Sports", "Lifestyle", "Adventure", "Outdoors", "Transport"]
    }
  ]
  ;

  constructor() {}

  checkAvailability(sku: string): Product | undefined {
    return this.products.find(p => p.SKU.toLowerCase() === sku.toLowerCase());
  }
}
