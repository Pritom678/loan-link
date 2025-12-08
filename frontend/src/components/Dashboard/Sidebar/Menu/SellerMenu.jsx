import { BsFillHouseAddFill } from "react-icons/bs";
import { MdHomeWork, MdOutlineManageHistory } from "react-icons/md";
import MenuItem from "./MenuItem";
const SellerMenu = () => {
  return (
    <>
      <MenuItem icon={BsFillHouseAddFill} label="Add Loan" address="add-loan" />
      <MenuItem icon={MdHomeWork} label="Pending Loan Application" address="pending-loans" />
      <MenuItem icon={MdHomeWork} label="Approved Loan Application" address="approved-loans" />
      <MenuItem
        icon={MdOutlineManageHistory}
        label="Manage Loans"
        address="manage-loans "
      />
    </>
  );
};

export default SellerMenu;
