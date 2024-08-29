import { GeneralInfo } from "@renderer/common/interface/general.interface";

export interface Class extends GeneralInfo {
  name: string;
  description: string;
  userCount?: number;
  isNew?: boolean;
}
