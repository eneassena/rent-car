import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { useEffect } from 'react';


import { clientesService } from '@/features/clients/services/client.service';



// clientesService.getAll().then(() => {
//   console.log('getAll API call completed');
// });

const App = () => {
  async function fetchClients() {
    await clientesService.getAll();
    console.log('getAll API call completed');
  }

  // useEffect(() => {
  //   fetchClients();
  // }, []);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
