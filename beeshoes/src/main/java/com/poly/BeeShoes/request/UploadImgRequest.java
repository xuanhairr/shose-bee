package com.poly.BeeShoes.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadImgRequest {
    String url;
    boolean main;

    @Override
    public String toString() {
        return "UploadImgRequest{" +
                "url='" + url + '\'' +
                ", main=" + main +
                '}';
    }
}
