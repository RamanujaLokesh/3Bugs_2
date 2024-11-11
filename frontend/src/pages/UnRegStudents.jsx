import React, { useEffect, useState } from 'react';
import useUnRegStudents from '../hooks/useUnRegStudents';
import { useAuthContext } from '../context/AuthContext';
import UnregCard from '../components/UnregCard';
import SelectHostel from '../components/SelectHostel';

const UnRegStudents = () => {
  const { authUser } = useAuthContext();
  const { loading, unRegStudents } = useUnRegStudents();
  const [data, setData] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(authUser.hostel);
  const [nb, setNb] = useState(0);
  const [nl, setNl] = useState(0);
  const [ns, setNs] = useState(0);
  const [nd, setNd] = useState(0);

  const fetchData = async (hostel) => {
    const students = await unRegStudents(hostel);
    console.log(students); // Log data directly after fetching
    setData(students);

    let breakfastCount = 0;
    let lunchCount = 0;
    let snacksCount = 0;
    let dinnerCount = 0;
if(!students.error){
  students?.forEach(student => {
    if (student.breakfast === false) breakfastCount++;
    if (student.lunch === false) lunchCount++;
    if (student.snacks === false) snacksCount++;
    if (student.dinner === false) dinnerCount++;
  });
}

    setNb(breakfastCount);
    setNl(lunchCount);
    setNs(snacksCount);
    setNd(dinnerCount);
  };

  useEffect(() => {
    if (authUser.auth_level < 3) {
      fetchData(authUser.hostel);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser.auth_level === 3 && selectedHostel) {
      fetchData(selectedHostel);
    }
  }, [selectedHostel, authUser.auth_level]);  // Make sure to update counts when selectedHostel changes

  const handleHostelChange = (hostel) => {
    setSelectedHostel(hostel);
  };

  return (
    <div>
      {authUser.auth_level === 3 && (
        <SelectHostel onSelectHostel={handleHostelChange} />
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>
            <span>b: {nb}</span> <span>l: {nl}</span> <span>s: {ns}</span> <span>d: {nd}</span>
          </div>
          {data.length > 0 ? (
            <div>
              {data.map((student, index) => (
                <UnregCard key={index} student={student} />
              ))}
            </div>
          ) : (
            <div>No data found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnRegStudents;
