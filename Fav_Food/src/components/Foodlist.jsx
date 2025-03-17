import React,{ useEffect, useState } from "react"
import './Foodlist.css'
import { db } from "../config/Firebase"
import { getDocs,addDoc,updateDoc,deleteDoc,collection,doc } from "firebase/firestore"
function Foodlist() {
    const[data,setData]=useState([]);
    const [currFood,setCurrFood]=useState({});
    const foodcollection=collection(db,"Foods")

    const getData=async()=>{
      try{
       const dt=await getDocs(foodcollection);
       const filteredData=dt.docs.map((doc)=>({
       ...doc.data(),
        id:doc.id
      }))
      console.log(filteredData);
      setData(filteredData);
    
      }
      catch(err){
        console.log(err);
      }
     
        
    }
    
    useEffect(()=>{
      getData(); 
    },[])

    const addHandler=async()=>{
      const temp=String(currFood.title);
        await addDoc(foodcollection,{title:temp.charAt(0).toUpperCase()+temp.slice(1).toLowerCase()});
        getData();
        setCurrFood({title:""})
    }
    const updateHandler=async()=>{
      const temp=String(currFood.title);
      const foodDoc=doc(db,"Foods",currFood.id);
        await updateDoc(foodDoc,{title:temp.charAt(0).toUpperCase()+temp.slice(1).toLowerCase()})
        getData();
        setCurrFood({title:""})
    }
    const deleteHandler=async(id)=>{
      const isconfirm=window.confirm('Are you want to delete this food');
      if(!isconfirm)
        return;
      const foodDoc=doc(db,"Foods",id);
        await deleteDoc(foodDoc)
        getData();
    }
  return (
    <div className="outercontainer">
      <div className="heading">
        <h1>Simple TODO List</h1>
      </div>
      <div className="container">
          <input type="text" placeholder="Add a food" style={{textAlign:"center"}} value={currFood.title} onChange={(e)=>setCurrFood({...currFood,title:e.target.value})}/>
          <button onClick={currFood.id?updateHandler:addHandler} className="addbutton">{currFood.id?"Update":"Add"}</button>
        
            {data.map((dt)=>
            <div className="box" key={dt.id}>
            <h2>{dt.title}</h2>
            <button onClick={()=>setCurrFood(dt)} className="update">update</button>
            <button onClick={()=>deleteHandler(dt.id)} className="delete">delete</button>
            </div> )}  
      </div>
    </div>
  )
}

export default Foodlist
