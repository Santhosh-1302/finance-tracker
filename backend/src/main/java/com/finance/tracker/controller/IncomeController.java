package com.finance.tracker.controller;

import com.finance.tracker.entity.Income;
import com.finance.tracker.service.IncomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@CrossOrigin(origins = "*")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    // GET /api/incomes
    @GetMapping
    public ResponseEntity<List<Income>> getAllIncomes() {
        return ResponseEntity.ok(incomeService.getAllIncomes());
    }

    // GET /api/incomes/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Income>> getIncomesByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(incomeService.getIncomesByUser(userId));
    }

    // POST /api/incomes/{userId}
    @PostMapping("/{userId}")
    public ResponseEntity<Income> createIncome(
            @PathVariable Integer userId,
            @RequestBody Income income) {

        System.out.println("Received Amount = " + income.getAmount());

        return ResponseEntity.ok(
                incomeService.createIncome(userId, income)
        );
    }

    // DELETE /api/incomes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIncome(@PathVariable Integer id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.ok("Income deleted successfully");
    }
}
