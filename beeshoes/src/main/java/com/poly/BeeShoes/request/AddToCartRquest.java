package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToCartRquest {
    boolean update;
    Integer quantity;
    Long product;
}
