import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState } from "react";
import User from "./User";
import { Container, Navbar } from "react-bootstrap";
import * as ReactBootStrap from "react-bootstrap";
import { Link } from "react-router-dom";


const NavbarUser = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [open, setOpen] = useState(false)

  return (
    <div className="navbar">
      <div className="wrapper" style={{padding: "0px", margin: "0 5px"}}>
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div>
        <div className="items">
        
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item">
            {/* <img
              src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
              className="avatar"
            /> */}
            <User/>
          </div>
        </div>
      </div>
    </div>
  )
};

export default NavbarUser;


// {/* <div className="App">
//       <ReactBootStrap.Navbar collapseOnSelect expand="xl" bg="danger" variant="dark">
//         <ReactBootStrap.Navbar.Brand href="#home">THICC BOIS HOURS</ReactBootStrap.Navbar.Brand>
//         <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
//         <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav" style={{backgroundColor: "#ccc"}}>
//           <ReactBootStrap.Nav className="mr-auto">
//             <Link to="/features">
//               <ReactBootStrap.Nav.Link href="#features">Features</ReactBootStrap.Nav.Link>
//             </Link>
//             <Link to="/pricing">
//               <ReactBootStrap.Nav.Link href="#pricing">Pricing</ReactBootStrap.Nav.Link>
//             </Link>
//             <ReactBootStrap.NavDropdown title="YEET" id="collasible-nav-dropdown">
//               <ReactBootStrap.NavDropdown.Item href="#action/3.1">Action</ReactBootStrap.NavDropdown.Item>
//               <ReactBootStrap.NavDropdown.Item href="#action/3.2">Another action</ReactBootStrap.NavDropdown.Item>
//               <ReactBootStrap.NavDropdown.Item href="#action/3.3">Something</ReactBootStrap.NavDropdown.Item>
//               <ReactBootStrap.NavDropdown.Divider />
//               <ReactBootStrap.NavDropdown.Item href="#action/3.4">Separated link</ReactBootStrap.NavDropdown.Item>
//             </ReactBootStrap.NavDropdown>
//           </ReactBootStrap.Nav>
//           <ReactBootStrap.Nav>
//             <Link to="/deets">
//               <ReactBootStrap.Nav.Link href="#deets">More deets</ReactBootStrap.Nav.Link>
//             </Link>
//             <Link to="/dankmemes">
//               <ReactBootStrap.Nav.Link eventKey={2} href="#memes">
//                 Dank memes
//               </ReactBootStrap.Nav.Link>
//             </Link>
//           </ReactBootStrap.Nav>
//         </ReactBootStrap.Navbar.Collapse>
//       </ReactBootStrap.Navbar>
//     </div> */}