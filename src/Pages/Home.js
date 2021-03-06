import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../Components/Loader';
// import CurrencyOptions from '../Components/CurrencyOptions'

export default function Home() {
  
  const [data, setData] = useState({
    error:false,
    loading:false
  });

  // const [currencyList, setCurrencyList] = useState([['STN','São Tomé and Príncipe dobra'],['XAG','Silver (troy ounce)'],['NGN','Nigerian naira'],['USD','United States dollar']])
  const [currencyList, setCurrencyList] = useState([])
  const [currentRate, setCurrentRate ] = useState({
    baseCode:'NGN',
    baseName:'Nigerian naira',
    targetCode:'USD',
    targetName:'United States dollar',
    rate:'0.0024',
    amt:1,
    rate_for_amt:1*0.0024
  });


  const fetchCurrencies = async () => {
      const res = await axios.get('https://api.getgeoapi.com/v2/currency/list?api_key=f17a2910c0dc34239638ab8e32a478db6d9a1a4b&format=json')
      const data = res.data;
      setCurrencyList(Object.entries(data.currencies).sort());
  }

  const fetchRates = async (from,to) => {
    setData({
      error:false,
      loading:true
    });
    const res = await axios.get(`https://api.getgeoapi.com/v2/currency/historical/2022-04-27?api_key=f17a2910c0dc34239638ab8e32a478db6d9a1a4b&from=${from}&to=${to}`)
    const data = res.data
    const rate = Object.values(data.rates)[0].rate
    setCurrentRate((prevValue) => {
        return {
          baseCode:data.base_currency_code,
          baseName:data.base_currency_name,
          targetCode:Object.keys(data.rates)[0],
          targetName:Object.values(data.rates)[0].currency_name,
          rate:Number(rate),
          amt:prevValue.amt,
          rate_for_amt:prevValue.amt*Number(rate)
        }
    });
    setData({
      error:false,
      loading:false
    });
  }

  const handleBaseInputChange = (e) => {
      setCurrentRate((prevValue) => {
          return{
            baseCode:prevValue.baseCode,
            baseName:prevValue.baseName,
            targetCode:prevValue.targetCode,
            targetName:prevValue.targetName,
            rate:prevValue.rate,
            amt:e.target.value,
            rate_for_amt: (Number(e.target.value) * Number(prevValue.rate)).toFixed(4)
          }
      })
  }

  const handleTargetInputChange = (e) => {
    setCurrentRate((prevValue) => {
      return{
        baseCode:prevValue.baseCode,
        baseName:prevValue.baseName,
        targetCode:prevValue.targetCode,
        targetName:prevValue.targetName,
        rate:prevValue.rate,
        amt:(Number(e.target.value)/Number(prevValue.rate)).toFixed(2),
        rate_for_amt:Number(e.target.value)
      }
    })
  }

  

  const handleBaseCurrencyChange = (e) => {
    fetchRates((e.target.value).split('-')[0],currentRate.targetCode);
  }
  const handleTargetCurrencyChange = (e) => {
    fetchRates(currentRate.baseCode, (e.target.value).split('-')[0])
  }


  useEffect(() => {
    if(currencyList.length === 0){
      console.log('fetching');
      fetchCurrencies();
      fetchRates('NGN','USD');
    }
  })

  return (
    <div className='w-full h-screen relative flex flex-col items-center justify-center'>
        <div className="absolute top-0 left-0 w-full h-[50%] bg-[rgb(9,36,76)] border-b-[2px] border-[rgb(114,253,255)]"></div>
        <header className="mb-5 z-20 text-white glow md:leading-[3rem] text-center" style={{fontSize:'calc(0.7rem + 1.5vw)',width:'min(90%, 800px)'}}>
            <h1><span className='text-[rgb(119,246,229)]'>{currentRate.amt.toLocaleString('ja-JP',{ style: 'currency', currency: `${currentRate.baseCode}`})} </span>{`${currentRate.baseName} to ${currentRate.targetName}.`}</h1>
            <h2>Convert {`${currentRate.baseCode}`} to {currentRate.targetCode} at the real exchange rate</h2>
        </header>


        <div className="w-fit h-fit afterglowcont">
          <div className="relative w-fit min-w-[330px] flex items-center z-50 justify-center shadow-xl p-2 lg:p-5 rounded-md min-h-[350px] duration-700 afterglow" style={{backgroundColor:data.loading ? 'rgb(245,245,245)' : 'white'}}>
              <Loader show={data.loading ? true : false}/>
              <form className='p-2 flex-col items-center w-fit' style={{display: data.loading ? 'none' : 'flex'}}>

                  <section className='w-full h-fit mb-10 z-30'>
                      <p className='text-[0.8rem] text-gray-400 mb-1 p-animate'>Amount</p>
                      <div className="flex w-full items-center">
                          <input type="text" name='base_currency_value' className='flex-1 h-[7vh] min-h-[55px] border-b-[1px] border-[rgb(187,187,187)] p-2' value={currentRate.amt} onChange={handleBaseInputChange} autoComplete='off'/>
                          <select className='p-4 bg-[rgb(50,54,82)] max-w-[100px] text-white' name='base_currency' value={`${currentRate.baseCode}-${currentRate.baseName}`} onChange={handleBaseCurrencyChange}>
                              {currencyList.map((currency, index) => {
                                  return <option key={index} value={`${currency[0]}-${currency[1]}`}>{`${currency[0]} - ${currency[1]}`}</option>
                              })}
                          </select>
                      </div>
                  </section>

                  <section className='w-full h-fit z-30'>
                      <p className='text-[0.8rem] text-gray-400 mb-1'>Converted To</p>
                      <div className="flex w-full items-center">
                          <input type="text" name='target_currency_value' className='flex-1 h-[7vh] min-h-[55px] border-b-[1px] border-[rgb(145,145,145)] p-2' value={(currentRate.rate_for_amt)} onChange={handleTargetInputChange} autoComplete='off'/>
                          <select className='p-4 bg-[rgb(50,54,82)] max-w-[100px] text-white' value={`${currentRate.targetCode}-${currentRate.targetName}`} name='target_currency' onChange={handleTargetCurrencyChange}>
                              {currencyList.map((currency, index) => {
                                  return <option key={index} value={`${currency[0]}-${currency[1]}`}>{`${currency[0]} - ${currency[1]}`}</option>
                              })}
                          </select>
                      </div>
                  </section>
                  <h1 className='mt-4 font-semibold' style={{fontSize:'calc(0.9rem + 1vw)'}}>1.00000 {currentRate.baseCode} = <span className='text-cyan-500'>{`${currentRate.rate} ${currentRate.targetCode}`}</span>{currentRate.target}</h1>
                  <p className='' style={{fontSize:'calc(0.6rem + 0.7vw)'}}>updated</p>

              </form>
          </div>
        </div>
    </div>
  )
}
