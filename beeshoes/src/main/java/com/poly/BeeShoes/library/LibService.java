package com.poly.BeeShoes.library;

import com.poly.BeeShoes.request.ProductDetailVersion;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class LibService {
    public static BigDecimal convertStringToBigDecimal(String str) {
        if (str.contains(".")) {
            str = str.replace(".", "");
        }
        if (str.contains("đ")) {
            str = str.replace("đ", "");
        }
        BigDecimal bd = new BigDecimal(str);
        return bd;
    }

    public static double calculatePercentageChange(int yesterday, int today) {
        if (yesterday == 0 && today != 0) {
            return 100.0;
        }
        if (yesterday != 0 && today == 0) {
            return 100.0;
        }
        if (yesterday + today == 0) {
            return 0.0;
        }
        double percentageChange = ((double) (today - yesterday) / yesterday) * 100;
        double absoluteValue = Math.abs(percentageChange);
        absoluteValue = Math.round(absoluteValue * 100.0) / 100.0;
        return absoluteValue;
    }


    public static String chuanHoaTen(String ten) {
        return ten.toLowerCase().replaceAll("\\s+", "");
    }

    public static String convertNameTags(String input) {
        input = input.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        if (input.length() > 0 && input.charAt(0) != '#') {
            input = "#" + input;
        }
        return input;
    }

    public static boolean isNumeric(String str) {
        // Sử dụng regex để kiểm tra xem chuỗi chỉ chứa số hay không
        return str.matches("\\d+");
    }

    public static boolean containsAlphabetic(String str) {
        for (char c : str.toCharArray()) {
            if (Character.isLetter(c)) {
                return true;
            }
        }
        return false;
    }

    public static List<String> checkDataProduct(Long sanPham, Long theLoai, Long thuongHieu, Long chatLieu, Long deGiay, Long coGiay, Long muiGiay, String giaNhap, String giaGoc) {
        List<String> lst = new ArrayList<>();
        if (sanPham < 1) {
            lst.add("sanPham");
        } else if (theLoai < 1) {
            lst.add("theLoai");
        } else if (thuongHieu < 1) {
            lst.add("thuongHieu");
        } else if (chatLieu < 1) {
            lst.add("chatLieu");
        } else if (deGiay < 1) {
            lst.add("deGiay");
        } else if (coGiay < 1) {
            lst.add("coGiay");
        } else if (muiGiay < 1) {
            lst.add("muiGiay");
        } else if (giaGoc.isEmpty()) {
            lst.add("giaGoc");
        } else if (giaNhap.isEmpty()) {
            lst.add("giaNhap");
        } else {
            lst = null;
        }
        return lst;
    }

    public BigDecimal StringToBigDecimal(String str) {
        if (str.contains(".")) {
            str = str.replace(".", "");
        }
        if (str.contains("đ")) {
            str = str.replace("đ", "");
        }
        BigDecimal bd = new BigDecimal(str);
        return bd;
    }

    public static List<String> checkDataProductDetail(List<String> lst, List<ProductDetailVersion> productdetail, String[] array) {
        if (array == null) {
            lst.add("Anh");
            return lst;
        }
        if (productdetail == null) {
            lst.add("Version");
            return lst;
        }
        for (ProductDetailVersion pr : productdetail) {
            String gia = pr.getGiaBan().replace(".", "");
            gia = gia.replace("đ", "");
            int gb = Integer.valueOf(gia);
            if (gb < 999) {
                lst.add("giaBan");
            } else if (pr.getMaMauSac().isEmpty()) {
                lst.add("mauSac");
            } else if (pr.getKichCo().isEmpty()) {
                lst.add("kichCo");
            } else if (pr.getSoLuong() < 0) {
                lst.add("soLuong");
            }

        }
        return lst;
    }

    //==========
    public static String generateRandomString(int length) {
        String uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowercase = "abcdefghijklmnopqrstuvwxyz";
        String specialChars = "!@#$%^&*()-_=+[{]};:'\",<.>/?";
        String allChars = uppercase + lowercase + specialChars;

        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        // Thêm ít nhất một kí tự hoa, một kí tự thường và một kí tự đặc biệt vào chuỗi
        sb.append(uppercase.charAt(random.nextInt(uppercase.length())));
        sb.append(lowercase.charAt(random.nextInt(lowercase.length())));
        sb.append(specialChars.charAt(random.nextInt(specialChars.length())));

        // Thêm các kí tự ngẫu nhiên cho đến khi đạt được độ dài mong muốn
        for (int i = 3; i < length; i++) {
            sb.append(allChars.charAt(random.nextInt(allChars.length())));
        }

        // Trộn ngẫu nhiên chuỗi
        String shuffledString = shuffleString(sb.toString());

        return shuffledString;
    }

    public static String shuffleString(String string) {
        char[] charArray = string.toCharArray();
        Random random = new Random();
        for (int i = 0; i < charArray.length; i++) {
            int randomIndex = random.nextInt(charArray.length);
            char temp = charArray[i];
            charArray[i] = charArray[randomIndex];
            charArray[randomIndex] = temp;
        }
        return new String(charArray);
    }
}
