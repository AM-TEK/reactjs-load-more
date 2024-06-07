"use client"

import React, { useEffect, useRef, useState } from 'react'

export default function LoadMore() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [disableBtn, setDisableBtn] = useState(false);
  const isMounted = useRef(false)

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/products?limit=20&skip=${count * 20}`);
      const result = await response.json();
      console.log(result);
      if (result.products.length > 0) {
        setProducts(prevProducts => [...prevProducts, ...result.products]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isMounted.current) {
      fetchProducts();
    } else {
      isMounted.current = true;
    }
  }, [count]);

  useEffect(() => {
    if (products.length === 100) {
      setDisableBtn(true)
    }
  }, [products])

  return (
    <div className="container p-4 mx-auto">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {
          products.length > 0 ? products.map((productItem, index) => (
            <div key={`${productItem.id}-${index}`}
            className="p-4 bg-white rounded-lg shadow-md">
              <img src={productItem.thumbnail} alt={productItem.title} className="object-cover w-full h-48 rounded-t-lg" />
              <p className="mt-2 font-semibold text-center">{productItem.title}</p>
            </div>
          )) : <p className="col-span-4 text-center">No products available</p>
        }
      </div>
      {loading && <div className="my-4 text-center">Loading data, please wait.</div>}
      <div className="mt-4 text-center">
        <button
          onClick={() => setCount(prevCount => prevCount + 1)}
          className="px-4 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-700"
          disabled={disableBtn}
        >
          {loading ? 'Loading...' : 'Load more products'}
        </button>
        {disableBtn && <p className="mt-2 text-red-500">The limit of products has been reached.</p>}
      </div>
    </div>
  );
}
