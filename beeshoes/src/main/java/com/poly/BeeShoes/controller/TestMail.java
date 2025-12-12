package com.poly.BeeShoes.controller;

import com.poly.BeeShoes.utility.MailUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
public class TestMail {

    private final MailUtility mailUtility;

    @GetMapping("/test-mail-sender")
    public String test() {
        return "test/sendmail";
    }

    @PostMapping("/send-mail")
    public String send(
            @RequestParam("to") String to,
            @RequestParam("subject") String subject,
            @RequestParam("body") String body,
            Model model
    ) {
        mailUtility.sendMail(to, subject, body);
        model.addAttribute("message", "Send mail successfully.");
        return "test/sendmail";
    }
}
