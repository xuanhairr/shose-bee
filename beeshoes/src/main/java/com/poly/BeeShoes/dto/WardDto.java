package com.poly.BeeShoes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class WardDto {
    @JsonProperty("WardCode")
    private String WardCode;
    @JsonProperty("DistrictID")
    private int DistrictID;
    @JsonProperty("WardName")
    private String WardName;
}
