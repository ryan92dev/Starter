import React from "react";
import HomeBox from "../components/HomeBox";

const Protected = () => {
  return (
    <div className="w-full h-screen bg-primary">
      <div className="flex items-center justify-center h-screen">
        <HomeBox pageName="Protected Page" />
      </div>
    </div>
  );
};

export default Protected;
