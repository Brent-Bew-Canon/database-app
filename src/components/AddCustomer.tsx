import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import dayjs from "dayjs";
import { apiBaseUrl } from "../utils/API";
import Auth from "../utils/auth";

function AddCustomer({ onDataUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    signDate: "",
    tier: "",
    nextServiceDate: "",
    lastServiceDate: "",
    address: "",
    phone: "",
    email: "",
  });

  const createNewCustomerAPI = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.getToken(),
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          tier: formData.tier,
          address: formData.address,
          signDate: formData.signDate,
          nextServiceDate: formData.nextServiceDate,
          lastServiceDate: formData.lastServiceDate,
          phone: formData.phone,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create new customer"); // Throw error for non-200 responses
      }

      // Assuming server response is JSON
      const reply = await response.json();
      console.log(reply);
      console.log("Create New Customer Request:", formData);
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        signDate: "",
        tier: "",
        nextServiceDate: "",
        lastServiceDate: "",
        address: "",
        phone: "",
        email: "",
      });
      const message = await reply.message;
      if (message === "Customer created successfully") {
        onDataUpdate();
        console.log("Should render all data");
      }
    } catch (error) {
      console.error("API error creating new customer:", error);
      throw error; // Re-throw the original error
    }
  };

  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    if (formData.tier === undefined || formData.tier === "") {
      alert("Please select a membership tier");
      return;
    }
    createNewCustomerAPI();
    hideModal();
  }

  // Function to handle input changes
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Auto-populate Next Service Date if Sign Date is changed
    if (name === "signDate") {
      const sixMonthsLater = dayjs(value).add(6, "month").format("YYYY-MM-DD");
      setFormData((prevState) => ({
        ...prevState,
        nextServiceDate: sixMonthsLater,
      }));
      setFormData((prevState) => ({
        ...prevState,
        lastServiceDate: value,
      }));
    }
  }

  // Modal functions
  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="row mt-4">
      <div className="col text-center  ">
        <button className="btn btn-primary" onClick={showModal}>
          Add New Customer
        </button>
      </div>

      {/* modal */}
      <Modal show={isOpen} onHide={hideModal}>
        <div className="mx-auto my-5">
          <p className="text-center fs-5">New Customer</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                *First Name:
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-control"
                id="firstName"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                *Last Name:
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-control"
                id="lastName"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tier" className="form-label">
                *Tier:
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="tier"
                value={formData.tier}
                onChange={handleInputChange}
                id="tier"
                required
              >
                <option value="">Select Tier</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                *Address:
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-control"
                id="address"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="signDate" className="form-label">
                Sign Date:
              </label>
              <input
                type="date"
                name="signDate"
                value={formData.signDate}
                onChange={handleInputChange}
                className="form-control"
                id="signDate"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nextServiceDate" className="form-label">
                Next Service Date:
              </label>
              <input
                type="date"
                name="nextServiceDate"
                value={formData.nextServiceDate}
                onChange={handleInputChange}
                className="form-control"
                id="nextServiceDate"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastServiceDate" className="form-label">
                Last Service Date:
              </label>
              <input
                type="date"
                name="lastServiceDate"
                value={formData.lastServiceDate}
                onChange={handleInputChange}
                className="form-control"
                id="lastServiceDate"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone:
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-control"
                id="phone"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                id="email"
              />
            </div>

            {/* <input
              type="text"
              className="form-control"
              placeholder="new sheet name..."
              onChange={(e) => {
                setSheetName(e.target.value);
              }}
            /> */}
            <div className="text-center my-3">
              <button className="btn btn-success" type="submit">
                Create Customer
              </button>
            </div>
            <div className="text-center my-3">
              <button
                className="btn btn-danger"
                type="button"
                onClick={hideModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default AddCustomer;
