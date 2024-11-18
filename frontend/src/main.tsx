import React from 'react';
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TabletFelvetel from './components/TabletFelvetel';
import TabletLista from './components/TabletLista';
import Kezdolap from './components/Kezdolap';
import TabletTorles from './components/TabletTorles';


const router = createBrowserRouter([
  {
    path: "/tabletek-lista",
    element: <TabletLista />,
  },
  {
    path: "/tabletek",
    element: <TabletLista />,
  },  
  {
    path: "/kezdolap",
    element: <Kezdolap />,
  },
  {
    path: "/tabletek-torles",
    element: <TabletTorles />,
  },
  {
    path: "/tabletek-felvetel",
    element: <TabletFelvetel />
  }
]);


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
) 