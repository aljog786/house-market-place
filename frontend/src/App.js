import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavbarDown from './components/NavbarDown';

function App() {
  return (
    <>
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
