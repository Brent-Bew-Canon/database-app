import Auth from "../utils/auth.ts";
import { Link, Navigate, json, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dummy from '../json/dummy.json';
import ProcessUsers from '../components/ProcessUsers';
import AddCustomer from '../components/AddCustomer';
// import image from public 
import logo from '../../public/logo.png';


function Home() {

    useEffect(() => {
        fetchCustomers();
    }, []);

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const fetchCustomers = async () => {
        const token = Auth.getToken();
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await fetch("/api/customer", {
                method: "GET",
                headers: headers
            });

            const data = await response.json();
            if (data.length > 0) {
                setUsers(data);
            }
            console.log("fresh data pulled");
        } catch (error) {
            console.log(error);
        }
    };


    return (

        <div className='container mt-2'>
            <div className="row">
                <div className="col text-center">
                    <img src={logo} alt="" className="w-25 py-4" />
                    <h1>Members Database</h1>
                </div>
                <AddCustomer onDataUpdate={fetchCustomers} />
            </div>
            <ProcessUsers users={users} onDataUpdate={fetchCustomers} />
        </div>
    )

}

export default Home