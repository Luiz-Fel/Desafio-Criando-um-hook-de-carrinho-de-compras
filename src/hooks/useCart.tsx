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

      const updatedCart = [...cart];
      const productExists = updatedCart.find(product => product.id === productId);

      const stock = await api.get(`/stock/${productId}`)

      const stockAmount = stock.data.amount;
      const currentAmount = productExists ? productExists.amount : 0;
      const amount = currentAmount + 1;

      if (amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return
      } 

      if (productExists) {
        productExists.amount = amount
      } else {
        const product = await api.get(`/products/${productId}`)

        const newProduct = {
          ...product.data,
          amount : 1
        }
        updatedCart.push(newProduct)
      }
      setCart(updatedCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))

    } catch {

      toast.error('Erro na adição do produto.');

    }
  };

  const removeProduct = (productId: number) => {
    try {
      
      const updatedCart = cart.filter((product) => {

        return !(product.id === productId)
      })

      setCart(updatedCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));

    } catch {

      toast.error('Erro na remoção do produto.');

    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {

      if (amount <= 0) {
        return
      }
      
      const stock = await api.get(`/stock/${productId}`)
      
      const stockAmount = stock.data.amount;
      
      if (amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return
      }
      const updatedCart = [...cart];
      const product =  updatedCart.find(product => product.id === productId);

      if (product) {

        product.amount = amount;
        setCart(updatedCart);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
      }

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
