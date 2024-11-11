import React, { useState, useEffect } from "react";
import MessCard from "../components/MessCard";
import SelectHostel from "../components/SelectHostel";
import { useAuthContext } from "../context/AuthContext";
import SelectHostel from "../components/SelectHostel";
import { useAuthContext } from "../context/AuthContext";

const MessMenu = () => {
  const { authUser } = useAuthContext();
  const { authUser } = useAuthContext();
  const [mealData, setMealData] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(authUser.hostel);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editableData, setEditableData] = useState(null);

  const mealDay = ["Breakfast", "Lunch", "Snacks", "Dinner"];


  useEffect(() => {
    if (selectedHostel !== "All") {
    if (selectedHostel !== "All") {
      const fetchMess = async () => {
        try {
          const fetchdata = await fetch(`/api/data/getmenu?hostel=${selectedHostel}`);
          const res = await fetchdata.json();
          console.log(res);
          setMealData(res);
        } catch (err) {
          console.error("Error while fetching menu", err);
        }
      };
      fetchMess();
    }
  }, [selectedHostel]);
  }, [selectedHostel]);

  const handleHostelChange = (hostel) => {
    setSelectedHostel(hostel);
  };

  const handleEdit = (index) => {
    setEditRowIndex(index);
    setEditableData(mealData[index]);
  };

  const handleSave = (index) => {
    const updatedMealData = [...mealData];
    updatedMealData[index] = editableData;
    setMealData(updatedMealData);
    setEditRowIndex(null);

    // Send updated data to the server, including day and hostel
    const updateMenu = async () => {
      try {
        await fetch(`/api/data/updatemenu`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editableData,
            day: mealData[index].day,
            hostel: selectedHostel,
          }),
        });
      } catch (error) {
        console.error("Error updating menu:", error);
      }
    };
    updateMenu();
  };

  const handleChange = (e, mealType) => {
    setEditableData({
      ...editableData,
      [mealType]: e.target.value,
    });
  };

  if (!mealData.length || selectedHostel === "All") {
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
    <div className="min-h-screen">
      {/* Header */}
      <div className=" text-black py-4">
        <h1 className="text-3xl font-bold text-center">Mess Menu</h1>
      </div>

      {/* Select Hostel Dropdown */}
      {authUser.auth_level === 3 && (
        <SelectHostel onSelectHostel={handleHostelChange} />
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
              {authUser.auth_level > 1 && <th className="p-2 text-left text-gray-700">Edit</th>}
            </tr>
          </thead>
          <tbody>
            {mealData.map((dayMeals, dayIndex) => {
              const isEditing = editRowIndex === dayIndex;

              return (
                <tr
                  key={dayIndex}
                  className={`${dayIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  <td className="p-2 text-gray-700">{dayMeals.day}</td>
                  {mealDay.map((meal, index) => (
                    <td key={index} className="p-2 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={editableData[meal.toLowerCase()]}
                          onChange={(e) => handleChange(e, meal.toLowerCase())}
                        />
                      ) : (
                        <MessCard presentMeal={dayMeals[meal.toLowerCase()]} />
                      )}
                    </td>
                  ))}
                  {authUser.auth_level > 1 && (
                    <td className="p-2 text-center">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(dayIndex)}
                          className="text-green-600 hover:text-green-800 font-semibold"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(dayIndex)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessMenu;
