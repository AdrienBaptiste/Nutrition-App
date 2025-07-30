import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routing/AppRouter';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
