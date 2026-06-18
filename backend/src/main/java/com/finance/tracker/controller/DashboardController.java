package com.finance.tracker.controller;

import com.finance.tracker.service.ExpenseService;
import com.finance.tracker.service.IncomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final IncomeService  incomeService;
    private final ExpenseService expenseService;

    public DashboardController(IncomeService incomeService, ExpenseService expenseService) {
        this.incomeService  = incomeService;
        this.expenseService = expenseService;
    }

    // GET /api/dashboard/summary/{userId}
    @GetMapping("/summary/{userId}")
    public ResponseEntity<Map<String, BigDecimal>> getSummary(@PathVariable Integer userId) {
        BigDecimal totalIncome  = incomeService.getTotalIncomeByUser(userId);
        BigDecimal totalExpense = expenseService.getTotalExpenseByUser(userId);
        BigDecimal balance      = totalIncome.subtract(totalExpense);

        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("totalIncome",  totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("balance",      balance);

        return ResponseEntity.ok(summary);
    }
}
