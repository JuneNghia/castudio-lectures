import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";

import { ACCOUNT_INITIALISE, LOGIN, LOGOUT } from "../store/actions";
import { useDispatch } from "react-redux";
import { User } from "@renderer/interfaces/user.interface";
import accountReducer from "@renderer/store/accountReducer";
import AuthService from "@renderer/services/auth.service";
import { AxiosResponse } from "axios";
import Loader from "@renderer/components/Loader";
import Swal from "sweetalert2";
import showLoading from "@renderer/common/function/showLoading";
import axiosConfig from "@renderer/utils/axios";

interface AccessToken {
  id: string;
  iat: number;
}
export interface JWTContextType {
  isInitialised: boolean;
  isLoggedIn: boolean;
  user: User | null;
  signIn: (email: string, password: string, mac: string) => Promise<boolean>;
  signOut: () => void;
}

const initialState = {
  isLoggedIn: false,
  isInitialised: false,
  user: null,
  signIn: async () => false,
  signOut: () => console.log(),
};

const verifyToken = (access_token: string) => {
  if (!access_token) {
    return false;
  }

  let decoded: AccessToken;

  try {
    decoded = jwtDecode(access_token);
    return decoded && decoded.iat + 604800 > Date.now() / 1000;
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("access_token");
    return false;
  }
};

const setSession = (access_token: string | null) => {
  if (access_token) {
    localStorage.setItem("access_token", access_token);
  } else {
    localStorage.removeItem("access_token");
  }
};

const JWTContext = createContext<JWTContextType>(initialState);

export const JWTProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const dispatchPermission = useDispatch();
  const [showAlert, setShowAlert] = useState(false);

  const signIn = async (email: string, password: string, mac: string) => {
    const response = await AuthService.signIn(email, password, mac);
    const { accessToken, user }: { accessToken: string; user: User } =
      response.data.data;

    if (accessToken && user) {
      setSession(accessToken);
      window.electronAPI.saveToken(accessToken);
      dispatch({
        type: LOGIN,
        payload: {
          user: user,
        },
      });

      return true;
    }

    return false;
  };

  const signOut = () => {
    window.electronAPI.deleteToken();
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  // // CHECK TOKEN EXPIRE
  const checkTokenExpiration = useCallback(async () => {
    const access_token = await window.electronAPI.readToken();

    if (access_token) {
      try {
        const decoded: AccessToken = jwtDecode(access_token);
        const issuedAt = decoded.iat * 1000;
        const expirationTime = issuedAt + 604800 * 1000;

        if (Date.now() > expirationTime && state.isLoggedIn) {
          setShowAlert(true);
          Swal.fire({
            title: "Thông báo",
            html: `Phiên đăng nhập của bạn đã hết hạn")}<br/>
              "Vui lòng nhấn vào nút dưới đây để đăng nhập lại"
            )}`,
            confirmButtonText: "Đăng nhập",
            icon: "info",
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((confirm) => {
            if (confirm.isConfirmed) {
              showLoading(true);

              window.electronAPI.deleteToken();
              window.electronAPI.resetApp();
            }
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        window.electronAPI.deleteToken();
      }
    }
  }, [state.isLoggedIn]);

  useEffect(() => {
    if (!showAlert) {
      const intervalId = setInterval(() => {
        checkTokenExpiration();
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }

    return;
  }, [checkTokenExpiration, showAlert]);

  useEffect(() => {
    const init = async () => {
      try {
        const access_token = await window.electronAPI.readToken();

        if (access_token && verifyToken(access_token)) {
          setSession(access_token);

          await axiosConfig
            .post(`/auth/verify-token/`, {
              token: access_token,
            })
            .then((res: AxiosResponse) => {
              const dataUser: User = res.data.data;

              if (dataUser) {
                dispatch({
                  type: ACCOUNT_INITIALISE,
                  payload: {
                    isLoggedIn: true,
                    user: dataUser,
                  },
                });
              }
            })
            .catch((error) => {
              console.log(error);
              dispatch({
                type: ACCOUNT_INITIALISE,
                payload: {
                  isLoggedIn: false,
                  user: null,
                },
              });
            });
        } else {
          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.log(err);
        dispatch({
          type: ACCOUNT_INITIALISE,
          payload: {
            isLoggedIn: false,
            user: null,
          },
        });
      }
    };

    init();
  }, [dispatch, dispatchPermission, state.isInitialised, state.isLoggedIn]);

  if (!state.isInitialised) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;
