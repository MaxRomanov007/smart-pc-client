import type { INavigationTab } from "@/@types/ui/i-navigation-tab";
import { LuAirVent } from "react-icons/lu";
import { BsLuggageFill, BsLungs } from "react-icons/bs";
import { GiLuciferCannon } from "react-icons/gi";
import { CgArrowLongUpC } from "react-icons/cg";

export const NAVIGATION_TABS: INavigationTab[] = [
  {
    icon: <LuAirVent />,
    href: "#",
    name: "first",
  },
  {
    icon: <BsLungs />,
    href: "#",
    name: "second",
  },
  {
    icon: <BsLuggageFill />,
    href: "#",
    name: "third",
  },
  {
    icon: <GiLuciferCannon />,
    href: "#",
    name: "fourth",
  },
  {
    icon: <CgArrowLongUpC />,
    href: "#",
    name: "fifth",
  },
];
