package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.ChatLieu;

import java.util.List;

public interface ChatLieuService {
    ChatLieu save(ChatLieu chatLieu);
    ChatLieu getById(Long id);
    ChatLieu getByTen(String ten);
    List<ChatLieu> getAll();
    List<ChatLieu> getAllClient();
    boolean delete(Long id);

    boolean existsByTen(String ten,Long id);
}
