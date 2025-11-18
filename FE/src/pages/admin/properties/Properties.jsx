import React, { useState } from 'react'
import New from '../new/New'
import { userInputs } from '../new/formSource'
import Sidebar from './../../../components/sidebar/Sidebar'
import Navbar from "./../../../components/navbar/Navbar";
import Size from './size/Size';
import { ToastContainer, toast } from 'react-toastify';
import { Accordion } from 'react-bootstrap';

const properties = [{ name: " Kích cỡ", page: Size }, { name: " Màu", page: Size }]
function Properties() {

  const handleNotify = (text) => {
    console.log(123);
    toast(text)
  };

  return (
    <>
      <div className="new">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <Accordion defaultActiveKey="0">
            {
              properties.map((propertie, index) => {
                const Page = propertie.page
                return <Accordion.Item eventKey={index}>
                  <Accordion.Header>{propertie.name}</Accordion.Header>
                  <Accordion.Body>
                    <Page />
                  </Accordion.Body>
                </Accordion.Item>
              })
            }
          </Accordion>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <ToastContainer />
      </div>
    </>
  )
}

export default Properties