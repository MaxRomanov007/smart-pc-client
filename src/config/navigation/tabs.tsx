import type { INavigationTab } from "@/@types/ui/navigation/navigation-tab";
import { LuAirVent } from "react-icons/lu";
import { BsLuggageFill, BsLungs } from "react-icons/bs";
import { GiLuciferCannon } from "react-icons/gi";
import { CgArrowLongUpC } from "react-icons/cg";

export const NAVIGATION_TABS: INavigationTab[] = [
  {
    icon: <LuAirVent />,
    href: "#",
    tooltipMessageId: "FirstTabTooltipMessage",
    textMessageId: "FirstTabTextMessage",
  },
  {
    icon: <BsLungs />,
    href: "#",
    tooltipMessageId: "SecondTabTooltipMessage",
    textMessageId: "SecondTabTextMessage",
  },
  {
    icon: <BsLuggageFill />,
    href: "#",
    tooltipMessageId: "ThirdTabTooltipMessage",
    textMessageId: "ThirdTabTextMessage",
  },
  {
    icon: <GiLuciferCannon />,
    href: "#",
    tooltipMessageId: "FourthTabTooltipMessage",
    textMessageId: "FourthTabTextMessage",
  },
  {
    icon: <CgArrowLongUpC />,
    href: "#",
    tooltipMessageId: "FifthTabTooltipMessage",
    textMessageId: "FifthTabTextMessage",
  },
];
