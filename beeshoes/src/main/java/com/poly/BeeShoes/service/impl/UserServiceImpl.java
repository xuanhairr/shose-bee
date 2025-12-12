package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.KhachHang;
import com.poly.BeeShoes.model.User;
import com.poly.BeeShoes.repository.UserRepository;
import com.poly.BeeShoes.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User getByUsername(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("username does not exist"));
    }

    @Override
    public boolean existByUsername(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User createNewUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User findByKhachHang_Id(Long id) {
        return userRepository.findByKhachHang_Id(id);
    }

    @Override
    public User findByNhanVien_Id(Long id) {
        return userRepository.findByNhanVien_Id(id);
    }

    @Override
    public User update(User user) {
        return userRepository.save(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

}
