import React, {useContext} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {publicRoutes, privateRoutes} from "../router/routs";
import {AuthContext} from "../context/context";
import Loader from "./UI/Loader/Loader";

const AppRouter = () => {

    const {isAuth, isLoading} = useContext(AuthContext)

    if(isLoading){
        return <Loader/>
    }

    return (
        isAuth
            ? <Routes >
                {privateRoutes.map(route =>
                    <Route
                        key={route.id}
                        element= {route.component}
                        path={route.path}
                        exact={route.exact}
                    />
                )}
                <Route path="*" element={<Navigate replace to="/posts" />} />
            </Routes>
            : <Routes >
                {publicRoutes.map(route =>
                    <Route
                        key={route.id}
                        element= {route.component}
                        path={route.path}
                        exact={route.exact}
                    />
                )}
                <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
    );
};

export default AppRouter;


{/*<Route path="/about" element={<About />} />*/}
{/*<Route exact path="/posts" element={<Posts />} />*/}
{/*<Route exact path="/posts/:id" element={<PostIdPage />} />*/}