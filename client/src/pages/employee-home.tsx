import React from "react";

// Employee type definition
type Employee = {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
};

// Sample employee data
const employees: Employee[] = [
  { id: 1, name: "John Doe", position: "Software Engineer", department: "IT", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", position: "Product Manager", department: "Product", email: "jane.smith@example.com" },
  { id: 3, name: "Michael Johnson", position: "UX Designer", department: "Design", email: "michael.j@example.com" },
];

const EmployeePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Employee Directory</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Position</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Email</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{emp.id}</td>
                <td className="px-6 py-4">{emp.name}</td>
                <td className="px-6 py-4">{emp.position}</td>
                <td className="px-6 py-4">{emp.department}</td>
                <td className="px-6 py-4">{emp.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeePage;
