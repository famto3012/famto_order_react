import React from "react";
import { IoIosArrowDropdown, IoIosArrowDropright } from "react-icons/io";

const CategoryList = ({ categories, selectedCategoryId, onCategoryClick }) => (
  <div className="w-full lg:w-1/3 space-y-4">
    {categories.map((item) => {
      const category = item.category || item;
      const isSelected = selectedCategoryId === category.categoryId;
      return (
        <div
          key={category.categoryId}
          className={`p-4 rounded-xl shadow-md flex justify-between items-center cursor-pointer 
            ${isSelected ? "bg-[#00CED1] text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
          onClick={() => onCategoryClick(category.categoryId)}
        >
          <h2 className={category.status ? "text-black" : "text-gray-500"}>{category.categoryName}</h2>
          {isSelected ? <IoIosArrowDropdown size={25} /> : <IoIosArrowDropright size={25} className={category.status ? "text-black" : "text-gray-500"}/>}
        </div>
      );
    })}
  </div>
);

export default CategoryList;
