package com.pgkart.controller;

import com.pgkart.payload.AnalyticsResponse;
import com.pgkart.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<AnalyticsResponse> getDashboardAnalytics() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }
}
