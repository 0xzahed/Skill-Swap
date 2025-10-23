import React from "react";
import { useLoaderData } from "react-router-dom";

const Service = () => {
  const skills = useLoaderData();
  console.log(skills);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {skills.map(({ skillId, skillName, providerName }) => (
        <div key={skillId} className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold">{skillName}</h3>
          <p>Provider: {providerName}</p>
        </div>
      ))}
    </div>
  );
};

export default Service;
