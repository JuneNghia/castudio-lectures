import { RoleEnum } from "@renderer/common/enum";
import { GeneralInfo } from "@renderer/common/interface/general.interface";

export interface User extends GeneralInfo {
  fullName: string;
  role: RoleEnum;
}
