import axios from 'axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isTemplateTail } from 'typescript';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  
  const [stock, setStock] = useState<Stock[]>([])
  const [products, setProducts] = useState<Product[]>([])

  
  useEffect(() => {
    api.get('/stock')
    .then(response => {
      setStock([...stock, response.data])
    })
    api.get('/products')
    .then(response => {
      setProducts([...products, response.data])
    })
  }, [])
  

  const [cart, setCart] = useState<Product[]>(() => {
     const storagedCart = localStorage.getItem('@RocketShoes:cart')

     if (storagedCart) {
       return JSON.parse(storagedCart);
     }

    return [];
    
  });

  const addProduct = async (productId: number) => {
    try {
      const newProduct = products.find((item) => {
        return item.id === productId;
      }) as Product;
      setCart([...cart, newProduct]);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
    } catch {

      toast.error('Erro na adição do produto.');

    }
  };

  const removeProduct = (productId: number) => {
    try {
      setCart(cart.filter((item) => {
        return item.id === productId;
      }))
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
    } catch {

      toast.error('Erro na remoção do produto.');

    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
     const [temp, setTemp] = useState(-1);

        //TODO
    } catch {

      toast.error('Erro na análise do estoque do produto.');

    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
