import { MdAddCard, MdManageAccounts } from "react-icons/md";
import MenuItem from "./MenuItem";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";
const ManagerMenu = () => {
  return (
    <>
      <MenuItem icon={MdAddCard} label="Add Loan" address="add-loan" />
      <MenuItem
        icon={AiOutlineClockCircle}
        label="Pending Loan Application"
        address="pending-loans"
      />
      <MenuItem
        icon={BsFillPatchCheckFill}
        label="Approved Loan Application"
        address="approved-loans"
      />
      <MenuItem
        icon={MdManageAccounts}
        label="Manage Loans"
        address="manage-loans"
      />
    </>
  );
};

export default ManagerMenu;
