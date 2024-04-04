import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Auth from "../utils/auth";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  signDate: Date;
  tier: string;
  nextServiceDate: Date;
  lastServiceDate: Date;
  address: string;
  phone: string;
  email: string;
  notes: string;
  equipment: string;
  lastEmailSent: Date;
  numUnits: number;
}

function ProcessUsers({ users, onDataUpdate }) {
  useEffect(() => {
    setThisUsers(users);
  }, [users]);

  const [thisUsers, setThisUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    signDate: new Date("01/01/2000"),
    tier: "",
    nextServiceDate: new Date("01/01/2000"),
    lastServiceDate: new Date("01/01/2000"),
    address: "",
    phone: "",
    email: "",
    notes: "",
    equipment: "",
    lastEmailSent: new Date("01/01/2000"),
    numUnits: 0,
  });

  useEffect(() => {
    if (users && users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users]);

  useEffect(() => {
    if (selectedUser) {
      setFormValues({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        signDate: selectedUser.signDate,
        tier: selectedUser.tier,
        nextServiceDate: selectedUser.nextServiceDate,
        lastServiceDate: selectedUser.lastServiceDate,
        address: selectedUser.address,
        phone: selectedUser.phone,
        email: selectedUser.email,
        notes: selectedUser.notes,
        equipment: selectedUser.equipment,
        lastEmailSent: selectedUser.lastEmailSent, // Include lastEmailSent from selectedUser
        numUnits: selectedUser.numUnits,
      });
    }
  }, [users]);

  const sendEmail = async () => {
    const response = await fetch(`/api/autoEmail/sendmail`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Auth.getToken(),
      },
      body: JSON.stringify({
        firstName: formValues.firstName,
        nextServiceDate: formatDate(formValues.nextServiceDate),
        tier: formValues.tier,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send mail to customer");
    }
    const reply = await response.json();
    if (reply.message === "Customer emailed successfully") {
      console.log("Email sent successfully");
      console.log(reply.data);
      // api to update last email sent
      updateCustomerEmail();
    }
  };

  const updateCustomerEmail = async () => {
    const response = await fetch(
      `/api/customer/updateEmail/${selectedUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.getToken(),
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update last sent mail");
    }
    const reply = await response.json();
    console.log(reply);
    hideModal();
    const message = await reply.message;
    if (message === "Customer email updated successfully") {
      onDataUpdate();
      console.log("Should render all data");
    }
  };

  // Modal functions
  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | null;
    direction: string;
  }>({ key: null, direction: "" });

  function formatDate(date: Date) {
    return dayjs(date).format("MM/DD/YYYY");
  }

  // Handler to update form values
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const setTextAreaValue = (value: string) => {
    setFormValues({
      ...formValues,
      notes: value,
    });
  };

  const resetFormValues = () => {
    setFormValues({
      firstName: "",
      lastName: "",
      signDate: new Date("01/01/2000"),
      tier: "",
      nextServiceDate: new Date("01/01/2000"),
      lastServiceDate: new Date("01/01/2000"),
      address: "",
      phone: "",
      email: "",
      notes: "",
      equipment: "",
      lastEmailSent: new Date("01/01/2000"),
      numUnits: 0,
    });
  };

  const updateCustomerInfoAPI = async () => {
    try {
      console.log("this is what's updating:", formValues);
      console.log(typeof formValues.numUnits);
      const response = await fetch(`/api/customer/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.getToken(),
        },
        body: JSON.stringify({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          tier: formValues.tier,
          address: formValues.address,
          signDate: formatDate(formValues.signDate),
          nextServiceDate: formatDate(formValues.nextServiceDate),
          lastServiceDate: formatDate(formValues.lastServiceDate),
          phone: formValues.phone,
          email: formValues.email,
          notes: formValues.notes,
          equipment: formValues.equipment,
          lastEmailSent: formatDate(formValues.lastEmailSent),
          numUnits: formValues.numUnits,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update new customer"); // Throw error for non-200 responses
      }

      // Assuming server response is JSON
      const reply = await response.json();
      console.log(reply);
      console.log("Update new customer request:", formValues);
      // Reset form
      resetFormValues();
      setSelectedUser(null);
      hideModal();
      const message = await reply.message;
      if (message === "Customer updated successfully") {
        onDataUpdate();
        console.log("Should render all data");
      }
    } catch (error) {
      console.error("API error updating new customer:", error);
      throw error; // Re-throw the original error
    }
  };

  const deleteCustomer = async () => {
    var verificationCode = prompt("Please type 'Delete' to confirm deletion:");

    if (verificationCode === "Delete") {
      deleteCustomerAPI();
    } else {
      return false;
    }
  };

  const deleteCustomerAPI = async () => {
    try {
      const response = await fetch(`/api/customer/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.getToken(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer"); // Throw error for non-200 responses
      }

      // Assuming server response is JSON
      const reply = await response.json();
      console.log(reply);
      console.log("Delete customer request:", formValues);
      // Reset form
      resetFormValues();
      setSelectedUser(null);
      hideModal();
      const message = await reply.message;
      if (message === "Customer deleted successfully") {
        onDataUpdate();
        console.log("Should render all data");
      }
    } catch (error) {
      console.error("API error deleting customer:", error);
      throw error; // Re-throw the original error
    }
  };

  const handleSort = (columnName: keyof User) => {
    let direction = "asc";
    if (sortConfig.key === columnName && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnName, direction });

    const sortedUsers = [...users].sort((a, b) => {
      const compareResult =
        columnName === "signDate" ||
        columnName === "nextServiceDate" ||
        columnName === "lastServiceDate"
          ? new Date(a[columnName]).getTime() -
            new Date(b[columnName]).getTime()
          : a[columnName].localeCompare(b[columnName]);

      return direction === "asc" ? compareResult : -compareResult;
    });
    setSortedUsers(sortedUsers);
  };

  const mapUsers = () => {
    if (sortedUsers.length > 0) {
      return sortedUsers.map((user) => (
        <tr key={user.firstName + user.email}>
          <td>
            <a
              onClick={() => {
                setSelectedUser(user);
                setFormValues(user);
                console.log(formValues);
                showModal();
              }}
              className="text-decoration-none"
            >
              {user.firstName + " " + user.lastName}
            </a>
          </td>
          <td>{user.tier}</td>
          <td>{formatDate(user.signDate)}</td>
          <td>{formatDate(user.nextServiceDate)}</td>
          <td>{formatDate(user.lastServiceDate)}</td>
          <td>{formatDate(user.lastEmailSent)}</td>
          <td>{user.address}</td>
          <td>{user.phone}</td>
          <td>{user.email}</td>
        </tr>
      ));
    } else if (thisUsers.length > 0) {
      return users.map((user) => (
        <tr key={user.firstName + user.email}>
          <td>
            <a
              onClick={() => {
                setSelectedUser(user);
                setFormValues(user);
                console.log(selectedUser);
                showModal();
              }}
              className="text-decoration-none"
            >
              {user.firstName + " " + user.lastName}
            </a>
          </td>
          <td>{user.tier}</td>
          <td>{formatDate(user.signDate)}</td>
          <td>{formatDate(user.nextServiceDate)}</td>
          <td>{formatDate(user.lastServiceDate)}</td>
          <td>{formatDate(user.lastEmailSent)}</td>
          <td>{user.address}</td>
          <td>{user.phone}</td>
          <td>{user.email}</td>
        </tr>
      ));
    }
  };

  const custDetails = () => {
    if (selectedUser) {
      return (
        <Modal show={isOpen} onHide={hideModal}>
          <div className="container mx-auto my-5">
            <div className="modal-header mb-3">
              <h5 className="modal-title">
                {selectedUser.firstName} {selectedUser.lastName}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={hideModal}
              ></button>
            </div>
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <form>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={formValues.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="signDate" className="form-label">
                      Sign Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="signDate"
                      name="signDate"
                      value={dayjs(formValues.signDate).format("YYYY-MM-DD")}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tier" className="form-label">
                      Tier
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tier"
                      name="tier"
                      value={formValues.tier}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="nextServiceDate" className="form-label">
                      Next Service Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="nextServiceDate"
                      name="nextServiceDate"
                      value={dayjs(formValues.nextServiceDate).format(
                        "YYYY-MM-DD"
                      )}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastServiceDate" className="form-label">
                      Last Service Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="lastServiceDate"
                      name="lastServiceDate"
                      value={dayjs(formValues.lastServiceDate).format(
                        "YYYY-MM-DD"
                      )}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={formValues.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formValues.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="numUnits" className="form-label">
                      Number of Units
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="numUnits"
                      name="numUnits"
                      value={formValues.numUnits}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="equipment" className="form-label">
                      Equipment
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="equipment"
                      name="equipment"
                      value={formValues.equipment}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      Notes
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      value={formValues.notes}
                      onChange={(
                        ev: React.ChangeEvent<HTMLTextAreaElement>
                      ): void => setTextAreaValue(ev.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastEmailSent" className="form-label">
                      Last Email Sent
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="lastEmailSent"
                      name="lastEmailSent"
                      value={dayjs(formValues.lastEmailSent).format(
                        "YYYY-MM-DD"
                      )}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="text-center my-3">
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={deleteCustomer}
                    >
                      Delete Customer
                    </button>
                  </div>
                  <div className="text-center my-3">
                    <button
                      className="btn btn-warning"
                      type="button"
                      onClick={sendEmail}
                    >
                      Send Email
                    </button>
                  </div>
                  <div className="text-center my-3">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={updateCustomerInfoAPI}
                    >
                      Update Customer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      );
    }
  };

  return (
    <div className="container mt-4">
      {/* customer information modal */}
      {custDetails()}
      <div className="row">
        <div className="col">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">
                    <div className="d-flex flex-row align-items-center ">
                      <div>
                        <p className=" m-0">Name</p>
                      </div>
                      <button
                        className="btn "
                        onClick={() => {
                          handleSort("firstName");
                        }}
                      >
                        <FontAwesomeIcon icon={faSort} size="xs" />
                      </button>
                    </div>
                  </th>
                  <th scope="col">
                    <div className="d-flex flex-row align-items-center ">
                      <div>
                        <p className=" m-0">Tier</p>
                      </div>
                      <button
                        className="btn "
                        onClick={() => {
                          handleSort("tier");
                        }}
                      >
                        <FontAwesomeIcon icon={faSort} size="xs" />
                      </button>
                    </div>
                  </th>
                  <th scope="col">
                    <div className="d-flex flex-row align-items-center ">
                      <div>
                        <p className=" m-0">Sign Date</p>
                      </div>
                      <button
                        className="btn "
                        onClick={() => {
                          handleSort("signDate");
                        }}
                      >
                        <FontAwesomeIcon icon={faSort} size="xs" />
                      </button>
                    </div>
                  </th>
                  <th scope="col">
                    <div className="d-flex flex-row align-items-center ">
                      <div>
                        <p className=" m-0">Next Service Date</p>
                      </div>
                      <button
                        className="btn "
                        onClick={() => {
                          handleSort("nextServiceDate");
                        }}
                      >
                        <FontAwesomeIcon icon={faSort} size="xs" />
                      </button>
                    </div>
                  </th>
                  <th scope="col">
                    <div className="d-flex flex-row align-items-center ">
                      <div>
                        <p className=" m-0">Last Service Date</p>
                      </div>
                      <button
                        className="btn "
                        onClick={() => {
                          handleSort("lastServiceDate");
                        }}
                      >
                        <FontAwesomeIcon icon={faSort} size="xs" />
                      </button>
                    </div>
                  </th>
                  <th scope="col">
                    <div className="d-flex flex-row align-items-center ">
                      <div>
                        <p className=" m-0">Last Email Sent</p>
                      </div>
                      <button
                        className="btn "
                        onClick={() => {
                          handleSort("lastEmailSent");
                        }}
                      >
                        <FontAwesomeIcon icon={faSort} size="xs" />
                      </button>
                    </div>
                  </th>
                  <th scope="col">
                    <div className="d-flex flex-row align-items-center ">
                      <div>
                        <p className=" m-0">Address</p>
                      </div>
                      <button
                        className="btn text-opacity-0 noHover"
                        onClick={() => {
                          console.log("clicked");
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faSort}
                          size="xs"
                          style={{ opacity: 0 }}
                        />
                      </button>
                    </div>
                  </th>
                  <th scope="col">
                    <div className="d-flex flex-row align-items-center ">
                      <div>
                        <p className=" m-0">Phone</p>
                      </div>
                      <button
                        className="btn text-opacity-0 noHover"
                        onClick={() => {
                          console.log("clicked");
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faSort}
                          size="xs"
                          style={{ opacity: 0 }}
                        />
                      </button>
                    </div>
                  </th>
                  <th scope="col">
                    <div className="d-flex flex-row align-items-center ">
                      <div>
                        <p className=" m-0">Email</p>
                      </div>
                      <button
                        className="btn text-opacity-0 noHover"
                        onClick={() => {
                          console.log("clicked");
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faSort}
                          size="xs"
                          style={{ opacity: 0 }}
                        />
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>{mapUsers()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcessUsers;
