import { RoleEnum } from "@renderer/common/enum";
import { GeneralInfo } from "@renderer/common/interface/general.interface";
import { Class } from "./class.interface";
import { Video } from "./video.interface";

export interface User extends GeneralInfo {
  name: string;
  role: RoleEnum;
  email: string;
  class: Class;
  videos: Video[];
}
