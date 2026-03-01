import type { ReactNode } from "react";

export interface DropdownProps {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  toggle: () => void;
  children: ReactNode;
  isCollapsed: boolean;
  isActive?: boolean;
}


export interface NavItemProps {
  icon?: ReactNode;
  label: string;
  to: string;
  isSubItem?: boolean; // Replaced 'side'
  isHot?: boolean; // Replaced 'hot'
  isCollapsed?: boolean;
  onClick?: () => void;
}

export interface SectionLabelProps {
  label: string;
  isCollapsed: boolean;
}


export interface SidebarProps {
  max: number;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  name?: string;       // Add ? (Optional)
  link?: string;       // Add ? (Optional)
  isPaid?: boolean;    // Add ? (Optional)
  ordersCount?: number;     // Add ? (Optional)
  storeid?: string
}

export interface Categories {
  name: string;
  image: string | null;
  id: string;
  show: boolean
}

export interface faqs {
  question: string;
  answer: string;
  id: string;
}

export interface  contacts  { 
        phone: string;
        instagram: string;
        tiktok: string;
        facebook: string;
        whatsapp: string
    }  


export interface  header  {
        name:  boolean ;
        logo: boolean  ;
        headerColor: string; // تم التعديل لـ 6 خانات للأمان
        textColor: string;
        barColor: string;
    }    
export interface thanks  {
        img:  boolean;
        title:  boolean;
        about:  boolean;
        homeButton:  boolean; // camelCase
        phone:  boolean;
        media:  boolean;
        titleText:  string;
        aboutText:  string ;
    } 

 export interface pixel {
  name: string;
  id: string
 }   
export interface Store {
logo: string;
      language: string;
        enableBureau: boolean;
 storeName: string;
   _id: string;
   faqs: faqs[];
   categories: Categories[];
   domain: string;
   contacts:contacts;
   header : header;
   mainColor: string;
   thanks:thanks;
   deliveryCompany:deliveryCompany;
    facebookPixel?:pixel;
    tiktokPixel?:pixel;
      ProductCardType: string,
    CategoryCardType: string,
}

export interface deliveryCompany {
   name: string;
        key: string;
        token: string;
        img?: string
}


export interface OrderDetails {
  title: string;
  value: string; // Number of months as string
  price: string;
  term: string;
  savings: string | null;
  desc: string;
}

export interface PaymentInfo {
  ccp: string;
  rip: string;
  name: string;
  phone: string;
}


export interface OfferPayload {
  _id: string;
  user: string;
  price: number;
  orders:number; // Date or string depending on your logic
  offerTitle: string;
  PaymentImage: string;
  userName: string;
  status: string;
  date: Date;
}

export interface PlanOffer { 
  _id: string;
  userId:string,
    price: number,
    orders: number,
    offerTitle: string,
    PaymentImage: string,
    userName: string,
    status: string,
    createdAt: string,
  }

export interface UserStore {
logo: string;
 storeName: string;
   id: string
}

export  interface User {
    dateOfExpire:  Date | undefined ,  
  password: string;
  phone: string;
  _id: string;
  name: string;
  email: string;
  Stores: UserStore[];
  isPaid: boolean; // هل دفع الاشتراك؟
  ordersCount: number,
  repoName: string,
   maxOrder: number
   orders: number
       createdAt: Date,

}


export interface visits {
           last_visit :string,
           page : string,
           productName : string,
           image : string
        } 

export interface HeaderProps {
  toggleSidebar: () => void;
  openLanguagePanel: () => void;
  openAccountPanel: () => void;
  isPaid?: boolean;
  storeid?: string
}

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string; // Optional custom class
}


export interface AccountPanelProps {
  user?: User;
  hide: () => void;
}


export interface LanguagePanelProps {
  hide: () => void;
}

export interface LanguageOption {
  code: string;
  label: string;
  native: string;
}

export interface OrderNoteEditorProps {
    note: string;                    // Current note value
    status: string;                  // Order status for context
    onNoteChange: (note: string) => void;  // Note change handler
    onSave: () => void;             // Save handler
    onCancel: () => void;           // Cancel handler
}

export interface DeliverySendConfirmationProps {
    onConfirm: () => void;
    onCancel: () => void;
}


export interface OrderDeleteConfirmationProps {
    order: orders;           // Order to delete
    onConfirm: () => void;   // Confirm handler
    onCancel: () => void;    // Cancel handler
}


export interface orders {
  user?: string;
   store: string;
   DelevryPrice: number;
   _id? : string;
      // تفاصيل العميل
      name: string;
      phone: string;
      state: string;
      city: string;
      
      // تفاصيل المنتج المطلوب
      // (يمكنك تخزين نسخة من المنتج هنا أو ربطه بـ ObjectId)
      productData: product | null, // قمت بتسميتها productData لتكون أوضح من item
      price: number,
      quantity: number,
      total: number,
      color?: string,
      size?: string,
      
       status?:string;
      show?:boolean;
      
       Tracking?: string;  
      SendTo?: boolean;  
      home: boolean;  
      offer?: boolean;
      freeDelevry?: boolean;
      offerNmae?: string;
      note?: string;  
  createdAt?: Date
}


export type OrderSort =
  | "newest"
  | "oldest"
  | "priceHigh"
  | "priceLow";
 
export interface OrderFilters {
  status: "all" | string;
  productData: "all" | string;
  customer: string;
  state: "all" | string;
  delevetyType: "all" | "home" | "office";
  sortBy: OrderSort;
}


export interface product{
  subdomain: string;
  _id ?: string;
   store: string;
      name: string;
      subTitel: string;
      price: number ;
      Oldprice?: number ;
      ShortDescription: string;
      Description: string;
      tags: string[];
      note: string;
      show:boolean;
      type?: string;  
      images: string[] | [];
      LadingPages: string[] | [];
       colorOpions?: string[];
        sizeOpions?: string[] ;
      Offers?: Offer[],
}

export interface Offer {
  id: number;
  name: string;
  Quantity: string;
  price: string;
  freedelevry: boolean;
  topOffer: boolean;
}


export interface DeliveryPrices {
    store?:  string;
      States : DeliveryPrice[]
}

export interface DeliveryPrice  {
        id: number,
        code: string,
        name: string,
        ar_name: string,
        stop_back: number,
        prix_initial: number
    }