import { FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdClock } from "react-icons/io";
import { GiPathDistance } from "react-icons/gi";
import { toggleMerchantFavourite } from "../../../services/Universal_Flow/merchantService";

const MerchantCard = ({ merchant,businessCategoryId, setSearchText, searchText }) => {

  const handleToggle = async(merchantId) => {
    try {
      const data = await toggleMerchantFavourite(merchantId, businessCategoryId);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
 
  return (
    <div className="bg-gradient-to-t from-gray-200 via-white to-white border border-[#00ced1] shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
      <div className="md:p-[2rem] md:w-1/2">
        <img
          src={merchant.merchantImage || "order/empty_merchant.png"}
          alt={merchant.merchantName}
          className="w-full object-cover h-60 md:rounded-2xl"
        />
      </div>

      <div className="md:p-10 w-full p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-6">
            <div className="text-3xl font-bold">{merchant.merchantName}</div>
            <FaHeart color={merchant.isFavourite ? "yellow" : "gray"} className="cursor-pointer" size={20} onClick={() => {handleToggle(merchant.merchantId)}}/>
          </div>

          <p>{merchant.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <FaLocationDot /> {merchant.displayAddress}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <IoMdClock /> {merchant.deliveryTime} min
          </div>
          <div className="flex items-center gap-2 mt-1">
            <GiPathDistance /> {merchant.distanceInKM} KM
          </div>
          <div className="mt-1 font-semibold text-yellow-500">{merchant.rating} ★</div>
        </div>

         <input
        type="text"
        placeholder="Search for your favourite products..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mt-4 w-full bg-gray-100 border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-[#00ced1]"
      />
      </div>
    </div>
  );
};

export default MerchantCard;
