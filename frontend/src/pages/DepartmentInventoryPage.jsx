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
        <h2 className="mb-4 text-primary text-center text-capitalize">
          {departmentName} Department - Inventory
        </h2>

        <DepartmentTable department={departmentName} limit={100} />
      </div>
      </div>
      <button className="btn btn-outline-secondary mb-3" style={{width:"100px"}} onClick={() => window.history.back()}>← Back</button>

    </div>
  );
};

export default DepartmentInventoryPage;
