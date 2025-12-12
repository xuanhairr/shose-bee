package com.poly.BeeShoes.utility;

import java.sql.Timestamp;
import java.util.Date;

public class ConvertUtility {
    public static Timestamp DateToTimestamp(Date date) {
        return new Timestamp(date.getTime());
    }

}
