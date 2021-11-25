import { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    
    sumAmount[product.id] = product.amount

    return sumAmount
   }, {} as CartItemsAmount)

  useEffect(() => {
     api.get('products').then((res) => {
      setProducts(res.data)
     })

  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  function StoreItem(props : ProductFormatted) {
    return (
      <li>
            <img src={props.image} alt={props.title} />
            <strong>{props.title}</strong>
            <span>{formatPrice(props.price)}</span>
            <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(props.id)}
        >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {cartItemsAmount[props.id] || 0}
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>
    )
  }

  return (
    <ProductList>

      {products.map((item) => {
        return <StoreItem priceFormatted={item.priceFormatted} id={item.id} title={item.title} price={item.price} image={item.image} />
      })}
      
    </ProductList>
  );
};

export default Home;
