package br.com.jtech.tasklist.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {
    @GetMapping("/health")
    public String healthCheck() {
        return "OK";
    }

    @GetMapping
    public String hello() {
        return "<html>" +
                "<a href=/h2-console>\uD83C\uDFB2</a><br />" +
                "<br />" +
                "<a href=/swagger-ui/index.html>\uD83D\uDCD7</a><br />" +
                "</html>"
                ;
    }
}
