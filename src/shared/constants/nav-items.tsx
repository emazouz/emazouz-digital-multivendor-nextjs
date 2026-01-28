import React from "react";
import {
  LayoutDashboard,
  User,
  Users,
  Settings,
  FileText,
  DollarSign,
  MessageSquare,
  Download,
  Package,
  ShoppingCart,
  Bell,
  Ticket,
} from "lucide-react";
import { NavItem } from "../types";


// Move navItems outside component to prevent re-creation on every render
export const NAV_ITEMS: NavItem[] = [
  // Main Section
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
    section: "main",
  },

  // Store Management
  {
    label: "Products",
    href: "/admin/products",
    icon: <Package className="w-5 h-5" />,
    section: "store",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart className="w-5 h-5" />,
    section: "store",
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: <Ticket className="w-5 h-5" />,
    section: "store",
  },

  // Users & Interaction
  {
    label: "Users",
    href: "/admin/users",
    icon: <Users className="w-5 h-5" />,
    section: "users",
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: <MessageSquare className="w-5 h-5" />,
    section: "users",
  },

  // Reports & Finance
  {
    label: "Downloads",
    href: "/admin/downloads",
    icon: <Download className="w-5 h-5" />,
    section: "reports",
  },
  {
    label: "Earnings",
    href: "/admin/earnings",
    icon: <DollarSign className="w-5 h-5" />,
    section: "reports",
  },
  {
    label: "Statements",
    href: "/admin/statements",
    icon: <FileText className="w-5 h-5" />,
    section: "reports",
  },

  // Account & Settings
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: <Bell className="w-5 h-5" />,
    section: "account",
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: <User className="w-5 h-5" />,
    section: "account",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
    section: "account",
  },
];
