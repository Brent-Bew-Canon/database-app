import Auth from "../utils/auth.ts";
import { Link, Navigate, json, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiBaseUrl } from "../utils/API";
import ProcessUsers from '../components/ProcessUsers';
import AddCustomer from '../components/AddCustomer';
// import image from public 
import logo from '../../public/ackings.svg';


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
            const response = await fetch(`${apiBaseUrl}/api/customer`, {
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
        Auth.loggedIn() === true ? (
            <div className='container mt-2'>
                <div className="row">
                    <div className="col text-center">
                        <img src={logo} alt="AC Kings" className="w-25" />
                        <h1>Members Database</h1>
                    </div>
                    <div className="row mt-4">
                        <div className="col text-center  ">
                            <button className="btn btn-danger" type="button" onClick={() => { Auth.logout() }}>
                                Logout</button>
                        </div>
                    </div>
                    <AddCustomer onDataUpdate={fetchCustomers} />
                </div>
                <ProcessUsers users={users} onDataUpdate={fetchCustomers} />
            </div>
        ) : (
            <div className='text-center mt-5'>
                <p >You are not logged in</p>
                <button>
                    <Link to={"/login"}>Go to login</Link>
                </button>
            </div>
        )
    )

}

export default Home