import { GeneralInfo } from "@renderer/common/interface/general.interface";

export interface Class extends GeneralInfo {
  name: string;
  description: string | null;
  userCount?: number;
  videoCount?: number;
  isNew?: boolean;
}
