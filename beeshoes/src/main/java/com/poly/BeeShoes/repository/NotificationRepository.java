package com.poly.BeeShoes.repository;

import com.poly.BeeShoes.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query(value = "SELECT * FROM notification ORDER BY id DESC LIMIT 10", nativeQuery = true)
    List<Notification> getTop10Noti();
}
