import type { AuthRole } from "@/lib/auth/types";
import type {
  BrandDashboardProduct,
  BrandOrder,
  BrandOrderStatus
} from "@/lib/mock/dashboard/brand-dashboard";
import type {
  BuyerCartItem,
  BuyerCatalogProduct,
  BuyerOrder
} from "@/lib/mock/dashboard/buyer-dashboard";

export type GuestCatalogProduct = Omit<BuyerCatalogProduct, "wholesalePrice" | "retailPrice">;

export type GuestCommerceResponse = {
  role: "guest";
  catalog: GuestCatalogProduct[];
};

export type BuyerCommerceResponse = {
  role: "buyer";
  catalog: BuyerCatalogProduct[];
  cart: BuyerCartItem[];
  orders: BuyerOrder[];
  favoriteProductIds: string[];
};

export type BrandCommerceResponse = {
  role: "brand";
  brandProducts: BrandDashboardProduct[];
  brandOrders: BrandOrder[];
};

export type DemoCommerceGetResponse =
  | GuestCommerceResponse
  | BuyerCommerceResponse
  | BrandCommerceResponse;

export type BuyerCommerceAction =
  | { action: "addToCart"; productId: string }
  | { action: "updateQuantity"; productId: string; quantity: number }
  | { action: "removeFromCart"; productId: string }
  | { action: "toggleFavorite"; productId: string }
  | { action: "checkout" };

export type BrandCommerceAction = {
  action: "updateStatus";
  orderId: string;
  status: BrandOrderStatus;
};

export type DemoCommerceAction = BuyerCommerceAction | BrandCommerceAction;

export type DemoCommerceSuccess = {
  ok: true;
  message: string;
  createdOrders?: BuyerOrder[];
};

export type DemoCommerceError = {
  ok: false;
  error: string;
  details?: Record<string, unknown>;
};

export type DemoCommerceResult = DemoCommerceSuccess | DemoCommerceError;

export type DemoCommercePostResponse = DemoCommerceGetResponse & {
  message?: string;
  createdOrders?: BuyerOrder[];
};

export type AuthorizedCommerceRole = Exclude<AuthRole, "guest">;
