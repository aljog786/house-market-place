import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Explore from './pages/Explore';
import Category from './pages/Category';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import CreateBuilding from './pages/CreateBuilding';
import BuildingDetails  from './pages/BuildingDetails';
import MyProperties from './pages/MyProperties';
import OtpInput from './components/OtpInput';
import Success from './pages/Success';
import EditBuilding from './pages/EditBuilding';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyFavorites from './pages/MyFavorites';
import EditProfile from './pages/EditProfile';
import Cart from './pages/Cart';
import Chats from './pages/Chats';
import Payment from './pages/Payment';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Explore />} />
      <Route path="/category/:type" element={<Category />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/otp" element={<OtpInput />} />
      <Route path="/building-details/:id" element={<BuildingDetails />} />

      <Route element={<PrivateRoute />}>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile/chats" element={<Chats />} />
        <Route path="/profile/create-building" element={<CreateBuilding />} />
        <Route path="/profile/properties" element={<MyProperties />} />
        <Route path="/profile/favorites" element={<MyFavorites />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/edit-building/:id" element={<EditBuilding />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
      </Route>

      <Route element={<AdminRoute />}></Route>
    </Route>
  )
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);