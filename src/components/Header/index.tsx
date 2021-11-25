import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBasket } from 'react-icons/md';

import logo from '../../assets/images/logo.svg';
import { Container, Cart } from './styles';
import { useCart } from '../../hooks/useCart';
import { access } from 'fs';


const Header = (): JSX.Element => {
  const { cart } = useCart();
  const [quantityList, useQuantityList]  = useState<Number[]>([])
  const [quantity, useQuantity] = useState<Number>(0)
  useEffect(() => {
    useitensQuantity()
    useQuantity(quantityList.length)
  })


  function useitensQuantity() {
    cart.forEach((i) => {
      useQuantityList([])
      if (!(quantityList.includes(i.id))) {
        useQuantityList([...quantityList, i.id])
      }
    })
    return quantityList
  }

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
          <span data-testid="cart-size">
            { quantity }
          </span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
};

export default Header;
