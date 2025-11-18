import React, { useState } from 'react'
import './product.scss'
import ZoomImage from './ZoomImage';
import Sidebar from './../../../components/sidebar/Sidebar';
import Navbar from './../../../components/navbar/Navbar';
import { useQuill } from "react-quilljs";
import './quilljs.css'
import ComboboxPropertie from './ComboboxPropertie';
import { CustomMenu, CustomToggle } from './CustomMenu'
import { Dropdown } from 'react-bootstrap';

const fruits = [
  { id: "1", name: "Apples", prefix: "How's about them " },
  { id: "2", name: "Pear", prefix: "A cracking ", suffix: "!" },
  { id: "3", name: "Oranges", prefix: "What rhymes with ", suffix: "?" },
  { id: "4", name: "Banana", prefix: "name flies like a " },
  { id: "5", name: "Coconuts", prefix: "Oh what a lovely bunch of " },
  { id: "6", name: "Avocado", prefix: "Is an ", suffix: " even a fruit?" }
];

function CreateProduct() {

  // begin quilljs
  const theme = 'snow';
  // const theme = 'bubble';



  const modules = {
    toolbar: []
  };

  const placeholder = 'Mô tả...';

  const formats = [];
  const { quill, quillRef } = useQuill({ theme, modules, formats, placeholder });
  React.useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML('');
    }
  }, [quill]);
  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setProduct(product.desc = quill.root.innerHTML);
      });
    }
  }, [quill]);
  // begin product
  const [product, setProduct] = useState({
    name: "",
    material: "",
    brand: "",
    sole: "",
    category: "",
    desc: "",
    gender: ""
  })

  const changProduct = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value })
    console.log(product);
  }

  const changProductMaterial = (val) => {
    const data = product
    console.log(data);
    setProduct(data.material = val)
    setProduct(data)
    console.log(product);
  }

  // end product
  //  end quiiljs
  const [indexImd, setIndexImg] = useState(-1)
  const [url, setImg] = useState();
  // function zoomImg(i) {
  //   setImg(data[i].img)
  // }
  const handleClick = (event) => {
    // console.log(i);
    var url = event.target.value
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const data = { url: url, img: reader.result }
      const onchangeVal = [...datacClassify]
      onchangeVal[indexImd].data.push(data)
      setDataClassify(onchangeVal)
    };
  };
  const handleDelete = (i, indexImg) => {
    console.log(indexImg);
    const deleteVal = [...datacClassify]
    const data = deleteVal[i].data
    data.splice(indexImg, 1)
    deleteVal[i].data = data
    setDataClassify(deleteVal)
  }

  // begin classify
  const [datacClassify, setDataClassify] = useState([{ color: "", size: "", quantity: 0, price: 0, data: [] }])
  const handleClickClassify = () => {
    setDataClassify([...datacClassify, { color: "", size: "", quantity: 0, price: 0, data: [] }])
  }
  const handleChangeClassify = (e, i) => {
    const { name, value } = e.target
    const onchangeVal = [...datacClassify]
    onchangeVal[i][name] = value
    setDataClassify(onchangeVal)
  }
  const handleDeleteClassify = (i) => {
    const deleteVal = [...datacClassify]
    if (deleteVal.length > 1) {
      deleteVal.splice(i, 1)
    }
    setDataClassify(deleteVal)
  }
  // end classify
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div style={{ background: "#f6f6f6" }} className=''>
          <div className="row" style={{ margin: "0 10px" }}>
            <div className="partition">
              <div style={{ margin: "10px" }}>
                <div className="row">
                  <h4>Thông tin cơ bản</h4>
                </div>

                <div className="row mt-4">
                  <div className="col-2">
                    <label htmlFor="nameProduct" class="form-label "> Tên Sản Phẩm:</label>
                  </div>
                  <div className="col-10">
                    <input type="text" className="form-control" name="name" onChange={changProduct} value={product.name} id="nameProduct" aria-describedby="emailHelp" />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-2">
                    <label htmlFor="nameProduct" className="form-label " > Mô Tả:</label>
                  </div>
                  <div className="col-10">
                    <div ref={quillRef} className="outline-none text-gray-500 " style={{ width: "100%", height: "232px" }} />
                    {/* <input type="text" className="form-control" name="name" id="nameProduct" aria-describedby="emailHelp" /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* begin Thông tin chi tiết */}
          <div className="row" style={{ margin: "0 10px" }}>
            <div className="partition">
              <div className="row mt-10">
                <h4> Thông tin chi tiết </h4>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="row">
                    <div className="col-2">
                      Thương hiệu:
                    </div>
                    <div className="col-10">
                      <Dropdown onSelect={changProductMaterial} value={product.material}>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" >
                          <div className='form-select'> hello</div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu as={CustomMenu}>
                          {fruits.map(item => {
                            return (
                              <Dropdown.Item key={item.id} eventKey={item.id.toString()}>
                                {item.name}
                              </Dropdown.Item>
                            );
                          })}

                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-2">
                      Thể loại:
                    </div>
                    <div className="col-10">
                      <ComboboxPropertie item={fruits} onchange={changProductMaterial} CustomMenu={CustomMenu} nameCombobox="vui lòng chọn Thương hiệu" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="row">
                    <div className="col-2">
                      Thương hiệu:
                    </div>
                    <div className="col-10">
                      <ComboboxPropertie item={fruits} onchange={changProductMaterial} CustomMenu={CustomMenu} nameCombobox="vui lòng chọn Thương hiệu" />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-2">
                      Thể loại:
                    </div>
                    <div className="col-10">
                      <ComboboxPropertie item={fruits} onchange={changProductMaterial} CustomMenu={CustomMenu} nameCombobox="vui lòng chọn Thương hiệu" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end Thông tin chi tiết */}
          {/* begin phân loại */}
          <div className="row" style={{ margin: "0 10px" }}>
            <div className="partition">
              <div className="row mt-10">
                <h4> Phân Loại sản phẩm </h4>
              </div>
              <div className="row">
                <div className="row mb-3">
                  <i class="ms-3 col-3 text-center uil uil-plus-circle borderButton" onClick={handleClickClassify} >Thêm phân loại</i>
                </div>
                {
                  datacClassify.map((val, i) =>
                    <div key={i}  >
                      <div className='m-3 row borderButton'>
                        <div className="col-2 mt-2 mb-2">
                          <p> Phân Loại {i + 1}</p>
                        </div>
                        <div className="col-9 mt-2 mb-2">
                          <div className='row'>
                            <div className='col-6 mt-2'>
                              <ComboboxPropertie item={fruits} onchange={changProductMaterial} CustomMenu={CustomMenu} nameCombobox="vui lòng chọn Thương hiệu" />
                            </div>
                            <div className="col-6 mt-2">
                              <input name="size" type='text' className='form-control' value={val.size} onChange={(e) => handleChangeClassify(e, i)} />
                            </div>
                          </div>
                          <div className='row'>
                            <div className="col-6 mt-2">
                              <input name="price" type='number' className=' form-control' value={val.price} onChange={(e) => handleChangeClassify(e, i)} />
                            </div>
                            <div className="col-6 mt-2">
                              <input name="quantity" type='number' className='form-control' value={val.quantity} onChange={(e) => handleChangeClassify(e, i)} />
                            </div>
                          </div>
                        </div>
                        <div className="col-1 mt-2 mb-2 centerHeight">
                          <button onClick={() => handleDeleteClassify(i)} className='btn btn-danger'> <i className="uil uil-times-circle"></i></button>
                        </div>
                        {/* begin img */}
                        <div className="row mt-4">
                          <label className='col-2'>Hình ảnh sản phẩm:</label>
                          <div className="col-10">
                            <div className="row">
                              {
                                val.data.map((valImg, index) =>

                                  <div key={index} className='col-1 image'>
                                    <div className="row">
                                      <img src={valImg.img} className=' ' alt='123' />
                                    </div>
                                    <div className="row" style={{ margin: "0" }}>
                                      {/* <div className='col-6 ' style={{ textAlign: "left", padding: "0px" }} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => zoomImg(i)}><i class="uil uil-crop-alt"></i></div> */}
                                      <div className=' text center' onClick={() => {console.log(index);handleDelete(i, index)}}><i class="uil uil-times"></i></div>
                                    </div>
                                  </div>

                                )
                              }
                               {/* <label htmlFor='id' className='col-1 image' style={{ height: "100px", textAlign: "center" }}>
                                <i className="uil uil-image-plus"></i><br />
                                Thêm hình ảnh
                              </label>
                              <input type='file' id='id' onChange={(e) =>{console.log(i +" "+e); handleClick(e, i)}}></input> */}
                              <label htmlFor='addImg' onClick={() => {setIndexImg(i); }} className='col-1 image' style={{ height: "100px", textAlign: "center" }}>
                                <i className="uil uil-image-plus"></i><br />
                                Thêm hình ảnh
                              </label>
                              <input type="file" id="addImg" className='col-2' style={{ display: "none" }} onChange={(e) => handleClick(e)} />
                            </div>
                          </div>
                        </div>
                        {/* end img */}
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          {/* end phân loại */}
        </div>

        <div className='row me-3'>
          <button type="button" class="btn btn-success offset-10 col-2">Thêm mới</button>
        </div>



        {/* begin zoom img */}
        {/* <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <ZoomImage image={url}></ZoomImage>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div> */}
        {/* end zoom img */}
      </div>

    </div>
  )
}

export default CreateProduct