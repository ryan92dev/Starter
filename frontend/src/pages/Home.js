import React from "react";
import HomeBox from "../components/HomeBox";

const Home = () => {
  return (
    <div className="w-full h-screen bg-primary">
      <div className="flex items-center justify-center h-screen">
        <HomeBox pageName="Home Page" />
      </div>
    </div>
  );
};

export default Home;
