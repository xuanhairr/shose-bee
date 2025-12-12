package com.poly.BeeShoes.utility;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class MailUtility {

    private final JavaMailSender mailSender;
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    public void sendMail(String toEmail, String subject, String body) {
        executorService.submit(() -> {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(body,true);
                mailSender.send(message);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
}
