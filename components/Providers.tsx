"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  addToCart,
  addToWishlist,
  clearCart as clearCartApi,
  errorMessage,
  getCart,
  getProduct,
  getWishlist,
  removeCartItem,
  removeFromWishlist,
  TOKEN_KEY,
  updateCartItem,
} from "@/lib/api";
import type { Cart, Product, User } from "@/lib/types";

const GUEST_KEY = "freshcart_guest_cart";
interface GuestItem {
  product: Product;
  count: number;
}
const pidOf = (p: Product) => p._id ?? p.id ?? "";

/* ---------------- Auth ---------------- */
interface AuthCtx {
  token: string | null;
  user: User | null;
  ready: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

function decodeToken(token: string): User | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    const data = JSON.parse(json) as { id: string; name: string; role?: string };
    return { id: data.id, name: data.name, role: data.role };
  } catch {
    return null;
  }
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside Providers");
  return ctx;
};

/* ---------------- Cart ---------------- */
interface CartCtx {
  cart: Cart | null;
  count: number;
  loading: boolean;
  refresh: () => Promise<void>;
  add: (productId: string) => Promise<void>;
  update: (productId: string, count: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartCtx | null>(null);
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside Providers");
  return ctx;
};

/* ---------------- Wishlist ---------------- */
interface WishCtx {
  items: Product[];
  ids: Set<string>;
  loading: boolean;
  refresh: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  remove: (productId: string) => Promise<void>;
}

const WishContext = createContext<WishCtx | null>(null);
export const useWishlist = () => {
  const ctx = useContext(WishContext);
  if (!ctx) throw new Error("useWishlist must be used inside Providers");
  return ctx;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [guest, setGuest] = useState<GuestItem[]>([]);
  const [guestLoaded, setGuestLoaded] = useState(false);

  /* guest cart persists in localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(GUEST_KEY);
      if (raw) setGuest(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setGuestLoaded(true);
  }, []);
  useEffect(() => {
    if (!guestLoaded) return;
    try {
      localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
    } catch {
      /* ignore */
    }
  }, [guest, guestLoaded]);

  const guestCart = useMemo<Cart | null>(() => {
    if (!guest.length) return null;
    return {
      _id: "guest",
      cartOwner: "",
      products: guest.map((g) => ({ _id: pidOf(g.product), count: g.count, price: g.product.price, product: g.product })),
      totalCartPrice: guest.reduce((n, g) => n + g.product.price * g.count, 0),
    };
  }, [guest]);
  const [wish, setWish] = useState<Product[]>([]);
  const [wishLoading, setWishLoading] = useState(false);

  /* restore session */
  useEffect(() => {
    try {
      setToken(localStorage.getItem(TOKEN_KEY));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const user = useMemo(() => (token ? decodeToken(token) : null), [token]);

  const login = useCallback((t: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, t);
    } catch {
      /* ignore */
    }
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    setToken(null);
    setCart(null);
    setWish([]);
  }, []);

  /* ---- cart ---- */
  const refreshCart = useCallback(async () => {
    if (!token) return;
    setCartLoading(true);
    try {
      const res = await getCart();
      setCart(res.data);
    } catch {
      setCart(null); // no cart yet for this user
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  const addCart = useCallback(
    async (productId: string) => {
      if (!token) {
        try {
          const existing = guest.find((g) => pidOf(g.product) === productId);
          if (existing) {
            setGuest((g) => g.map((x) => (pidOf(x.product) === productId ? { ...x, count: x.count + 1 } : x)));
          } else {
            const product = await getProduct(productId);
            setGuest((g) => [...g, { product, count: 1 }]);
          }
          toast.success("Product added to your cart");
        } catch (e) {
          toast.error(errorMessage(e));
        }
        return;
      }
      try {
        await addToCart(productId);
        await refreshCart();
        toast.success("Product added to your cart");
      } catch (e) {
        toast.error(errorMessage(e));
      }
    },
    [token, guest, refreshCart],
  );

  const updateCart = useCallback(
    async (productId: string, count: number) => {
      if (!token) {
        setGuest((g) =>
          count < 1
            ? g.filter((x) => pidOf(x.product) !== productId)
            : g.map((x) => (pidOf(x.product) === productId ? { ...x, count } : x)),
        );
        return;
      }
      try {
        if (count < 1) {
          await removeCartItem(productId);
        } else {
          await updateCartItem(productId, count);
        }
        await refreshCart();
      } catch (e) {
        toast.error(errorMessage(e));
      }
    },
    [token, refreshCart],
  );

  const removeCart = useCallback(
    async (productId: string) => {
      if (!token) {
        setGuest((g) => g.filter((x) => pidOf(x.product) !== productId));
        toast.success("Product removed from your cart");
        return;
      }
      try {
        await removeCartItem(productId);
        await refreshCart();
        toast.success("Product removed from your cart");
      } catch (e) {
        toast.error(errorMessage(e));
      }
    },
    [token, refreshCart],
  );

  const clearCart = useCallback(async () => {
    if (!token) {
      setGuest([]);
      toast.success("Cart cleared");
      return;
    }
    try {
      await clearCartApi();
      setCart(null);
      toast.success("Cart cleared");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }, [token]);

  /* ---- wishlist ---- */
  const refreshWish = useCallback(async () => {
    if (!token) return;
    setWishLoading(true);
    try {
      const res = await getWishlist();
      setWish(res.data);
    } catch {
      setWish([]);
    } finally {
      setWishLoading(false);
    }
  }, [token]);

  const wishIds = useMemo(() => new Set(wish.map((p) => p._id ?? p.id ?? "")), [wish]);

  const toggleWish = useCallback(
    async (productId: string) => {
      if (!token) {
        toast.error("Please login first");
        return;
      }
      try {
        if (wishIds.has(productId)) {
          await removeFromWishlist(productId);
          toast.success("Removed from wishlist");
        } else {
          await addToWishlist(productId);
          toast.success("Added to wishlist");
        }
        await refreshWish();
      } catch (e) {
        toast.error(errorMessage(e));
      }
    },
    [token, wishIds, refreshWish],
  );

  const removeWish = useCallback(
    async (productId: string) => {
      try {
        await removeFromWishlist(productId);
        await refreshWish();
        toast.success("Removed from wishlist");
      } catch (e) {
        toast.error(errorMessage(e));
      }
    },
    [refreshWish],
  );

  /* load cart + wishlist whenever the user logs in */
  useEffect(() => {
    if (!token || !guestLoaded) return;
    (async () => {
      if (guest.length) {
        const items = guest;
        setGuest([]);
        try {
          for (const g of items) {
            await addToCart(pidOf(g.product));
            if (g.count > 1) await updateCartItem(pidOf(g.product), g.count);
          }
          toast.success("Your cart items have been saved!");
        } catch (e) {
          toast.error(errorMessage(e));
        }
      }
      refreshCart();
      refreshWish();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, guestLoaded]);

  const authValue = useMemo(
    () => ({ token, user, ready, login, logout }),
    [token, user, ready, login, logout],
  );

  const cartValue = useMemo(
    () => ({
      cart: token ? cart : guestCart,
      count: (token ? cart : guestCart)?.products.reduce((n, p) => n + p.count, 0) ?? 0,
      loading: token ? cartLoading : false,
      refresh: refreshCart,
      add: addCart,
      update: updateCart,
      remove: removeCart,
      clear: clearCart,
    }),
    [token, cart, guestCart, cartLoading, refreshCart, addCart, updateCart, removeCart, clearCart],
  );

  const wishValue = useMemo(
    () => ({
      items: wish,
      ids: wishIds,
      loading: wishLoading,
      refresh: refreshWish,
      toggle: toggleWish,
      remove: removeWish,
    }),
    [wish, wishIds, wishLoading, refreshWish, toggleWish, removeWish],
  );

  return (
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>
        <WishContext.Provider value={wishValue}>
          {children}
          <Toaster position="top-right" />
        </WishContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
