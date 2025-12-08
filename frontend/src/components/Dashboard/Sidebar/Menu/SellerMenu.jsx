import { BsFillHouseAddFill } from "react-icons/bs";
import { MdHomeWork, MdOutlineManageHistory } from "react-icons/md";
import MenuItem from "./MenuItem";
const SellerMenu = () => {
  return (
    <>
      <MenuItem icon={BsFillHouseAddFill} label="Add Loan" address="add-loan" />
      <MenuItem icon={MdHomeWork} label="My Inventory" address="my-inventory" />
      <MenuItem
        icon={MdOutlineManageHistory}
        label="Manage Loans"
        address="manage-loans "
      />
    </>
  );
};

export default SellerMenu;
