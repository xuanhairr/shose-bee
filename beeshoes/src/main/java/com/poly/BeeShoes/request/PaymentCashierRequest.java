package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PaymentCashierRequest {
    String product;
    String customer;
    String receivingType;
    String address;
    String typePayment;
    Integer cash;
    Integer transfer;
    String transferCode;
    String voucher;
    Integer shippingFee;
    String shippingCode;
    String hoten;
    String email;
    String sdt;
}
