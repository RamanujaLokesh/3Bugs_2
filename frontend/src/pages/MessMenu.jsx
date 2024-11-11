import React, { useState, useEffect } from "react";
import MessCard from "../components/MessCard";
import SelectHostel from "../components/SelectHostel"; // Import SelectHostel component
import { useAuthContext } from "../context/AuthContext"; // Import AuthContext to access user info

const MessMenu = () => {
  const { authUser } = useAuthContext(); // Access authUser context
  const [mealData, setMealData] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(authUser.hostel);
  
  const mealDay = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  useEffect(() => {
    if(selectedHostel!=='All'){

      const fetchMess = async () => {
        try {
          const fetchdata = await fetch( `/api/data/getmenu?hostel=${selectedHostel}`);
          const res = await fetchdata.json();
          console.log(res);
          setMealData(res);
        } catch (err) {
          console.log("Error while fetching menu", err);
        }
      };
      
      fetchMess();
    }
  }, [selectedHostel]); // Fetch new data when the selected hostel changes

  // Function to handle hostel selection
  const handleHostelChange = (hostel) => {
    setSelectedHostel(hostel);
  };

  if (!mealData.length || selectedHostel ==='All') {
    return (
      <div className="flex justify-center items-center h-screen">
           <div>
        <h1 className="flex items-center justify-center text-3xl text-gray-900 font-bold pt-4 pb-4">
          Mess Menu
        </h1>
      </div>
      <SelectHostel onSelectHostel={handleHostelChange} />
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div>
        <h1 className="flex items-center justify-center text-3xl text-gray-900 font-bold pt-4 pb-4">
          Mess Menu
        </h1>
      </div>

      {authUser.auth_level === 3 && (
         <SelectHostel onSelectHostel={handleHostelChange} />// Render the SelectHostel dropdown if auth_level is 3
      )}

      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="p-2 text-gray-800 text-left">Day</th>
              {mealDay.map((meal, index) => (
                <th key={index} className="p-2 text-left text-gray-700">
                  {meal}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealData.map((dayMeals, dayIndex) => (
              <tr
                key={dayIndex}
                className={`${dayIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-2 text-gray-700">{dayMeals.day}</td>
                <td className="p-2 text-center">
                  <MessCard presentMeal={dayMeals.breakfast} />
                </td>
                <td className="p-2 text-center">
                  <MessCard presentMeal={dayMeals.lunch} />
                </td>
                <td className="p-2 text-center">
                  <MessCard presentMeal={dayMeals.snacks} />
                </td>
                <td className="p-2 text-center">
                  <MessCard presentMeal={dayMeals.dinner} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessMenu;
