import React from "react";
import error404 from "../assets/images/404notfound (1).png";

const Error404 = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <img
            src={error404}
            alt="404 Error"
            className="w-full max-w-lg mx-auto h-auto rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Error404;
