import React, { useEffect, useState } from "react";

const data = [
    {
      id: "1",
      name: "Jane",
      lastName: "Doe",
      age: "25"
    },
    {
      id: "2",
      name: "James",
      lastName: "Doe",
      age: "40"
    },
    {
      id: "3",
      name: "Alexa",
      lastName: "Doe",
      age: "27"
    },
    {
      id: "4",
      name: "Jane",
      lastName: "Brown",
      age: "40"
    }
  ];
  
  export default function Fillter() {
    const [peopleInfo, setPeopleInfo] = useState({});
  
    const toggleHandler = (event) => {
        const [value, checked] = event.target 
        if(checked){
            console.log("1" + value);
            setPeopleInfo(pre  => [...pre, value]);
        }else{
            console.log(value);
            setPeopleInfo(pre  => {return [...pre.fillter(skill => skill === value)]});
        }
      
    };
  
    useEffect(() => {
      console.log(peopleInfo);
    }, [peopleInfo]);
  
    return (
      <div className="App">
        <table>
          <tr>
            {data.map((item) => {
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    width: "150px"
                  }}
                >
                  <input
                    onChange={e => toggleHandler(e)}
                    checked={peopleInfo[item.id]}
                    style={{ margin: "20px" }}
                    type="checkbox"
                  />
                  <td style={{ margin: "20px" }}>{item.name}</td>
                  <td style={{ margin: "20px" }}>{item.lastName}</td>
                  <td style={{ margin: "20px" }}>{item.age}</td>
                </div>
              );
            })}
          </tr>
        </table>
      </div>
    );
  }
  