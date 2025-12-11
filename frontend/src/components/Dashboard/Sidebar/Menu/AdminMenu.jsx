import { FaListUl, FaUserCog } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import MenuItem from "./MenuItem";
import { MdAssignment } from "react-icons/md";

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={HiUsers} label="Manage Users" address="manage-users" />
      <MenuItem icon={FaListUl} label="All Loans" address="all-loan" />
      <MenuItem
        icon={MdAssignment}
        label="Loan Applications"
        address="all-loan-application"
      />
    </>
  );
};

export default AdminMenu;
