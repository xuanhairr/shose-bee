package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.RequestParam;

@Getter
@Setter
public class AddProductOderRequest {
     Long id;
     String mauSac;
     Long kichCo;
     Long sanPham;
     Integer soLuong;
}
