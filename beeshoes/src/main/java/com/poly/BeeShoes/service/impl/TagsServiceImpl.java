package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.Tags;
import com.poly.BeeShoes.model.TheLoai;
import com.poly.BeeShoes.repository.TagsRepository;
import com.poly.BeeShoes.service.TagsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.poly.BeeShoes.library.LibService.chuanHoaTen;
import static com.poly.BeeShoes.library.LibService.convertNameTags;

@Service
@RequiredArgsConstructor
public class TagsServiceImpl implements TagsService {
    private final TagsRepository tagsRepository;
    @Override
    public Tags save(Tags tags) {
        return tagsRepository.save(tags);
    }

    @Override
    public List<Tags> getAll() {
        return tagsRepository.findAll(Sort.by(Sort.Direction.DESC, "ngaySua"));
    }

    @Override
    public Tags getByTen(String ten) {
        return tagsRepository.getFirstByTen(ten);
    }

    @Override
    public Tags getById(Long id) {
        return tagsRepository.findById(id).get();
    }

    @Override
    public List<Tags> getAllClient() {
        return tagsRepository.findAllByTrangThaiIsTrue();
    }

    @Override
    public boolean delete(Long id) {
        if(tagsRepository.existsById(id)){
            tagsRepository.deleteById(id);
        }
        return false;
    }

    @Override
    public boolean existsByTen(String ten, Long id) {
        String tenChuanHoa = convertNameTags(ten);
        List<Tags> lstTag = tagsRepository.findAll();
        List<Tags> lstTrungTen = lstTag.stream()
                .filter(cg -> {
                    if (cg.getTen().equals(tenChuanHoa) && !cg.getId().equals(id)) {
                        return true;
                    }
                    return false;
                })
                .collect(Collectors.toList());
        return !lstTrungTen.isEmpty();
    }
}
