import { GeneralInfo } from "@renderer/common/interface/general.interface";
import { Class } from "./class.interface";

export interface WhiteList extends GeneralInfo {
  email: string;
  class: Class;
}
