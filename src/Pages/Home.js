import React, { useEffect, useState } from 'react'
import axios from 'axios'
// import CurrencyOptions from '../Components/CurrencyOptions'

export default function Home() {
  const [fetchedData, setFetchedData] = useState(false);
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
    
    if(!currencyList.length > 0){
      const res = await axios.get('https://api.getgeoapi.com/v2/currency/list?api_key=f17a2910c0dc34239638ab8e32a478db6d9a1a4b&format=json')
      const data = res.data
      setCurrencyList(Object.entries(data.currencies).sort());
    }
  }

  const fetchRates = async (from,to) => {
    const res = await axios.get(`https://api.getgeoapi.com/v2/currency/historical/2022-04-27?api_key=f17a2910c0dc34239638ab8e32a478db6d9a1a4b&from=${from}&to=${to}`)
    const data = res.data
    const rate = Object.values(data.rates)[0].rate
    setCurrentRate({
      baseCode:data.base_currency_code,
      baseName:data.base_currency_name,
      targetCode:Object.keys(data.rates)[0],
      targetName:Object.values(data.rates)[0].currency_name,
      rate:Number(rate),
      amt:1,
      rate_for_amt:1*Number(rate)
    })
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
      console.log(fetchedData)
  })

  if(!fetchedData){
    console.log('fetching');
    fetchCurrencies();
    fetchRates('NGN','USD');
    setFetchedData(true)
  }

  return (
    <div className='w-full h-screen relative flex flex-col items-center justify-center'>
        <div className="absolute top-0 left-0 w-full h-[50%] bg-[rgb(27,70,135)] z-[-1]"></div>
        <header className="mb-5 text-white font-bold leading-[3rem]" style={{fontSize:'calc(0.7rem + 1.5vw)',width:'min(90%, 800px)'}}>
            <h1>{`${currentRate.amt.toLocaleString('ja-JP',{ style: 'currency', currency: `${currentRate.baseCode}`})} ${currentRate.baseName} to ${currentRate.targetName}.`}</h1>
            <h2>Convert {`${currentRate.baseCode}`} to {currentRate.targetCode} at the real exchange rate</h2>
        </header>


        <div className="bg-[rgb(255,255,255)] shadow-xl p-5 rounded-md" style={{width:'min(90%, 1000px)'}}>
            <form action="" className='flex flex-col items-center'>

                <section className='w-full h-fit mb-10'>
                    <p className='text-[0.8rem] text-gray-400 mb-1'>Amount</p>
                    <div className="flex w-full items-center">
                        <input type="text" name='base_currency_value' className='flex-[0.8] h-[7vh] min-h-[55px] border-[1px] border-[rgb(187,187,187)] p-2' value={currentRate.amt} onChange={handleBaseInputChange}/>
                        <select className='flex-[0.3] p-4 bg-[rgb(50,54,82)] max-w-[100px] text-white' name='base_currency' value={`${currentRate.baseCode}-${currentRate.baseName}`} onChange={handleBaseCurrencyChange}>
                            {currencyList.map((currency, index) => {
                                return <option key={index} value={`${currency[0]}-${currency[1]}`}>{`${currency[0]} - ${currency[1]}`}</option>
                            })}
                        </select>
                    </div>
                </section>

                <section className='w-full h-fit'>
                    <p className='text-[0.8rem] text-gray-400 mb-1'>Converted To</p>
                    <div className="flex w-full items-center">
                        <input type="text" name='target_currency_value' className='flex-[0.8] h-[7vh] min-h-[55px] border-[1px] border-[rgb(187,187,187)] p-2' value={(currentRate.rate_for_amt)} onChange={handleTargetInputChange}/>
                        <select className='flex-[0.3] p-4 bg-[rgb(50,54,82)] max-w-[100px] text-white' value={`${currentRate.targetCode}-${currentRate.targetName}`} name='target_currency' onChange={handleTargetCurrencyChange}>
                            {currencyList.map((currency, index) => {
                                return <option key={index} value={`${currency[0]}-${currency[1]}`}>{`${currency[0]} - ${currency[1]}`}</option>
                            })}
                        </select>
                    </div>
                </section>
                <h1 className='mt-4 font-semibold' style={{fontSize:'calc(0.9rem + 1vw)'}}>1.00000 {currentRate.baseCode} = <span className='text-green-600'>{`${currentRate.rate} ${currentRate.targetCode}`}</span>{currentRate.target}</h1>
                <p className='' style={{fontSize:'calc(0.6rem + 0.7vw)'}}>Mid-market exchange rate at 19:29 UTC</p>

            </form>
        </div>
    </div>
  )
}
