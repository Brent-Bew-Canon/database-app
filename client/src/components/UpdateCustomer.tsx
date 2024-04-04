import dayjs from "dayjs";

interface User {
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
  equpment: string;
  lastEmailSent: Date;
}

function UpdateCustomer(user: User) {
  function formatDate(date: Date) {
    return dayjs(date).format("MM/DD/YYYY");
  }

  return (
    <div className="row">
      <div className="col-lg-8 offset-lg-2">
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Sign Date:</strong> {formatDate(user.signDate)}
          </li>
          <li className="list-group-item">
            <strong>Tier:</strong> {user.tier}
          </li>
          <li className="list-group-item">
            <strong>Next Service Date:</strong>{" "}
            {formatDate(user.nextServiceDate)}
          </li>
          <li className="list-group-item">
            <strong>Last Service Date:</strong>{" "}
            {formatDate(user.lastServiceDate)}
          </li>
          <li className="list-group-item">
            <strong>Address:</strong> {user.address}
          </li>
          <li className="list-group-item">
            <strong>Phone:</strong> {user.phone}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {user.email}
          </li>
          <li className="list-group-item">
            <strong>Equipment:</strong> {user.equpment}
          </li>
          <li className="list-group-item">
            <strong>Notes:</strong> {user.notes}
          </li>
          <li className="list-group-item">
            <strong>Last Email Sent:</strong> {formatDate(user.lastEmailSent)}
          </li>
        </ul>
        <div className="mx-auto text-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => console.log("send email")}
          >
            Send Email
          </button>
        </div>
        <div className="mx-auto text-center my-4 ">
          <button
            className="btn btn-warning "
            onClick={() => UpdateCustomer(user)}
          >
            Update Customer Info
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateCustomer;
