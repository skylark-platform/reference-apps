import React from "react";
import { MdAccountCircle, MdStream } from "react-icons/md";
import { Button } from "../button";

interface AppHeaderProps extends React.HTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onClick, title }) => (
  <div className="inline-block flex h-20 w-full items-center justify-between bg-purple-500 align-middle sm:h-40">
    <div className="flex fill-gray-100 text-3xl text-gray-100 ">
      <MdStream className="ml-12 h-9 w-9 sm:h-14 sm:w-16" />
      <h2 className="mt-2 text-base sm:mt-3 sm:text-3xl">{title}</h2>
    </div>
    <div className="sm-gutter md:md-gutter lg:lg-gutter xl:xl-gutter inline-block  flex hidden p-6 align-middle sm:flex">
      <Button
        icon={<MdAccountCircle className="block" />}
        text="Sign in"
        onClick={onClick}
      />
      <Button text="Register" variant="tertiary" onClick={onClick} />
    </div>
  </div>
);

export default AppHeader;
