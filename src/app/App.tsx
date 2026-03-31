import * as React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AppRoute} from "../const.ts";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "../api/query-client.ts";

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
            <Route
              path='*'
              //element={<NotFoundPage />}
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
  )
}
