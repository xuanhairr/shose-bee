package com.poly.BeeShoes.service.impl;

import com.poly.BeeShoes.model.Notification;
import com.poly.BeeShoes.repository.NotificationRepository;
import com.poly.BeeShoes.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    @Override
    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getTop10() {
        return notificationRepository.getTop10Noti();
    }
}
