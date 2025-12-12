package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.Tags;

import java.util.List;

public interface TagsService {
    Tags save(Tags tags);
    List<Tags> getAll();
    Tags getByTen(String ten);
    Tags getById(Long id);
    List<Tags> getAllClient();
    boolean delete(Long id);
    boolean existsByTen(String ten, Long id);
}
