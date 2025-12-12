package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProductCheckoutRequest {
    Long id_product_detail;
    Integer quantity;
}
