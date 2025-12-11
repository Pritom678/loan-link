

import MenuItem from "./MenuItem";
import { FaMoneyBillWave } from "react-icons/fa";

const BorrowerMenu = () => {
  return (
    <>
      <MenuItem icon={FaMoneyBillWave} label="My Loans" address="my-loans" />
    </>
  );
};

export default BorrowerMenu;
