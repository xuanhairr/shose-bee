package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.KhachHang;
import com.poly.BeeShoes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    User getUserByEmail(String email);

    boolean existsByEmail(String email);

    User findByKhachHang_Id(Long id);

    User findByNhanVien_Id(Long id);
}
