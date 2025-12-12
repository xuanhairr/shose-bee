package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.ChatLieu;
import com.poly.BeeShoes.repository.ChatLieuRepository;
import com.poly.BeeShoes.service.ChatLieuService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.poly.BeeShoes.library.LibService.chuanHoaTen;

@Service
@RequiredArgsConstructor
public class ChatLieuServiceImpl implements ChatLieuService {
    private final ChatLieuRepository chatLieuRepository;
    @Override
    public ChatLieu save(ChatLieu chatLieu) {
        return chatLieuRepository.save(chatLieu);
    }

    @Override
    public ChatLieu getById(Long id) {
        return chatLieuRepository.findById(id).get();
    }

    @Override
    public ChatLieu getByTen(String ten) {
        return chatLieuRepository.getFirstByTen(ten);
    }

    @Override
    public List<ChatLieu> getAll() {
        return chatLieuRepository.findAll(Sort.by(Sort.Direction.DESC, "ngaySua"));
    }

    @Override
    public List<ChatLieu> getAllClient() {
        return chatLieuRepository.findAllByTrangThaiIsTrue();
    }

    @Override
    public boolean delete(Long id) {
        ChatLieu cl = chatLieuRepository.findById(id).get();
        if (cl.getId()!=null){
            chatLieuRepository.deleteById(cl.getId());
            return true;
        }
        return false;
    }

    @Override
    public boolean existsByTen(String ten, Long id) {
        String tenChuanHoa = chuanHoaTen(ten);
        List<ChatLieu> lst = chatLieuRepository.findAll();
        List<ChatLieu> coGiayTrungTen = lst.stream()
                .filter(cg -> {
                    if (chuanHoaTen(cg.getTen()).equals(tenChuanHoa) && !cg.getId().equals(id)) {
                        return true;
                    }
                    return false;
                })
                .collect(Collectors.toList());
        return !coGiayTrungTen.isEmpty();
    }
}
