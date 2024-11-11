import React, { useState, useEffect } from "react";
import MessCard from "../components/MessCard";
import SelectHostel from "../components/SelectHostel";
import { useAuthContext } from "../context/AuthContext";

const MessMenu = () => {
  const { authUser } = useAuthContext();
  const [mealData, setMealData] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(authUser.hostel);
  const mealDay = ["Breakfast", "Lunch", "Snacks", "Dinner"];

  useEffect(() => {
    if (selectedHostel !== "All") {
      const fetchMess = async () => {
        try {
          const response = await fetch(`/api/data/getmenu?hostel=${selectedHostel}`);
          const data = await response.json();
          setMealData(data);
        } catch (err) {
          console.error("Error while fetching menu", err);
        }
      };

      fetchMess();
    }
  }, [selectedHostel]);

  const handleHostelChange = (hostel) => {
    setSelectedHostel(hostel);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className=" text-black py-4">
        <h1 className="text-3xl font-bold text-center">Mess Menu</h1>
      </div>

      {/* Select Hostel Dropdown */}
      {authUser.auth_level === 3 && (
        <div className="my-4">
          <SelectHostel onSelectHostel={handleHostelChange} />
        </div>
      )}

      {/* Mess Menu Table */}
      <div className="container mx-auto p-4">
        {(!mealData.length || selectedHostel === "All") ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-lg font-semibold text-gray-700">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="p-4 text-left font-medium text-gray-800">Day</th>
                  {mealDay.map((meal, index) => (
                    <th key={index} className="p-4 text-left font-medium text-gray-800">
                      {meal}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mealData.map((dayMeals, dayIndex) => (
                  <tr key={dayIndex} className={`${dayIndex % 2 === 0 ? "bg-slate-200" : "bg-white"}`}>
                    <td className="p-4 font-medium text-gray-700">{dayMeals.day}</td>
                    <td className="p-4 text-center">
                      <MessCard presentMeal={dayMeals.breakfast} />
                    </td>
                    <td className="p-4 text-center">
                      <MessCard presentMeal={dayMeals.lunch} />
                    </td>
                    <td className="p-4 text-center">
                      <MessCard presentMeal={dayMeals.snacks} />
                    </td>
                    <td className="p-4 text-center">
                      <MessCard presentMeal={dayMeals.dinner} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessMenu;
