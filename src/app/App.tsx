import * as React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AppRoute} from "../const.ts";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "../api/query-client.ts";
import {GuestRoute, PrivateRoute} from "../components/private-route/private-route.tsx";
import {HelmetProvider} from 'react-helmet-async';
import {UploadPage} from "../pages/upload-page/upload-page.tsx";
import {LoginPage} from "../pages/login-page/login-page.tsx";
import {RegisterPage} from "../pages/register-page/register-page.tsx";
import {DocumentPage} from "../pages/document-page/document-page.tsx";
import {AccountPage} from "../pages/account-page/account-page.tsx";
import {UserDocumentPage} from "../pages/user-document-page/user-document-page.tsx";
import {EditAccountPage} from "../pages/edit-account-page/edit-account-page.tsx";
import {AuthProvider} from "../context/auth-context.tsx";

export function App() : React.JSX.Element {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path={AppRoute.Upload}
                element={<UploadPage/>}
              />
              <Route
                path={AppRoute.Document}
                element={<DocumentPage/>}
              />
              <Route element={<PrivateRoute />}>
                <Route
                  path={AppRoute.Account}
                  element={<AccountPage />}
                />
                <Route
                  path={AppRoute.UserDocument}
                  element={<UserDocumentPage />}
                />
                <Route
                  path={AppRoute.EditAccount}
                  element={<EditAccountPage />}
                />
              </Route>
              <Route element={<GuestRoute />}>
                <Route
                  path={AppRoute.Login}
                  element={<LoginPage />}
                />
                <Route
                  path={AppRoute.Register}
                  element={<RegisterPage />}
                />
                <Route
                  path={AppRoute.Summary}
                  element={<DocumentPage />}
                />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
