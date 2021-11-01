import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBasket } from 'react-icons/md';

import logo from '../../assets/images/logo.svg';
import { Container, Cart } from './styles';
import { useCart } from '../../hooks/useCart';
import { access } from 'fs';


const Header = (): JSX.Element => {
  const { cart } = useCart();
  
  function sizeFunction() {
    const [idArray, setIdArray] = useState<Number[]>([])
    const [counter, setCounter] = useState<number>(0)
    cart.forEach((item) => {
      if (idArray.includes(item.id)) {
        setIdArray([...idArray, item.id])
        setCounter(counter + 1)
      } 
    })


    return counter
  }

  const cartSize = sizeFunction()
  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
          <span data-testid="cart-size">
            { cartSize === 1 ? `${cartSize} item` : `${cartSize} itens`}
          </span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
};

export default Header;
