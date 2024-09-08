import { useEffect, useState } from "react";
import axios from 'axios';

const Data = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [push, setPush] = useState(false);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://data-ffc59-default-rtdb.firebaseio.com/register.json');
        const result = response.data;

        // Check if result is an object and not null or undefined
        if (result && typeof result === 'object') {
          setData(Object.entries(result));
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
      }
    };

    fetchData();
  }, [push]);

  const addData = async () => {
    try {
      if(name!==''&&age!=='')
      {
      const res = await axios.post('https://data-ffc59-default-rtdb.firebaseio.com/register.json', { name, age });
      console.log('Add response:', res);
      setPush(!push);
      setAge('')
      setName('')
      }
      else{
        alert("name and age should not empty")
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  
  
  };

  const deleteData = async (id) => {
    try {
      const del = await axios.delete(`https://data-ffc59-default-rtdb.firebaseio.com/register/${id}.json`);
      console.log('Delete response:', del);
      setPush(!push);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const updateData = async (id, updatedName, updatedAge) => {
    
    try {
      const res = await axios.patch(`https://data-ffc59-default-rtdb.firebaseio.com/register/${id}.json`, { name: updatedName, age: updatedAge });
      console.log('Update response:', res);
      setPush(!push);
      setEdit(null); // Exit edit mode after update
      console.log(edit)
    } catch (error) {
      console.error('Error updating data:', error);
    }
    setName('')
    setAge('')
  };

  return (
    <div className="p-2" >
      <div className="flex justify-center items-center flex-col">
        <div className="items-center text-center">
        <label id="name">Name:</label>
        <input type="text" className="border-2 border-black rounded-md"value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <label id="name">Age:</label>
        <input type="text" value={age}className="border-2 border-black rounded-md mt-2 mb-2" onChange={(e) => setAge(e.target.value)} />
        <br/>
       <button onClick={addData} className={`${edit===null?"bg-blue-500 rounded-md p-2":"bg-sky-500 cursor-not-allowed opacity-50 rounded-md p-2"}`} disabled={edit===null?false:true}>Submit</button>
       </div>
      <table  className='border-collapse border border-slate-500  lg:w-full md:w-fit'>
      <caption className="caption-top">
    Table of users
  </caption>
        <thead>
          <tr>
            <th className="border border-slate-400" >Name</th>
            <th className="border border-slate-400">Age</th>
            <th className="border border-slate-400">ID</th>
            <th className="border border-slate-400">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length !== 0 ? data.map((d, i) =>
            <tr key={d[0]} style={edit === d[0] ? { color: "red" } : {}}>
              <td className="border border-slate-400">{d[1].name}</td>
              <td className="border border-slate-400">{d[1].age}</td>
              <td className="border border-slate-400">{d[0]}</td>
              <td className="border border-slate-400">
                <button onClick={() => deleteData(d[0])} className="bg-red-500 rounded-md p-2">Delete</button>
                <button className="bg-blue-500 rounded-md p-2"
                  onClick={() => {
                    if (edit === d[0]) {
                      updateData(d[0], name, age); // Call updateData with current name and age
                    } else {
                      setEdit(d[0]); // Enter edit mode
                      console.log(edit);
                      setName(d[1].name);
                      setAge(d[1].age);
                    }
                  }}
                >
                  {edit === d[0] ? "Save" : "Update"}
                </button>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="4">{data.length === 0 ? "No data available" : "Loading"}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Data;
