import React, { useState, useEffect } from 'react';
import MessCard from '../../components/MessCard';

const MessMenu = () => {
  const [mealData, setMealData] = useState([]);
  const mealDay = ["Breakfast", "Lunch", "Snacks", "Dinner"];

  useEffect(() => {
    const fetchMess = async () => {
      try {
        const fetchdata = await fetch('/api/data/getmenu');
        const res = await fetchdata.json();
        console.log(res);
        setMealData(res);
      } catch (err) {
        console.log('Error while fetching menu', err);
      }
    };

    fetchMess();
  }, []);

  if (!mealData.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className='h-full'>
      <div>
        <h1 className='flex items-center justify-center text-3xl text-gray-900 font-bold pt-4 pb-4'>Mess Menu</h1>
      </div>
      <div className='overflow-x-auto'>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th className='p-2 text-gray-800 text-left'>Day</th>
              {mealDay.map((meal, index) => (
                <th key={index} className='p-2 text-left text-gray-700'>{meal}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealData.map((dayMeals, dayIndex) => (
              <tr key={dayIndex} className={`${dayIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <td className='p-2 text-gray-700'>{dayMeals.day}</td>
                <td className='p-2 text-center'><MessCard presentMeal={dayMeals.breakfast} /></td>
                <td className='p-2 text-center'><MessCard presentMeal={dayMeals.lunch} /></td>
                <td className='p-2 text-center'><MessCard presentMeal={dayMeals.snacks} /></td>
                <td className='p-2 text-center'><MessCard presentMeal={dayMeals.dinner} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessMenu;
