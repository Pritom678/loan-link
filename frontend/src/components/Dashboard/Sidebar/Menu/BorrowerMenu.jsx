import { BsFingerprint } from "react-icons/bs";

import MenuItem from "./MenuItem";

const BorrowerMenu = () => {
  return (
    <>
      <MenuItem icon={BsFingerprint} label="My Loans" address="my-loans" />
    </>
  );
};

export default BorrowerMenu;
