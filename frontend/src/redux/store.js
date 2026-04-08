import userReducer from "./user/userSlice";
import { persistReducer } from "redux-persist";

export const store = configureStore({
  reducer: { user: userReducer },
  middleware: (middleware) => middleware({ serializableCheck: false }),
});
