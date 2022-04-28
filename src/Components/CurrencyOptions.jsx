import React from 'react'

export default function CurrencyOptions({id}) {
  return (
    <select className='flex-[0.3] p-4 bg-[rgb(50,54,82)] text-white' name={id}>
        <option value="NGN">NGN</option>
        <option value="NGN">USD</option>
        <option value="NGN">CAD</option>
    </select>
  )
}
