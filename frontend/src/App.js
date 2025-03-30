import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavbarDown from './components/NavbarDown';
import Header from './components/Header';


function App() {
  return (
    <>
    <Header />
      <main>
        <Container>
          <Outlet/>
        </Container>
      </main>
      <NavbarDown/>
    </>
  );
}

export default App;
