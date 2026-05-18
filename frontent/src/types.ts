export interface THttpArgs{
    url:string;
    options?:{
        method?:string,
        body?:string,
        headers?:any
    };
}


export interface TAuthState {
  token: string | null;
  isAuthenticated: boolean;
}



export interface TAddress {
  id?: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}



export interface TUser {
  id: string;
  email: string;
  name: string;
}

export interface TCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

export interface TProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  reviewsCount?: number;
  imageUrls: string[];
  tags: string[];
  active: boolean;
  createdAt?: string;
  category?: TCategory;
  categoryId?: string;
}

export interface TPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface TCartItem {
  id: number;
  productId: string;
  productName: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  availableStock: number;
  lineTotal: number;
}

export interface TCart {
  id?: number;
  items: TCartItem[];
  totalItems: number;
  subtotal: number;
}

export interface TOrderItem {
  id: number;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface TOrder {
  id: number;
  status: string;
  totalAmount: number;
  shippingName: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  createdAt: string;
  items: TOrderItem[];
}

export interface TCreateOrderPayload {
  shippingName: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
}
