import * as React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AppRoute} from "../const.ts";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "../api/query-client.ts";
import {GuestRoute, PrivateRoute} from "../components/private-route/private-route.tsx";

export function App() : React.JSX.Element {
  return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              path={AppRoute.Upload}
              //element={<UploadPage/>}
            />
            <Route
              path={AppRoute.Document}
              //element={<DocumentPage/>}
            />
            <Route element={<PrivateRoute />}>
              <Route
                path={AppRoute.Account}
                //element={<AccountPage />}
              />
            </Route>
            <Route element={<GuestRoute />}>
              <Route
                path={AppRoute.Login}
                //element={<LoginPage />}
              />
            </Route>
            <Route
              path='*'
              //element={<NotFoundPage />}
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
  )
}
