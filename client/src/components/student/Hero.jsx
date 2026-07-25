import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleExplore = () => {
    navigate("/courses", { state: { searchValue: search } });
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className="w-full text-white bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 py-12 flex justify-center">
      <div className="flex flex-col gap-6 items-center">
        <h3 className="text-2xl font-semibold ">
          Find the Best Courses for You
        </h3>
        <p>Discover, learn and Upskill with our wide range of courses </p>
        <div className="">
          <input
            type="text"
            name="search"
            onChange={handleSearchChange}
            value={search}
            className="outline-none p-1 bg-white text-black rounded-l-full pl-1 sm:w-96 focus-within:scale-105 focus-within::ring-2 focus-within::ring-white "
          />
          <button
            className="bg-blue-500 text-white p-1 px-6 rounded-r-full cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:scale-105 active:scale-95 hover:ring-2 hover:ring-white"
            onClick={handleExplore}
          >
            Search
          </button>
        </div>
        <button
          className="text-blue-500 bg-white p-1 px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:scale-105 active:scale-95 border border-blue-500 hover:ring-2 hover:ring-white"
          onClick={handleExplore}
        >
          Explore Courses
        </button>
      </div>
    </div>
  );
};

export default Hero;
