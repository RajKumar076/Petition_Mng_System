import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import DepartmentTable from "../components/DepartmentTable";

const DepartmentInventoryPage = () => {
  const { departmentName } = useParams();

  return (
    <div>
      <Header />
      <div  className="container bg-white">

      <div className="container-fluid mt-4">
      <button className="btn btn-outline-secondary mb-3 w-25" onClick={() => window.history.back()}>← Back</button>
        <h2 className="mb-4 text-primary text-center text-capitalize">
          {departmentName} Department - Inventory
        </h2>

        <DepartmentTable department={departmentName} limit={100} />
      </div>
      </div>
    </div>
  );
};

export default DepartmentInventoryPage;
