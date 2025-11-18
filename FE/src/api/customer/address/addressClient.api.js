import { requestAdress, requestCustomer } from "../../../helper/request";
export class AddressClientApi {
  static getAllProvince = () => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
      },
      url: `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
    });
  };
  static getAlldistrict = (codeCity) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
      },
      url: `  https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
      params: { province_id: codeCity },
    });
  };
  static getAllWard = (codeDistrict) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
      },
      url: ` https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
      params: { district_id: codeDistrict },
    });
  };

  static getMoneyShip = (to_district_id, to_ward_code) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
        shop_id: "4374133",
      },
      url: ` https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
      params: {
        service_type_id: 2,
        insurance_value: "",
        coupon: "",
        from_district_id: 1485,
        to_district_id: to_district_id,
        to_ward_code: to_ward_code,
        height: 15,
        length: 15,
        weight: 1000,
        width: 15,
      },
    });
  };
  static getDayShip = (to_district_id, to_ward_code) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
        shop_id: "4374133",
      },
      url: `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime`,
      params: {
        from_district_id: 1485,
        from_ward_code: "1A0607",
        to_district_id: to_district_id,
        to_ward_code: to_ward_code,
        service_id: 53320,
      },
    });
  };

  static getByAccountAndStatus = (idAccount) => {
    return requestCustomer({
      method: "GET",
      url: `/client/address/${idAccount}`,
    });
  };
  static getListByAccount = (idAccount) => {
    return requestCustomer({
      method: "GET",
      url: `/client/address/list/${idAccount}`,
    });
  };
  static setDefault = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/address/setDefault`,
      data:data
    });
  };
  static updateAddressClient = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/address/update`,
      data: data
    });
  };
  static createAddressClient = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/address/create`,
      data: data
    });
  };
  static deleteAddressClient = (idAddress) => {
    return requestCustomer({
      method: "DELETE",
      url: `/client/address/delete/${idAddress}`,
    });
  };
  static detailAddressClient = (idAddress) => {
    return requestCustomer({
      method: "GET",
      url: `/client/address/detail/${idAddress}`,
    });
  };
  //Address client
  static fetchAllAddressByUser = (idUser) => {
    return requestCustomer({
      method: "GET",
      url: `/client/address/address-user/${idUser}`,
    });
  };
  static create = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/address`,
      data: data,
    });
  };

  static getOne = (id) => {
    return requestCustomer({
      method: "GET",
      url: `/client/getOne/${id}`,
    });
  };

  static getAddressByUserIdAndStatus = (id) => {
    return requestCustomer({
      method: "GET",
      url: `/client/address/address-user-status/${id}`,
    });
  };

  static update = (id, data) => {
    return requestCustomer({
      method: "PUT",
      url: `/client/address/${id}`,
      data: data,
    });
  };
  static fetchAllProvince = () => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
      },
      url: `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
    });
  };
  static fetchAllProvinceDistricts = (codeProvince) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
      },
      url: `  https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
      params: { province_id: codeProvince },
    });
  };
  static fetchAllProvinceWard = (codeDistrict) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
      },
      url: ` https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
      params: { district_id: codeDistrict },
    });
  };
}
