package com.poly.BeeShoes.service;

import com.poly.BeeShoes.model.Notification;

import java.util.List;

public interface NotificationService {
    Notification save(Notification notification);
    List<Notification> getTop10();
}
