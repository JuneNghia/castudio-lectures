import { GeneralInfo } from "@renderer/common/interface/general.interface";
import { Class } from "./class.interface";

export interface Video extends GeneralInfo {
  name: string;
  description: string;
  class: Class | null;
  url: string;
  isNew?: boolean
}
