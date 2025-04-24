import React, { useState } from "react";

const ComplaintForm = () => {
  const [form, setForm] = useState({ name: "", email: "", complaint: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted complaint:", form);
  };

  return (
    <form className="max-w-xl mx-auto my-6 p-6 bg-white shadow rounded" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Submit a Complaint</h2>
      <label className="block mb-2">Name:</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border mb-4"
        required
      />
      <label className="block mb-2">Email:</label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 border mb-4"
        required
      />
      <label className="block mb-2">Complaint:</label>
      <textarea
        name="complaint"
        value={form.complaint}
        onChange={handleChange}
        className="w-full p-2 border mb-4"
        rows={5}
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default ComplaintForm;
