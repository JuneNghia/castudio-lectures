import { ACCOUNT_INITIALISE, LOGIN, LOGOUT } from "./actions";

interface AccountState {
  isLoggedIn: boolean;
  isInitialised: boolean;
  user: any;
}

interface AccountAction {
  type: string;
  payload?: any;
}

const accountReducer = (
  state: AccountState,
  action: AccountAction
): AccountState => {
  switch (action.type) {
    case ACCOUNT_INITIALISE: {
      const { isLoggedIn, user } = action.payload;
      return {
        ...state,
        isLoggedIn,
        isInitialised: true,
        user,
      };
    }
    case LOGIN: {
      const { user } = action.payload;
      return {
        ...state,
        isLoggedIn: false,
        user,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default accountReducer;
