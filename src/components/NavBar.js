/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { signOut } from '../utils/auth';

export default function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" variant="primary">
      <Container>
        <Link passHref href="/" className="navbar-brand spin-on-load">
          <img src="https://www.dropbox.com/scl/fi/pie7oyfnigjenunsdmxn5/logo.png?rlkey=p3jcvl89k1o0zhva6smkct52b&st=dmc6jojw&raw=1" alt="logo" id="logo" />
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link text-primary" href="/expensesTracker">
              Expenses Tracker
            </Link>
            <Link className="nav-link text-primary" href="/calendar">
              Calendar
            </Link>
            <Link className="nav-link text-primary" href="/profile">
              Profile
            </Link>
          </Nav>
          <Link href="/clients/new" passHref>
            <Button className="newClient" variant="success">
              &#43; Add New Client
            </Button>
          </Link>
          <Link href="/leads" passHref>
            <Button className="newLead" variant="danger">
              Leads
            </Button>
          </Link>

          <Button className="signOut" variant="danger" onClick={signOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
