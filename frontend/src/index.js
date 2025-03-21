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

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Explore />} />
      <Route path="/category/:type" element={<Category />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/building-details/:id" element={<BuildingDetails />} />


      <Route element={<PrivateRoute />}>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/create-building" element={<CreateBuilding />} />
        <Route path="/profile/properties" element={<MyProperties />} />
      </Route>

      <Route element={<AdminRoute />}>
      </Route>
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